import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getArticleBySlug, SITE_URL } from "@/lib/articles";
import { sanitizeCmsField, detectLanguage } from "@/lib/seoUtils";
import ArticleContent from "./ArticleContent";

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

// Pre-render known published articles at build time
export async function generateStaticParams() {
	try {
		const { data } = await supabase
			.from("articles")
			.select("slug")
			.eq("status", "published");

		return (data || [])
			.filter((row) => row?.slug)
			.map((row) => ({ slug: row.slug }));
	} catch (err) {
		return [];
	}
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);

	// IF ARTICLE NOT FOUND: Return minimal metadata and NO canonical.
	// Providing a canonical to a fake URL is a major SEO error.
	if (!article) {
		return {
			title: "Story Not Found | Apex Community",
			description: "The requested article could not be found.",
			robots: { index: false, follow: false },
			// We explicitly omit 'alternates: { canonical: ... }' here
		};
	}

	const cleanTitle = sanitizeCmsField(article.title);
	const cleanDescription = sanitizeCmsField(article.meta_description);
	const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug).normalize("NFC"))}`;
	const authorName = article.profiles?.full_name || "Apex Community";

	return {
		title: cleanTitle,
		description: cleanDescription,
		keywords: [
			article.target_keyword,
			"Human Storytelling",
			article.category,
			"Apex Community",
		],
		authors: [{ name: authorName }],
		alternates: {
			canonical: canonicalUrl,
		},
		openGraph: {
			title: cleanTitle,
			description: cleanDescription,
			url: canonicalUrl,
			siteName: "Apex Community Platform",
			images: [
				{
					url: article.image_url,
					width: 1200,
					height: 630,
					alt: cleanTitle,
				},
			],
			type: "article",
			publishedTime: article.created_at,
			authors: [authorName],
		},
		twitter: {
			card: "summary_large_image",
			title: cleanTitle,
			description: cleanDescription,
			images: [article.image_url],
		},
	};
}

export default async function StandardArticleProseView({ params }) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);

	// CRITICAL FIX: This MUST be the first thing that happens.
	// If no article is found, Next.js will immediately return a 404 status code.
	if (!article) {
		notFound();
	}

	// Bump pageviews asynchronously (fire-and-forget). Only for real DB rows.
	if (!article.id?.startsWith("seed-") && !article.id?.startsWith("post-")) {
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
		} catch (err) {
			// ignore — pageview tracking is best-effort
		}
	}

	// Article structured data (JSON-LD)
	const cleanTitle = sanitizeCmsField(article.title);
	const cleanDescription = sanitizeCmsField(article.meta_description);
	const lang = detectLanguage(article.content || article.title);

	const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(
		decodeURIComponent(slug).normalize("NFC"),
	)}`;
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: cleanTitle,
		description: cleanDescription,
		image: article.image_url ? [article.image_url] : undefined,
		datePublished: article.created_at || article.published_at,
		dateModified:
			article.updated_at || article.created_at || article.published_at,
		author: {
			"@type": "Person",
			name: article.profiles?.full_name || "Apex Community",
			url: SITE_URL,
		},
		publisher: {
			"@type": "Organization",
			name: "Apex Community Platform",
			logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": canonicalUrl,
		},
		keywords: [article.target_keyword, article.category]
			.filter(Boolean)
			.join(", "),
		articleSection: article.category,
		inLanguage: lang,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<ArticleContent serverArticle={article} slug={slug} />
		</>
	);
}
