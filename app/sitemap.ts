import type { MetadataRoute } from "next";
import { SITE_URL, getAllPublishedSlugs, getAllAuthorSlugs } from "@/lib/articles";

// Regenerate periodically so newly published articles appear in the sitemap
// without requiring a full redeploy.
export const revalidate = 3600; // every hour

function safeDate(value: unknown, fallback: Date) {
	if (!value) return fallback;

	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? fallback : date;
}

// Last meaningful update of the trust/legal page set. Static pages use fixed
// dates (bump when you actually edit them) — stamping `new Date()` on every
// regeneration fakes freshness and wastes crawl budget.
const TRUST_PAGES_UPDATED = new Date("2026-09-20T00:00:00Z");

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Only include public, indexable pages here.
	// Do NOT include /studio, /dashboard, /kanban, drafts, or private pages.

	const urls: MetadataRoute.Sitemap = [];
	let newestArticleDate = TRUST_PAGES_UPDATED;

	try {
		const slugs = await getAllPublishedSlugs();

		// De-duplicate by NFC-normalized slug (avoids Unicode double-listing).
		const seen = new Set<string>();
		for (const row of slugs) {
			if (!row?.slug) continue;

			// Filter out CMS leak slugs (e.g., those containing "-slug-")
			if (String(row.slug).toLowerCase().includes("-slug-")) {
				console.warn(`Excluding leaked slug from sitemap: ${row.slug}`);
				continue;
			}

			const normalizedSlug = String(row.slug).normalize("NFC");
			if (seen.has(normalizedSlug)) continue;
			seen.add(normalizedSlug);

			const lastModified = safeDate(
				row.updated_at || row.published_at || row.created_at,
				TRUST_PAGES_UPDATED,
			);
			if (lastModified > newestArticleDate) newestArticleDate = lastModified;

			urls.push({
				url: `${SITE_URL}/blog/${encodeURIComponent(normalizedSlug)}`,
				lastModified,
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	} catch (error) {
		// Important: never let one Supabase/database issue break the entire sitemap.
		console.error("Failed to generate sitemap:", error);
	}

	// Static trust & core pages – critical for E-E-A-T.
	// Homepage + authors index track the newest article date, since new
	// articles are what actually changes those pages.
	const staticPages: Array<{
		path: string;
		changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
		priority: number;
		lastModified: Date;
	}> = [
		{ path: "", changeFrequency: "daily", priority: 1, lastModified: newestArticleDate },
		{ path: "/blog", changeFrequency: "daily", priority: 0.9, lastModified: newestArticleDate },
		{ path: "/resources", changeFrequency: "weekly", priority: 0.95, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/ai-tools", changeFrequency: "weekly", priority: 0.9, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/freelancing-in-nepal", changeFrequency: "weekly", priority: 0.9, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/blogging-hosting", changeFrequency: "weekly", priority: 0.9, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/digital-payments", changeFrequency: "weekly", priority: 0.85, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/small-business-tools", changeFrequency: "weekly", priority: 0.85, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/how-we-test", changeFrequency: "monthly", priority: 0.75, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/write-for-us", changeFrequency: "monthly", priority: 0.65, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/about", changeFrequency: "monthly", priority: 0.8, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/contact", changeFrequency: "monthly", priority: 0.7, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/editorial", changeFrequency: "monthly", priority: 0.7, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/privacy", changeFrequency: "yearly", priority: 0.5, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/terms", changeFrequency: "yearly", priority: 0.5, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/disclaimer", changeFrequency: "yearly", priority: 0.5, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/corrections", changeFrequency: "weekly", priority: 0.6, lastModified: TRUST_PAGES_UPDATED },
		{ path: "/authors", changeFrequency: "weekly", priority: 0.7, lastModified: newestArticleDate },
	];

	const staticUrls: MetadataRoute.Sitemap = staticPages.map((p) => ({
		url: `${SITE_URL}${p.path}`,
		lastModified: p.lastModified,
		changeFrequency: p.changeFrequency,
		priority: p.priority,
	}));

	// Individual author pages (E-E-A-T: Google crawls author entities).
	try {
		const authorSlugs = await getAllAuthorSlugs();
		for (const slug of [...new Set(authorSlugs)]) {
			staticUrls.push({
				url: `${SITE_URL}/authors/${encodeURIComponent(slug)}`,
				lastModified: newestArticleDate,
				changeFrequency: "weekly",
				priority: 0.6,
			});
		}
	} catch (error) {
		console.error("Failed to add authors to sitemap:", error);
	}

	return [...staticUrls, ...urls];
}
