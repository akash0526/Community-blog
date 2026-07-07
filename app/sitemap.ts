import type { MetadataRoute } from "next";
import { SITE_URL, getAllPublishedSlugs } from "@/lib/articles";

// Regenerate periodically so newly published articles appear in the sitemap
// without requiring a full redeploy.
export const revalidate = 3600; // every hour

function safeDate(value: unknown, fallback = new Date()) {
	if (!value) return fallback;

	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? fallback : date;
}

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	// Only include public, indexable pages here.
	// Do NOT include /studio, /dashboard, /kanban, drafts, or private pages.
	// Static trust & core pages – critical for E-E-A-T
	const staticPages = [
		{ path: "", changeFrequency: "daily" as const, priority: 1 },
		{ path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
		{ path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
		{ path: "/editorial", changeFrequency: "monthly" as const, priority: 0.7 },
		{ path: "/privacy", changeFrequency: "yearly" as const, priority: 0.5 },
		{ path: "/terms", changeFrequency: "yearly" as const, priority: 0.5 },
		{ path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.5 },
		{ path: "/corrections", changeFrequency: "weekly" as const, priority: 0.6 },
		{ path: "/authors", changeFrequency: "weekly" as const, priority: 0.7 },
	];

	const urls: MetadataRoute.Sitemap = staticPages.map(p => ({
		url: `${SITE_URL}${p.path}`,
		lastModified: now,
		changeFrequency: p.changeFrequency,
		priority: p.priority,
	}));

	try {
		const slugs = await getAllPublishedSlugs();

		for (const row of slugs) {
			if (!row?.slug) continue;

			// Filter out CMS leak slugs (e.g., those containing "-slug-")
			if (String(row.slug).toLowerCase().includes("-slug-")) {
				console.warn(`Excluding leaked slug from sitemap: ${row.slug}`);
				continue;
			}

			const normalizedSlug = String(row.slug).normalize("NFC");

			urls.push({
				url: `${SITE_URL}/blog/${encodeURIComponent(normalizedSlug)}`,
				lastModified: safeDate(
					row.updated_at || row.published_at || row.created_at,
					now,
				),
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	} catch (error) {
		// Important: never let one Supabase/database issue break the entire sitemap.
		console.error("Failed to generate sitemap:", error);
	}

	return urls;
}
