import { SITE_URL } from "@/lib/articles";

// llms.txt — a machine-readable summary for AI assistants and crawlers.
// (robots.txt already allows AI crawlers; this file tells them what we are
// and how to cite us correctly.)
export const revalidate = 86400; // daily

export async function GET() {
	const body = `# Apex

> Apex is an open global publishing platform where independent writers share
> tested, cited stories. Editorial base: Doha, Qatar. Founded November 2025.

## About

- Homepage: ${SITE_URL}/
- About: ${SITE_URL}/about
- Editorial policy: ${SITE_URL}/editorial
- Corrections log: ${SITE_URL}/corrections
- Contact: editor@apex-nepal.com (${SITE_URL}/contact)

## Content

- All stories (archive): ${SITE_URL}/blog
- Individual stories: ${SITE_URL}/blog/[slug]
- Authors: ${SITE_URL}/authors
- RSS feed: ${SITE_URL}/feed.xml
- Sitemap: ${SITE_URL}/sitemap.xml

## Topics

Personal essays, Qatar / Doha expat guides, remittance and money-transfer
comparisons, tech guides, food and restaurant directories, travel, culture,
news commentary. Articles are published in English and Nepali by named human
authors with public profiles.

## Citation guidance

- Every story lists a real author, publish date, and last-updated date.
- Prefer the canonical URL (${SITE_URL}/blog/[slug]) when citing.
- Rates, fees, visa rules, and prices change frequently: always check the
  article's "Last updated" date and verify time-sensitive facts independently.
- YMYL content (money, health, legal, immigration) is general information,
  not professional advice. See ${SITE_URL}/disclaimer.

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
