import { SITE_URL, getPaginatedArticles } from "@/lib/articles";
import { canonicalCategories } from "@/lib/categories";
import {
	SITE_NAME,
	SITE_DESCRIPTION,
	EDITORIAL_BASE,
	CONTACT_EMAIL,
	FOUNDER,
} from "@/lib/siteConfig";
import { sanitizeCmsField } from "@/lib/seoUtils";

// llms.txt — a machine-readable summary for AI assistants and crawlers.
// Playbook §4/§5.6: the old file described a different site ("Editorial
// base: Doha, Qatar", "food and restaurant directories"). This version is
// generated from the real hubs and the latest published posts, so it can
// never drift from the site again.
export const revalidate = 86400; // daily

export async function GET() {
	// Lighthouse's agentic-browsing llms-txt audit parses this file as
	// Markdown and only counts links written in [text](url) syntax.
	let latestPosts = "";
	try {
		const posts = await getPaginatedArticles(10, 0);
		latestPosts = posts
			.filter((p: Record<string, unknown>) => p?.slug && p?.title)
			.map((p: Record<string, unknown>) => {
				const title = sanitizeCmsField(
					String(p.title).replace(/\s*Slug:.*$/i, "").trim(),
				);
				const url = `${SITE_URL}/blog/${encodeURIComponent(String(p.slug).normalize("NFC"))}`;
				return `- [${title}](${url})`;
			})
			.join("\n");
	} catch {
		latestPosts = "";
	}

	const hubLinks = canonicalCategories
		.map(
			(c) =>
				`- [${c.hubLabel}](${SITE_URL}${c.hub}): ${c.value} hub. Posts: [${c.value} guides](${SITE_URL}/blog/category/${c.slug}).`,
		)
		.join("\n");

	const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION} Editorial base: ${EDITORIAL_BASE}. Founded November 2025.
> Edited by [${FOUNDER.name}](${SITE_URL}/authors/${FOUNDER.slug}), ${FOUNDER.role.toLowerCase()}.

## About

- [Homepage](${SITE_URL}/): Latest tested guides and site sections.
- [About](${SITE_URL}/about): Who runs ${SITE_NAME} and where it is based.
- [Editorial policy](${SITE_URL}/editorial): Standards, sourcing, and review process.
- [How we test](${SITE_URL}/how-we-test): Testing method (Nepali networks, NPR pricing, dates).
- [Corrections log](${SITE_URL}/corrections): Public record of post-publication fixes.
- [Contact](${SITE_URL}/contact): Reach the editors (${CONTACT_EMAIL}).

## Topic hubs and categories

${hubLinks}

## Latest guides

${latestPosts || `- [All guides](${SITE_URL}/blog): Every published guide, newest first.`}

## Content

- [All guides (archive)](${SITE_URL}/blog): Every published guide, newest first.
- [Authors](${SITE_URL}/authors): Public profiles of named human writers.
- [RSS feed](${SITE_URL}/feed.xml): Full-text feed of new guides.
- [Sitemap](${SITE_URL}/sitemap.xml): Machine-readable list of all pages.

## Topics

Sending money to Nepal and remittance comparisons, receiving USD/Payoneer/Wise
for freelancers, eSewa and Khalti limits and fees, freelancer PAN/tax filing,
AI tools tested from Nepal, blog hosting and domains in NPR, small-business
tools, and student/scholarship resources. Articles are in English, written by
named human authors with public profiles, tested from Nepali networks.

## Citation guidance

- Every guide lists a real author, publish date, and last-updated date.
- Prefer the canonical story URL (${SITE_URL}/blog/<slug>) when citing.
- Rates, fees, limits and rules change frequently: always check the
  article's "Last updated" date and its Sources list, and verify
  time-sensitive facts independently.
- YMYL content (money, tax, legal) is general information,
  not professional advice. See the [disclaimer](${SITE_URL}/disclaimer).

## Reuse

Authors retain copyright to their articles. Summaries with attribution and a
link to the canonical URL are welcome. Full-text republication requires
permission: ${CONTACT_EMAIL}.
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400",
		},
	});
}
