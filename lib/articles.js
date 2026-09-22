// lib/articles.js
// Centralized data-access helpers so sitemap, blog pages, OG images and the
// homepage all fetch articles the same way (DRY + consistent SEO signals).

import { supabase } from "@/lib/supabase";

/**
 * Canonical site URL.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (especially once you move to a custom domain)
 * so that canonical URLs, the sitemap, OpenGraph and JSON-LD all stay correct.
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://www.apex-nepal.com"
).replace(/\/$/, "");

/** Slim column set for list/card views — excludes the heavy `content` body. */
const ARTICLE_LIST_COLUMNS = `id, slug, title, meta_description, category, image_url, published_at, updated_at, created_at, status, target_keyword, profiles(full_name, professional_role, avatar_url)`;

/**
 * Paginated published articles — only the columns needed for cards/lists.
 * This keeps the payload tiny and fast regardless of how many articles exist.
 *
 * Supports server-side search + category filtering so "Load more" and search
 * work across the whole archive, not just the rows already in the browser.
 *
 * @param {number} limit  – max rows per page (default 12)
 * @param {number} offset – skip this many rows (default 0)
 * @param {{q?: string, category?: string}} filters – optional search/category
 */
export async function getPaginatedArticles(limit = 12, offset = 0, filters = {}) {
	const { q = "", category = "" } = filters;
	try {
		let query = supabase
			.from("articles")
			.select(ARTICLE_LIST_COLUMNS)
			.eq("status", "published");

		if (category && category !== "All") {
			query = query.eq("category", category);
		}
		if (q.trim()) {
			const needle = `%${q.trim().replace(/[%_]/g, "")}%`;
			query = query.or(
				`title.ilike.${needle},meta_description.ilike.${needle},target_keyword.ilike.${needle}`,
			);
		}

		const { data, error } = await query
			.order("published_at", { ascending: false })
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (!error && data) return data;
	} catch (err) {
		// network / env error — fail closed with an empty list
	}
	return [];
}

/**
 * Total count of published articles — used to calculate "hasMore" for pagination.
 * Accepts the same filters as getPaginatedArticles so filtered views paginate correctly.
 */
export async function getPublishedArticleCount(filters = {}) {
	const { q = "", category = "" } = filters;
	try {
		let query = supabase
			.from("articles")
			.select("*", { count: "exact", head: true })
			.eq("status", "published");

		if (category && category !== "All") {
			query = query.eq("category", category);
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
 * All author profile slugs for the sitemap. Prefers the `username` column
 * (added by the trust-fix migration) and falls back to the same
 * name-derived slug the author pages resolve.
 */
export async function getAllAuthorSlugs() {
	try {
		const { data } = await supabase
			.from("profiles")
			.select("full_name, username");

		return (data || [])
			.map((row) => {
				const slug =
					row?.username ||
					(row?.full_name || "").toLowerCase().replace(/\s+/g, "-");
				return slug ? String(slug).trim() : "";
			})
			.filter(Boolean);
	} catch (err) {
		return [];
	}
}

/** All published articles, newest first. Full rows (includes body for article page). */
export async function getAllPublishedArticles() {
	try {
		const { data, error } = await supabase
			.from("articles")
			.select("*, profiles(full_name, professional_role, avatar_url, bio)")
			.eq("status", "published")
			.order("created_at", { ascending: false });

		if (!error && data) return data;
	} catch (err) {
		// network / env error — fail closed with an empty list
	}
	return [];
}

/** Lightweight list for sitemap generation. Uses select("*") (not explicit
 *  columns) so it never breaks if a column is missing from the live table. */
export async function getAllPublishedSlugs() {
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
 */
export async function getArticleBySlug(rawSlug) {
	const decodedSlug = decodeURIComponent(rawSlug || "").normalize("NFC");

	// 1. Exact match (Postgres eq). maybeSingle() avoids throwing on zero rows.
	try {
		const { data, error } = await supabase
			.from("articles")
			.select("*, profiles(full_name, professional_role, avatar_url, bio)")
			.eq("slug", decodedSlug)
			.maybeSingle();

		if (!error && data) return data;
	} catch (err) {
		// fall through to fuzzy
	}

	// 2. Fuzzy: compare normalized slugs against published articles
	// (handles NFC vs NFD storage differences and stray encoding artifacts).
	try {
		const { data } = await supabase
			.from("articles")
			.select("*, profiles(full_name, professional_role, avatar_url, bio)")
			.eq("status", "published");

		if (data) {
			const match = data.find(
				(a) => String(a.slug || "").normalize("NFC") === decodedSlug,
			);
			if (match) return match;
		}
	} catch (err) {
		// ignore
	}

	return null;
}
