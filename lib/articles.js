// lib/articles.js
// Centralized data-access helpers so sitemap, blog pages, OG images and the
// homepage all fetch articles the same way (DRY + consistent SEO signals).

import { supabase } from "@/lib/supabase";
import { resolveCategory, storedValuesForCategory } from "@/lib/categories";
import { authorSlugFor } from "@/lib/seoUtils";

/**
 * Canonical site URL.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (especially once you move to a custom domain)
 * so that canonical URLs, the sitemap, OpenGraph and JSON-LD all stay correct.
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://www.apex-nepal.com"
).replace(/\/$/, "");

/** Profile columns for bylines/schema. The FULL set needs the trust-fix +
 *  SEO-playbook migrations (username/website/twitter/linkedin/location/
 *  expertise). Queries try FULL first and fall back to SLIM on error, so the
 *  site never breaks if code deploys before the SQL runs (or vice versa). */
const PROFILE_FULL =
	"full_name, professional_role, avatar_url, bio, username, website, twitter, linkedin, location, expertise";
const PROFILE_SLIM = "full_name, professional_role, avatar_url, bio";

/** Slim column set for list/card views — excludes the heavy `content` body.
 *  NOTE: `seo_title` is deliberately NOT listed here. It arrives with the
 *  SEO-playbook migration; naming a not-yet-existing column would make
 *  PostgREST error the whole list query. The article page uses select("*")
 *  and picks it up automatically once the column exists. */
const ARTICLE_LIST_COLUMNS = `id, slug, title, meta_description, category, image_url, published_at, updated_at, created_at, status, target_keyword`;

function listSelect(profileCols) {
	return `${ARTICLE_LIST_COLUMNS}, profiles(${profileCols})`;
}

/**
 * Paginated published articles — only the columns needed for cards/lists.
 * This keeps the payload tiny and fast regardless of how many articles exist.
 *
 * Supports server-side search + category filtering so "Load more" and search
 * work across the whole archive, not just the rows already in the browser.
 * Category filters match the canonical value plus its exact-renamed legacy
 * values (storedValuesForCategory). Broad legacy buckets that route by
 * title keywords join their category only once SQL Step 4 has run.
 *
 * @param {number} limit  – max rows per page (default 12)
 * @param {number} offset – skip this many rows (default 0)
 * @param {{q?: string, category?: string}} filters – optional search/category
 * @returns {Promise<any[]>}
 */
export async function getPaginatedArticles(limit = 12, offset = 0, filters = {}) {
	// No project configured (local demo / CI): answer instantly instead of
	// waiting on a placeholder host that will never respond.
	if (!hasSupabaseCredentials()) return [];
	const { q = "", category = "" } = filters;

	const run = async (profileCols) => {
		let query = supabase
			.from("articles")
			.select(listSelect(profileCols))
			.eq("status", "published");

		if (category && category !== "All") {
			const resolved = resolveCategory(category);
			if (resolved) {
				query = query.in("category", storedValuesForCategory(resolved.value));
			} else {
				query = query.eq("category", category);
			}
		}
		if (q.trim()) {
			const needle = `%${q.trim().replace(/[%_]/g, "")}%`;
			query = query.or(
				`title.ilike.${needle},meta_description.ilike.${needle},target_keyword.ilike.${needle}`,
			);
		}

		return query
			.order("published_at", { ascending: false })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);
	};

	try {
		let { data, error } = await run(PROFILE_FULL);
		if (error) ({ data, error } = await run(PROFILE_SLIM));
		if (!error && data) return data;
	} catch (err) {
		// network / env error — fail closed with an empty list
	}
	return [];
}

/**
 * Total count of published articles — used to calculate "hasMore" for pagination.
 * Accepts the same filters as getPaginatedArticles so filtered views paginate correctly.
 * @returns {Promise<number>}
 */
export async function getPublishedArticleCount(filters = {}) {
	if (!hasSupabaseCredentials()) return 0;
	const { q = "", category = "" } = filters;
	try {
		let query = supabase
			.from("articles")
			.select("*", { count: "exact", head: true })
			.eq("status", "published");

		if (category && category !== "All") {
			const resolved = resolveCategory(category);
			if (resolved) {
				query = query.in("category", storedValuesForCategory(resolved.value));
			} else {
				query = query.eq("category", category);
			}
		}
		if (q.trim()) {
			const needle = `%${q.trim().replace(/[%_]/g, "")}%`;
			query = query.or(
				`title.ilike.${needle},meta_description.ilike.${needle},target_keyword.ilike.${needle}`,
			);
		}

		const { count, error } = await query;

		if (!error && typeof count === "number") return count;
	} catch (err) {}
	return 0;
}

/**
 * Author slugs for the sitemap — ONLY authors with ≥1 published article
 * (playbook §4: zero-post byline pages like the old founder page are thin
 * content and must not be advertised to crawlers). Prefers `username`.
 * @returns {Promise<string[]>}
 */
export async function getAllAuthorSlugs() {
	if (!hasSupabaseCredentials()) return [];
	try {
		const { data: published } = await supabase
			.from("articles")
			.select("author_id")
			.eq("status", "published");
		const authorIds = [...new Set((published || []).map((r) => r?.author_id).filter(Boolean))];
		if (!authorIds.length) return [];

		const run = (cols) => supabase.from("profiles").select(cols).in("id", authorIds);
		let { data, error } = await run("full_name, username");
		if (error) ({ data, error } = await run("full_name"));

		return (data || []).map((row) => authorSlugFor(row)).filter(Boolean);
	} catch (err) {
		return [];
	}
}

