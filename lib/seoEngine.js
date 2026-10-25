// lib/seoEngine.js

export function analyzeSeo(article) {
	const {
		title = "",
		seoTitle = "",
		targetKeyword = "",
		metaDescription = "",
		content = "",
	} = article;

	const kw = targetKeyword.trim().toLowerCase();
	// Strip Markdown / HTML for accurate word and keyword matching
	const cleanContent = content
		.replace(/<[^>]*>?/gm, "")
		.replace(/([#*~_`]|\[|\]|\(|\))/g, " ");
	const words = cleanContent.split(/\s+/).filter((w) => w.length > 0);
	const wordCount = words.length;

	const checklist = [];
	let totalScore = 0;

	const weights = {
		titleKw: 15,
		titleLen: 10,
		metaKw: 10,
		metaLen: 10,
		first100Words: 15,
		density: 15,
		h2Kw: 10,
		links: 5,
		wordCount: 10,
	};

	// 1. Title Core Topic Match
	if (!kw) {
		checklist.push({
			metric: "Core Topic Identifier",
			passed: false,
			text: "No core topic entered. Add a main topic keyword to ignite scoring.",
		});
	} else {
		const titleHasKw = title.toLowerCase().includes(kw);
		checklist.push({
			metric: "Headline Core Topic",
			passed: titleHasKw,
			text: titleHasKw
				? `Core topic "${kw}" found in headline.`
				: `Headline should embed your core topic "${kw}".`,
		});
		if (titleHasKw) totalScore += weights.titleKw;
	}

	// 2. Title Length Optimal Range — measured on the EFFECTIVE title
	// (seoTitle when set): a long H1 with a good short SEO title is the
	// playbook's recommended pattern, not something to penalize twice.
	const effectiveTitleForLength = (seoTitle || title).trim();
	const titleLen = effectiveTitleForLength.length;
	const titleLenPassed = titleLen >= 40 && titleLen <= 65;
	checklist.push({
		metric: "Headline Unfurl Length",
		passed: titleLenPassed,
		text: titleLenPassed
			? `Title length optimal (${titleLen} chars${seoTitle ? " via SEO title" : ""}).`
			: `Effective title has ${titleLen} chars. Keep between 40-65 for perfect social link previews (use the SEO Title field if the H1 is long).`,
	});
	if (titleLenPassed) totalScore += weights.titleLen;

	// 3. Meta Description Keyword
	if (kw && metaDescription) {
		const metaHasKw = metaDescription.toLowerCase().includes(kw);
		checklist.push({
			metric: "Summary Core Topic Match",
			passed: metaHasKw,
			text: metaHasKw
				? `Core topic found in summary snippet.`
				: `Summary description missing core topic.`,
		});
		if (metaHasKw) totalScore += weights.metaKw;
	} else {
		checklist.push({
			metric: "Summary Core Topic Match",
			passed: false,
			text: "Write a summary description.",
		});
	}

	// 4. Meta Description Length
	const metaLen = metaDescription.length;
	const metaLenPassed = metaLen >= 120 && metaLen <= 165;
	checklist.push({
		metric: "Summary Unfurl Length",
		passed: metaLenPassed,
		text: metaLenPassed
			? `Summary length perfect (${metaLen} chars).`
			: `Summary has ${metaLen} chars. Optimal social preview snippet is 120-165.`,
	});
	if (metaLenPassed) totalScore += weights.metaLen;

	// 5. Keyword in Introductory 100 Words
	if (kw && words.length > 0) {
		const first100 = words.slice(0, 100).join(" ").toLowerCase();
		const inFirst100 = first100.includes(kw);
		checklist.push({
			metric: "Introductory Story Hook",
			passed: inFirst100,
			text: inFirst100
				? `Excellent: Core topic hooked inside the opening paragraph.`
				: `Embed your core topic within the first 100 words to establish clear storytelling intent.`,
		});
		if (inFirst100) totalScore += weights.first100Words;
	} else {
		checklist.push({
			metric: "Introductory Story Hook",
			passed: false,
			text: "Write introductory prose.",
		});
	}

	// 6. Keyword Saturation Density
	if (kw && wordCount > 0) {
		const regex = new RegExp(
			kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
			"giu",
		);
		const matches = cleanContent.match(regex);
		const kwCount = matches ? matches.length : 0;
		const density = (kwCount / wordCount) * 100;
		const densityPassed = density >= 0.8 && density <= 3.5;

		checklist.push({
			metric: "Topical Resonance Density",
			passed: densityPassed,
			text: densityPassed
				? `Healthy topical resonance (${density.toFixed(1)}%). Optimal is 0.8% - 3.5%.`
				: `Current density is ${density.toFixed(1)}%. Maintain between 0.8% and 3.5% for natural reading flow.`,
		});
		if (densityPassed) totalScore += weights.density;
	} else {
		checklist.push({
			metric: "Topical Resonance Density",
			passed: false,
			text: "Add markdown prose.",
		});
	}

	// 7. Semantic H2 Hierarchy Match
	if (kw && content) {
		const h2s = content.match(/^##\s+(.*)$/gm) || [];
		const h2HasKw = h2s.some((h) => h.toLowerCase().includes(kw));
		checklist.push({
			metric: "Section Heading Outline",
			passed: h2HasKw,
			text: h2HasKw
				? `Core topic found inside structured section headings (##).`
				: `Include your core topic inside at least one structured section sub-heading (##).`,
		});
		if (h2HasKw) totalScore += weights.h2Kw;
	} else {
		checklist.push({
			metric: "Section Heading Outline",
			passed: false,
			text: "Create ## section subheadings.",
		});
	}

	// 8. Internal / Outbound Reference Links
	if (content) {
		const hasLinks = /\[.+\]\(https?:\/\/.+\)/.test(content);
		checklist.push({
			metric: "Helpful Context References",
			passed: hasLinks,
			text: hasLinks
				? `External/outbound reference links detected.`
				: `Include at least one reference link [text](url) to give readers helpful context.`,
		});
		if (hasLinks) totalScore += weights.links;
	} else {
		checklist.push({
			metric: "Helpful Context References",
			passed: false,
			text: "Add outbound links.",
		});
	}

	// 9. Comprehensive Word Count
	checklist.push({
		metric: "Definitive Story Depth",
		passed: wordCount >= 300,
		text:
			wordCount >= 300
				? `Thorough definitive depth (${wordCount} words).`
				: `Story has ${wordCount} words. Definitive pieces engage readers best over 300 words.`,
	});
	if (wordCount >= 300) totalScore += weights.wordCount;

	// ------------------------------------------------------------------
	// Playbook §6/§14 pre-publish checks (2026 SEO playbook).
	// The SEO-title check is scored; the rest are advisory (weight 0) so
	// the historic score scale stays comparable — but they are the checks
	// that actually decide whether a post ranks and gets cited by AI.
	// ------------------------------------------------------------------
	const effectiveTitle = (seoTitle || title).trim();
	const seoTitlePassed = effectiveTitle.length > 0 && effectiveTitle.length <= 60;
	checklist.push({
		metric: "SEO Title Length (≤60)",
		passed: seoTitlePassed,
		text: seoTitlePassed
			? `Search-result title fits (${effectiveTitle.length} chars) — Google won't truncate it.`
			: `"${effectiveTitle.slice(0, 40)}…" is ${effectiveTitle.length} chars. Add a short SEO title (≤60 chars, keyword first); keep the long H1. 11 of 14 posts were truncated in Google.`,
	});
	if (seoTitlePassed) totalScore += 10;
	const maxScore = 110;

	const internalLinks = (content.match(/\]\((?:\/blog\/|https?:\/\/(?:www\.)?apex-nepal\.com\/blog\/)/g) || []).length;
	checklist.push({
		metric: "In-text Internal Links",
		passed: internalLinks >= 3,
		advisory: true,
		text:
			internalLinks >= 3
				? `${internalLinks} in-text links to other guides — good hub-and-spoke linking.`
				: `Only ${internalLinks} in-text link(s) to other /blog/ guides. Playbook target: 3–5 in the article text (descriptive anchors) + your hub page.`,
	});

	const externalLinks = [...content.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)]
		.map((m) => m[1])
		.filter((u) => !/apex-nepal\.com/i.test(u));
	const hasOfficial = externalLinks.some((u) =>
		/\.gov\.np|nrb\.org\.np|ird\.gov\.np|\.edu\b/i.test(u),
	);
	checklist.push({
		metric: "Official / Primary Sources",
		passed: externalLinks.length >= 3 && hasOfficial,
		advisory: true,
		text:
			externalLinks.length >= 3 && hasOfficial
				? `${externalLinks.length} external links incl. an official source. Add them to the Sources list too.`
				: `${externalLinks.length} external link(s)${hasOfficial ? "" : ", none obviously official"}. Money/tax posts need primary sources (NRB, IRD, official fee pages) — aim for 3+.`,
	});

	const hasTable = /\|.*\|\s*\n\s*\|[\s:|-]+\|/.test(content);
	checklist.push({
		metric: "Comparison Table",
		passed: hasTable,
		advisory: true,
		text: hasTable
			? "Markdown table found — tables get cited far more in AI Overviews."
			: "No table found. Comparisons/fees/limits should be a table with real NPR numbers.",
	});

	const hasShortAnswer = /short answer/i.test(content.slice(0, 1500));
	const hasFaq = /^#{2,3}\s.*(faq|frequently asked)/im.test(content);
	checklist.push({
		metric: "Short Answer + FAQ",
		passed: hasShortAnswer && hasFaq,
		advisory: true,
		text:
			hasShortAnswer && hasFaq
				? "Short-answer opening and FAQ section detected."
				: `Missing: ${[!hasShortAnswer && "'Short answer' box in the first 100 words", !hasFaq && "FAQ section (3–7 real questions)"].filter(Boolean).join(" + ")}.`,
	});

	const hasTestedBox = /how (i|we) tested/i.test(content);
	checklist.push({
		metric: "How I Tested This",
		passed: hasTestedBox,
		advisory: true,
		text: hasTestedBox
			? "Testing-method section found — this is your E-E-A-T proof."
			: "No 'How I tested this' section. Add dates, device, network (NTC/Ncell), amounts and what failed — or fill the tested_method field.",
	});

	return {
		totalScore: Math.round((totalScore / maxScore) * 100),
		wordCount,
		checklist,
	};
}

/**
 * Unicode-safe slug generator.
 *
 * Important fix for Nepali/Devanagari: vowel signs and halant are Unicode
 * combining marks (\p{M}), not letters. If we only keep \p{L} and \p{N},
 * words like "कतारबाट" collapse into broken text like "कतरबट".
 */
export function generateCleanSlug(title) {
	if (!title) return "post-" + Date.now();

	const normalizedTitle = String(title).trim().normalize("NFC");

	const slug = normalizedTitle
		// Preserve letters, numbers, combining marks, whitespace and hyphens.
		.replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
		// Collapse spaces / underscores into a single dash.
		.replace(/[\s_-]+/g, "-")
		// Strip leading/trailing dashes.
		.replace(/^-+|-+$/g, "")
		.toLowerCase();

	return slug || "post-" + Date.now();
}
