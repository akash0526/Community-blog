import { SITE_URL } from "@/lib/articles";

// llms.txt — a machine-readable summary for AI assistants and crawlers.
// (robots.txt already allows AI crawlers; this file tells them what we are
// and how to cite us correctly.)
export const revalidate = 86400; // daily

export async function GET() {
	// Lighthouse's agentic-browsing llms-txt audit parses this file as
	// Markdown and only counts links written in [text](url) syntax — bare
	// URLs are ignored ("File does not appear to contain any links").
	const body = `# Apex

> Apex is an open global publishing platform where independent writers share
> tested, cited stories. Editorial base: Doha, Qatar. Founded November 2025.

## About

- [Homepage](${SITE_URL}/): Latest stories and site sections.
- [About](${SITE_URL}/about): Who we are and how the platform works.
- [Editorial policy](${SITE_URL}/editorial): Standards, sourcing, and review process.
- [Corrections log](${SITE_URL}/corrections): Public record of post-publication fixes.
- [Contact](${SITE_URL}/contact): Reach the editors (editor@apex-nepal.com).

## Content

- [All stories (archive)](${SITE_URL}/blog): Every published story, newest first.
- [Individual stories](${SITE_URL}/blog/[slug]): One canonical page per story.
- [Authors](${SITE_URL}/authors): Public profiles of named human writers.
- [RSS feed](${SITE_URL}/feed.xml): Full-text feed of new stories.
- [Sitemap](${SITE_URL}/sitemap.xml): Machine-readable list of all pages.

## Topics

Personal essays, Qatar / Doha expat guides, remittance and money-transfer
comparisons, tech guides, food and restaurant directories, travel, culture,
news commentary. Articles are published in English and Nepali by named human
authors with public profiles.

## Citation guidance

- Every story lists a real author, publish date, and last-updated date.
- Prefer the canonical [story URL](${SITE_URL}/blog/[slug]) when citing.
- Rates, fees, visa rules, and prices change frequently: always check the
  article's "Last updated" date and verify time-sensitive facts independently.
- YMYL content (money, health, legal, immigration) is general information,
  not professional advice. See the [disclaimer](${SITE_URL}/disclaimer).

## Reuse

Authors retain copyright to their articles. Summaries with attribution and a
link to the canonical URL are welcome. Full-text republication requires
permission: editor@apex-nepal.com.
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
