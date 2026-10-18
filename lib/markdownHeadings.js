/**
 * Heading extraction for the article reading experience.
 *
 * The published-article page builds its "On this page" table of contents
 * (and the in-body heading anchor ids) from the raw Markdown an author
 * wrote in the Studio. Both sides MUST agree on the ids, so the TOC and
 * the renderer (`components/ArticleBody.jsx`) share this one module:
 * `extractHeadings` returns the headings in document order with the exact
 * `id` the renderer will put on the corresponding <h2>/<h3>.
 */

/** Strip inline Markdown so a heading reads as plain text in the TOC. */
export function headingPlainText(raw = "") {
	return String(raw)
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
		.replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
		.replace(/(\*|_)(.*?)\1/g, "$2") // italic
		.replace(/~~(.*?)~~/g, "$1") // strikethrough
		.replace(/`([^`]*)`/g, "$1") // inline code
		.replace(/<[^>]+>/g, "") // raw HTML tags
		.trim();
}

/** URL-safe anchor for a heading, e.g. "1. Getting Started!" -> "1-getting-started". */
export function slugifyHeading(raw = "") {
	const slug = headingPlainText(raw)
		.toLowerCase()
		.normalize("NFKD")
		// Keep letters/numbers/marks in any script — Devanagari vowel signs
		// are combining marks, so stripping them would mangle Nepali text.
		.replace(/[^\p{Letter}\p{Number}\p{Mark}\s-]/gu, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
	return slug || "section";
}

/**
 * Headings (levels 2 and 3) in document order, ignoring anything inside
 * fenced code blocks. Duplicate slugs get `-2`, `-3`, … suffixes so every
 * anchor on the page stays unique and the TOC never points at the wrong
 * section.
 *
 * @param {string} markdown
 * @returns {{ id: string, text: string, level: 2 | 3 }[]}
 */
export function extractHeadings(markdown = "") {
	const headings = [];
	const seen = new Map();
	let inFence = false;

	for (const line of String(markdown).split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;

		const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
		if (!match) continue;

		const text = headingPlainText(match[2]);
		if (!text) continue;

		const base = slugifyHeading(match[2]);
		const count = (seen.get(base) || 0) + 1;
		seen.set(base, count);

		headings.push({
			id: count === 1 ? base : `${base}-${count}`,
			text,
			level: match[1].length,
		});
	}

	return headings;
}

/** Estimated reading time in whole minutes (never below 1). */
export function readingTimeMinutes(markdown = "", wordsPerMinute = 200) {
	const words = String(markdown).split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / wordsPerMinute));
}

/** Word count of a Markdown body, for the article byline. */
export function wordCount(markdown = "") {
	return String(markdown).split(/\s+/).filter(Boolean).length;
}
