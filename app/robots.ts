import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/articles";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/studio",
					"/dashboard",
					"/kanban",
					"/api/",
					"/*?*utm_*",
					"/*?*fbclid*",
					"/*?*affiliate*",
					"/*?*ref*",
				],
			},
			// Explicitly allow major AI / LLM crawlers – we want to be cited
			{ userAgent: "GPTBot", allow: "/" },
			{ userAgent: "ChatGPT-User", allow: "/" },
			{ userAgent: "ClaudeBot", allow: "/" },
			{ userAgent: "Claude-Web", allow: "/" },
			{ userAgent: "PerplexityBot", allow: "/" },
			{ userAgent: "Google-Extended", allow: "/" },
			{ userAgent: "CCBot", allow: "/" },
			{ userAgent: "anthropic-ai", allow: "/" },
			{ userAgent: "Omgilibot", allow: "/" },
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
