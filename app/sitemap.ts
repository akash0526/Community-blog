import type { MetadataRoute } from "next";
import { SITE_URL, getAllPublishedSlugs } from "@/lib/articles";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static, always-present pages.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/studio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  // One entry per published article (this is what makes Google *discover* your posts).
  const articlePages: MetadataRoute.Sitemap = [];
  const slugs = await getAllPublishedSlugs();
  for (const row of slugs) {
    articlePages.push({
      url: `${SITE_URL}/blog/${encodeURIComponent(row.slug)}`,
      lastModified: new Date(row.updated_at || row.created_at || now),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return [...staticPages, ...articlePages];
}
