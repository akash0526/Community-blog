import { supabase } from "@/lib/supabase";
import { fallbackArticles } from "@/lib/seedData";
import ArticleContent from "./ArticleContent";

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

async function getArticle(slug) {
	// Master failsafe: Automatically translate percent-encoded incoming URLs back to Devanagari script
	const decodedSlug = decodeURIComponent(slug);
	try {
		const { data, error } = await supabase
			.from("articles")
			.select("*, profiles(full_name, professional_role, avatar_url)")
			.eq("slug", decodedSlug)
			.single();

		if (!error && data) {
			return data;
		}
	} catch (err) {}

	// Fallback check
	const seedMatch = fallbackArticles.find(
		(a) => decodeURIComponent(a.slug) === decodedSlug,
	);
	if (seedMatch) return seedMatch;

	return null;
}

export async function generateStaticParams() {
	const slugs = [];
	for (const article of fallbackArticles) {
		slugs.push({ slug: article.slug });
	}
	try {
		const { data } = await supabase
			.from("articles")
			.select("slug")
			.eq("status", "published");

		if (data && data.length > 0) {
			for (const row of data) {
				if (!slugs.find((s) => s.slug === row.slug)) {
					slugs.push({ slug: row.slug });
				}
			}
		}
	} catch (err) {}
	return slugs;
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const article = await getArticle(slug);

	if (!article) {
		return {
			title: "Story Not Found | Apex Community Platform",
			description: "The requested article could not be found.",
		};
	}

	return {
		title: `${article.title} | Apex Community Platform`,
		description: article.meta_description,
		keywords: [
			article.target_keyword,
			"Human Storytelling",
			article.category,
			"Apex Community",
		],
		openGraph: {
			title: article.title,
			description: article.meta_description,
			url: `https://community-blog-six.vercel.app/blog/${article.slug}`,
			siteName: "Apex Community Platform",
			images: [{ url: article.image_url, width: 1200, height: 630 }],
			type: "article",
			authors: [article.profiles?.full_name || "Community Storyteller"],
			publishedTime: article.created_at,
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: article.meta_description,
			images: [article.image_url],
		},
	};
}

export default async function StandardArticleProseView({ params }) {
	const { slug } = await params;
	const article = await getArticle(slug);

	// Bump pageviews asynchronously (fire-and-forget)
	if (
		article &&
		!article.id.startsWith("seed-") &&
		!article.id.startsWith("post-")
	) {
		try {
			const { error: rpcErr } = await supabase.rpc("increment_pageview", {
				article_id: article.id,
			});
			if (rpcErr) {
				await supabase
					.from("articles")
					.update({ pageviews: (article.pageviews || 1) + 1 })
					.eq("id", article.id);
			}
		} catch (err) {}
	}

	return <ArticleContent serverArticle={article} slug={slug} />;
}
