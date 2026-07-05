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
 * Simple detection for Devanagari script (used in Nepali/Hindi).
 * Matches the Unicode range U+0900 to U+097F.
 */
export function detectLanguage(text) {
	if (!text) return "en";
	const devanagariPattern = /[\u0900-\u097F]/;
	return devanagariPattern.test(text) ? "ne" : "en";
}
