// lib/articles.js
// Centralized data-access helpers so sitemap, blog pages, OG images and the
// homepage all fetch articles the same way (DRY + consistent SEO signals).

import { supabase } from "@/lib/supabase";
import { storyCategoryValues } from "@/lib/categories";

/**
 * Canonical site URL.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (especially once you move to a custom domain)
 * so that canonical URLs, the sitemap, OpenGraph and JSON-LD all stay correct.
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://www.apex-nepal.com"
).replace(/\/$/, "");

// Homepage allow-list — only these 5 pillars are public. Old Qatar categories
// are excluded even if still `published` (until archive migration sets draft).
export const ALLOWED_CATEGORIES = storyCategoryValues;

/** Slim column set for list/card views — excludes the heavy `content` body. */
const ARTICLE_LIST_COLUMNS = `id, slug, title, meta_description, category, image_url, published_at, updated_at, created_at, status, target_keyword, profiles(full_name, professional_role, avatar_url)`;

/**
 * Paginated published articles — only the columns needed for cards/lists.
 * This keeps the payload tiny and fast regardless of how many articles exist.
 *
 * @param {number} limit  – max rows per page (default 12)
 * @param {number} offset – skip this many rows (default 0)
 */
export async function getPaginatedArticles(limit = 12, offset = 0) {
	try {
		const { data, error } = await supabase
			.from("articles")
			.select(ARTICLE_LIST_COLUMNS)
			.eq("status", "published")
			.in("category", ALLOWED_CATEGORIES)
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
 */
export async function getPublishedArticleCount() {
	try {
		const { count, error } = await supabase
			.from("articles")
			.select("*", { count: "exact", head: true })
			.eq("status", "published")
			.in("category", ALLOWED_CATEGORIES);

		if (!error && typeof count === "number") return count;
	} catch (err) {}
	return 0;
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