/** All published articles, newest first. Full rows (includes body for article page).
 * @returns {Promise<any[]>} */
export async function getAllPublishedArticles() {
	const run = (profileCols) =>
		supabase
			.from("articles")
			.select(`*, profiles(${profileCols})`)
			.eq("status", "published")
			.order("created_at", { ascending: false });
	try {
		let { data, error } = await run(PROFILE_FULL);
		if (error) ({ data, error } = await run(PROFILE_SLIM));
		if (!error && data) return data;
	} catch (err) {
		// network / env error — fail closed with an empty list
	}
	return [];
}

/** Lightweight list for sitemap generation. Uses explicit long-lived columns
 *  so it never breaks if an optional column is missing from the live table.
 * @returns {Promise<any[]>} */
export async function getAllPublishedSlugs() {
	if (!hasSupabaseCredentials()) return [];
	try {
		const { data } = await supabase
			.from("articles")
			.select("slug, updated_at, published_at, created_at")
			.eq("status", "published");

		const rows = (data || []).filter((row) => row && row.slug);

		// De-duplicate by NFC-normalized slug (avoids Unicode double-listing).
		const seen = new Set();
		return rows.filter((row) => {
			const key = String(row.slug).normalize("NFC");
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	} catch (err) {
		return [];
	}
}

/**
 * Robust single-article lookup that survives Nepali / Devanagari Unicode quirks.
 * Strategy: exact match -> fuzzy normalized match across published articles.
 * select("*") picks up optional SEO columns (seo_title, tested_method,
 * sources, reviewer_*, has_affiliate_links) once the migration has run.
 * @returns {Promise<any|null>}
 */
export async function getArticleBySlug(rawSlug) {
	const decodedSlug = decodeURIComponent(rawSlug || "").normalize("NFC");

	// Demo mode: never wait on an unconfigured Supabase project.
	if (!hasSupabaseCredentials()) return seedArticle(decodedSlug);

	const exact = async (profileCols) =>
		supabase
			.from("articles")
			.select(`*, profiles(${profileCols})`)
			.eq("slug", decodedSlug)
			.maybeSingle();

	// 1. Exact match (Postgres eq). maybeSingle() avoids throwing on zero rows.
	try {
		let { data, error } = await exact(PROFILE_FULL);
		if (error) ({ data, error } = await exact(PROFILE_SLIM));
		if (!error && data) return data;
	} catch (err) {
		// fall through to fuzzy
	}

	// 2. Fuzzy: compare normalized slugs against published articles
	// (handles NFC vs NFD storage differences and stray encoding artifacts).
	try {
		const fuzzy = async (profileCols) =>
			supabase
				.from("articles")
				.select(`*, profiles(${profileCols})`)
				.eq("status", "published");
		let { data, error } = await fuzzy(PROFILE_FULL);
		if (error) ({ data } = await fuzzy(PROFILE_SLIM));

		if (data) {
			const match = data.find(
				(a) => String(a.slug || "").normalize("NFC") === decodedSlug,
			);
			if (match) return match;
		}
	} catch (err) {
		// ignore
	}

	// Demo mode (no Supabase credentials): serve the seeded stories so the
	// archive is browsable instead of every card 404-ing.
	if (!hasSupabaseCredentials()) {
		const match = await seedArticle(decodedSlug);
		if (match) return match;
	}

	return null;
}

/** True when a real Supabase project is configured for this deployment. */
function hasSupabaseCredentials() {
	return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/** Seed lookup (dynamic import keeps the sample content out of every
 *  server bundle that merely imports lib/articles). */
async function seedArticle(slug) {
	const { fallbackArticles } = await import("./seedData");
	return (
		fallbackArticles.find(
			(a) => String(a.slug || "").normalize("NFC") === slug,
		) || null
	);
}

/**
 * Sibling posts for the article-page "Keep reading" block and hub pages
 * (playbook §6.4 hub-and-spoke): same canonical category first, topped up
 * with the newest posts so the block is never empty on a young site.
 * @returns {Promise<any[]>}
 */
export async function getRelatedArticles(article, limit = 4) {
	if (!article) return [];

	// Demo mode: resolve siblings from the seeded stories without waiting
	// on an unconfigured Supabase project.
	if (!hasSupabaseCredentials()) {
		const { fallbackArticles } = await import("./seedData");
		return fallbackArticles
			.filter((a) => a.slug !== article.slug)
			.slice(0, limit);
	}
	const hint = `${article.title || ""} ${article.target_keyword || ""}`;
	const resolved = resolveCategory(article.category, hint);
	const exclude = String(article.slug || "").normalize("NFC");

	const sameCategory = resolved
		? await getPaginatedArticles(limit + 4, 0, { category: resolved.value })
		: [];
	let related = sameCategory.filter(
		(a) => String(a.slug || "").normalize("NFC") !== exclude,
	);

	if (related.length < limit) {
		const newest = await getPaginatedArticles(limit + 4, 0);
		const seen = new Set(related.map((a) => a.slug));
		for (const row of newest) {
			if (related.length >= limit) break;
			if (!row?.slug || row.slug === article.slug || seen.has(row.slug)) continue;
			related.push(row);
			seen.add(row.slug);
		}
	}
	return related.slice(0, limit);
}

/** Published posts that belong to a hub/category, for pillar pages.
 * @returns {Promise<any[]>} */
export async function getArticlesForCategory(canonicalValue, limit = 24) {
	return getPaginatedArticles(limit, 0, { category: canonicalValue });
}
