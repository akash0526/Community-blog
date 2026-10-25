// lib/seoUtils.js
/**
 * Removes "Slug: ..." leaks and character count notes from CMS fields.
 * Example: "My Great Article Slug: my-great-article" -> "My Great Article"
 * Example: "This is a summary... (159 characters)" -> "This is a summary..."
 */
export function sanitizeCmsField(text) {
	if (!text) return "";

	return text
		// Remove "Slug: ..." pattern (case insensitive)
		.replace(/\s*slug:\s*[\w-]+$/i, "")
		// Remove character count patterns like "(159 characters)" or "(१५९ क्यारेक्टर)"
		.replace(/\s*\(\d+\s*(characters|chars|क्यारेक्टर)\)$/i, "")
		.trim();
}

/**
 * Display-safe excerpt for cards and SERP descriptions.
 * Repairs a production CMS leak where "Compare …" was stored as "mpare …".
 */
export function cleanExcerpt(text) {
	if (!text) return "";
	let value = sanitizeCmsField(String(text));
	if (/^mpare\b/i.test(value)) value = `Compare${value.slice(5)}`;
	return value;
}

/** Strip phone numbers from public bios so a personal number never renders. */
export function cleanBio(text) {
	if (!text) return "";
	return String(text)
		.replace(/(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\d[\s-]?){8,}\d/g, "")
		.replace(/\s{2,}/g, " ")
		.replace(/\s+([.,])/g, "$1")
		.trim();
}

/**
 * Simple detection for Devanagari script (used in Nepali/Hindi).
 * Matches the Unicode range U+0900 to U+097F.
 */
export function detectLanguage(text) {
	if (!text) return "en";
	const devanagariPattern = /[\u0900-\u097F]/;
	return devanagariPattern.test(text) ? "ne" : "en";
}

// ---------------------------------------------------------------------------
// SEO <title> vs H1 (playbook §5.3/§6.1). The H1 can stay long and
// descriptive; the <title> must fit ~60 characters or Google truncates /
// rewrites it (11 of 14 posts were 74–108 chars). Resolution order:
//   1. `seo_title` column (Supabase, set in Studio or via migration) — used
//      verbatim as an absolute title. It is written standalone (no brand
//      suffix), exactly like the rewrites in playbook §6.1.
//   2. H1 that would overflow WITH the suffix (> 47 chars, since
//      " | Apex Nepal" adds 13): used as an absolute title with NO
//      suffix, so the suffix never pushes it further over.
//   3. Short H1: plain string, so the root template appends the brand.
// Returns a Next.js Metadata `title` value.
// ---------------------------------------------------------------------------
export const SEO_TITLE_MAX = 60;

export function articleMetadataTitle(article) {
	const seoTitle = sanitizeCmsField(String(article?.seo_title || "")).trim();
	const h1 = sanitizeCmsField(
		String(article?.title || "").replace(/\s*Slug:.*$/i, "").trim(),
	);
	if (seoTitle) return { absolute: seoTitle };
	// 47 + " | Apex Nepal".length (13) = 60 = SEO_TITLE_MAX.
	if (h1.length > SEO_TITLE_MAX - " | Apex Nepal".length) return { absolute: h1 };
	return h1;
}

/** Author URL slug: the `username` column wins (one canonical byline URL),
 *  name-derived slug is only a fallback for profiles without one. */
export function authorSlugFor(profile) {
	const username = String(profile?.username || "").trim().toLowerCase();
	if (username) return username;
	return String(profile?.full_name || "apex-editorial")
		.toLowerCase()
		.replace(/\s+/g, "-");
}

/** Parse the `sources` jsonb column into [{label, url}] for the Sources
 *  list at the end of YMYL posts (playbook §4/§6.3). Tolerates null,
 *  plain URL strings, and stringified JSON. */
export function parseSources(raw) {
	let value = raw;
	if (typeof value === "string") {
		try {
			value = JSON.parse(value);
		} catch {
			value = value.split("\n").map((s) => s.trim()).filter(Boolean);
		}
	}
	if (!Array.isArray(value)) return [];
	return value
		.map((item) => {
			if (!item) return null;
			if (typeof item === "string") return { label: item, url: item };
			const url = String(item.url || item.href || "").trim();
			if (!url) return null;
			return { label: String(item.label || item.title || url), url };
		})
		.filter((s) => s && /^https?:\/\//i.test(s.url));
}
