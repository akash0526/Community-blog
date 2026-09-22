import { SITE_URL, getPaginatedArticles } from "@/lib/articles";

// RSS 2.0 feed for readers, newsletters, and aggregators.
export const revalidate = 3600; // hourly

function escapeXml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const articles = await getPaginatedArticles(50, 0);

	const items = articles
		.map((art: Record<string, unknown>) => {
			const slug = encodeURIComponent(String(art.slug || "").normalize("NFC"));
			const link = `${SITE_URL}/blog/${slug}`;
			const pubDate = new Date(
				String(art.published_at || art.created_at || Date.now()),
			).toUTCString();
			const profiles = (art.profiles || {}) as Record<string, unknown>;
			return [
				"    <item>",
				`      <title>${escapeXml(art.title)}</title>`,
				`      <link>${escapeXml(link)}</link>`,
				`      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
				`      <pubDate>${pubDate}</pubDate>`,
				`      <description>${escapeXml(art.meta_description)}</description>`,
				art.category
					? `      <category>${escapeXml(art.category)}</category>`
					: "",
				profiles.full_name
					? `      <author>editor@apex-nepal.com (${escapeXml(profiles.full_name)})</author>`
					: "",
				"    </item>",
			]
				.filter(Boolean)
				.join("\n");
		})
		.join("\n");

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		"  <channel>",
		"    <title>Apex — Open stories from around the world</title>",
		`    <link>${escapeXml(SITE_URL)}/</link>`,
		"    <description>Tested, cited stories by independent writers: expat guides, remittance comparisons, tech, food, travel, and culture.</description>",
		"    <language>en</language>",
		`    <atom:link href="${escapeXml(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml" />`,
		items,
		"  </channel>",
		"</rss>",
		"",
	].join("\n");

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
