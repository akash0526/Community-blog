export function imageAltFromFileName(fileName = "") {
	const altText = String(fileName)
		.replace(/\.[^.]*$/, "")
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	return altText || "Article image";
}

function escapeMarkdownLabel(value) {
	return String(value || "")
		.replace(/\\/g, "\\\\")
		.replace(/\[/g, "\\[")
		.replace(/\]/g, "\\]")
		.replace(/[\r\n]+/g, " ")
		.trim();
}

function escapeMarkdownTitle(value) {
	return String(value || "")
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/[\r\n]+/g, " ")
		.trim();
}

export function createMarkdownImage({ url, alt, caption = "" }) {
	const safeUrl = String(url || "")
		.trim()
		.replace(/[\r\n<>]/g, "");
	if (!safeUrl) throw new Error("An image URL is required.");

	const safeAlt = escapeMarkdownLabel(alt) || "Article image";
	const safeCaption = escapeMarkdownTitle(caption);
	const title = safeCaption ? ` "${safeCaption}"` : "";

	return `![${safeAlt}](<${safeUrl}>${title})`;
}

/** Insert a block-level Markdown image at the editor's captured selection,
 * separating it from surrounding prose without changing any other text. */
export function insertMarkdownBlockAtSelection(content, selection, markdown) {
	const source = String(content || "");
	const requestedStart = Number.isInteger(selection?.start)
		? selection.start
		: source.length;
	const requestedEnd = Number.isInteger(selection?.end)
		? selection.end
		: requestedStart;
	const start = Math.max(0, Math.min(requestedStart, source.length));
	const end = Math.max(start, Math.min(requestedEnd, source.length));
	const before = source.slice(0, start);
	const after = source.slice(end);
	const prefix = !before
		? ""
		: before.endsWith("\n\n")
			? ""
			: before.endsWith("\n")
				? "\n"
				: "\n\n";
	const suffix = !after
		? ""
		: after.startsWith("\n\n")
			? ""
			: after.startsWith("\n")
				? "\n"
				: "\n\n";

	return {
		content: `${before}${prefix}${markdown}${suffix}${after}`,
		cursorPosition: start + prefix.length + markdown.length + suffix.length,
	};
}
