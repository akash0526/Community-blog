import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/articles";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				// Keep authoring/admin/app-only routes out of Google.
				disallow: ["/studio", "/dashboard", "/kanban"],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
