import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getArticleBySlug, getRelatedArticles, SITE_URL } from "@/lib/articles";
import {
	sanitizeCmsField,
	detectLanguage,
	cleanExcerpt,
	cleanBio,
	articleMetadataTitle,
	authorSlugFor,
	parseSources,
} from "@/lib/seoUtils";
import { categoryPagePath, hubForCategory, resolveCategory } from "@/lib/categories";
import { SITE_NAME, LOGO_PATH, SOCIAL_PROFILES, TWITTER_HANDLE } from "@/lib/siteConfig";
import ArticleContent from "./ArticleContent";

export const revalidate = 60;

export async function generateStaticParams() {
	try {
		const { data } = await supabase
			.from("articles")
			.select("slug")
			.eq("status", "published");

		return (data || [])
			.filter((row) => row?.slug)
			.map((row) => ({ slug: row.slug }));
	} catch {
		return [];
	}
}

function cleanTitleField(raw) {
	if (!raw) return "";
	return sanitizeCmsField(String(raw).replace(/\s*Slug:.*$/i, "").trim());
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);

	// Playbook §5.1 soft-404 fix, both halves are required (verified on
	// Next 16): (1) notFound() here — generateMetadata runs before the
	// page body; (2) this segment must NOT have a loading.jsx — a Suspense
	// shell flushes HTTP 200 before the lookup finishes, and notFound()
	// alone still soft-404s. Do not re-add loading.jsx to this folder.
	if (!article) notFound();

	const cleanTitle = cleanTitleField(article.title);
	// <title>: short seo_title when set (≤60 chars), long H1 stays in the page.
	const metaTitle = articleMetadataTitle(article);
	const ogTitle = typeof metaTitle === "string" ? metaTitle : metaTitle.absolute;
	const cleanDescription =
		cleanExcerpt(article.meta_description)?.slice(0, 155) || cleanTitle;
	const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug).normalize("NFC"))}`;
	const authorName = article.profiles?.full_name || "Apex Editorial";
	const authorUrl = `${SITE_URL}/authors/${authorSlugFor(article.profiles)}`;

	return {
		title: metaTitle,
		description: cleanDescription,
		authors: [{ name: authorName, url: authorUrl }],
		alternates: { canonical: canonicalUrl },
		openGraph: {
			title: ogTitle,
			description: cleanDescription,
			url: canonicalUrl,
			siteName: SITE_NAME,
			images: article.image_url
				? [{ url: article.image_url, width: 1200, height: 630, alt: cleanTitle }]
				: [],
			type: "article",
			publishedTime: article.published_at || article.created_at,
			modifiedTime: article.updated_at || article.published_at || article.created_at,
			authors: [authorName],
			section: article.category,
			tags: [article.target_keyword, article.category].filter(Boolean),
		},
		twitter: {
			card: "summary_large_image",
			title: ogTitle,
			description: cleanDescription,
			images: article.image_url ? [article.image_url] : [],
			...(TWITTER_HANDLE ? { creator: TWITTER_HANDLE } : {}),
		},
		robots: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	};
}

export default async function ArticlePage({ params }) {
	const { slug } = await params;
	const article = await getArticleBySlug(slug);

	if (!article) {
		notFound();
	}

	// Pageview bump – best effort, never blocks the response.
	// NOTE: the SEO-playbook migration fixes trg_articles_updated_at so this
	// counter UPDATE no longer fakes a fresh `updated_at`/dateModified.
	if (!String(article.id || "").startsWith("seed-") && !String(article.id || "").startsWith("post-")) {
		supabase.rpc("increment_pageview", { article_id: article.id }).then(
			() => {},
			() => {},
		);
	}

	const related = await getRelatedArticles(article, 4);

	const cleanTitle = cleanTitleField(article.title);
	const cleanDescription = sanitizeCmsField(article.meta_description);
	const lang = detectLanguage(article.content || article.title);
	const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug).normalize("NFC"))}`;
	const authorName = article.profiles?.full_name || "Apex Editorial";
	const authorUrl = `${SITE_URL}/authors/${authorSlugFor(article.profiles)}`;
	const authorAvatar =
		article.profiles?.avatar_url && !article.profiles.avatar_url.includes("dicebear")
			? article.profiles.avatar_url
			: `${SITE_URL}${LOGO_PATH}`;
	// Per-author social links — never attribute the founder's GitHub to guests.
	const authorSameAs = [
		article.profiles?.website,
		article.profiles?.twitter,
		article.profiles?.linkedin,
	].filter(Boolean);
	const knowsAbout = Array.isArray(article.profiles?.expertise)
		? article.profiles.expertise
		: undefined;
	const sources = parseSources(article.sources);
	const hint = `${article.title || ""} ${article.target_keyword || ""}`;
	const resolvedCategory = resolveCategory(article.category, hint);
	const categoryName = resolvedCategory?.value || article.category || "Guides";
	const categoryUrl = `${SITE_URL}${categoryPagePath(article.category, hint)}`;
	const hub = hubForCategory(article.category, hint);

	// Playbook §5.5: BlogPosting on EVERY post (the old code emitted
	// NewsArticle for three legacy categories, incl. one guide).
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: cleanTitle,
		alternativeHeadline: cleanDescription,
		description: cleanDescription,
		image: article.image_url ? [article.image_url] : undefined,
		datePublished: article.published_at || article.created_at,
		dateModified: article.updated_at || article.published_at || article.created_at,
		inLanguage: lang,
		isAccessibleForFree: true,
		author: {
			"@type": "Person",
			name: authorName,
			url: authorUrl,
			image: authorAvatar,
			jobTitle: article.profiles?.professional_role || "Contributing Writer",
			description: cleanBio(article.profiles?.bio) || undefined,
			sameAs: authorSameAs.length ? authorSameAs : undefined,
			knowsAbout,
		},
		editor: {
			"@type": "Person",
			name: "Akash Adhikari",
			url: `${SITE_URL}/authors/akash-adhikari`,
		},
		// Expert review for YMYL posts (playbook §8) — set reviewer_name /
		// reviewer_url in Supabase once a CA/consultant has reviewed the post.
		...(article.reviewer_name
			? {
					reviewedBy: {
						"@type": "Person",
						name: article.reviewer_name,
						...(article.reviewer_url ? { url: article.reviewer_url } : {}),
					},
				}
			: {}),
		...(sources.length
			? { citation: sources.map((s) => s.url) }
			: {}),
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}${LOGO_PATH}`,
				width: 512,
				height: 512,
			},
			sameAs: SOCIAL_PROFILES.length ? SOCIAL_PROFILES : undefined,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": canonicalUrl,
		},
		articleSection: categoryName,
		keywords: [article.target_keyword, article.category].filter(Boolean).join(", "),
		about: article.target_keyword || article.category,
		copyrightYear: (article.published_at || article.created_at)
			? new Date(article.published_at || article.created_at).getFullYear()
			: undefined,
		copyrightHolder: {
			"@type": "Organization",
			name: SITE_NAME,
		},
	};

	// Playbook §5.4: breadcrumbs point at the real category page
	// (/blog/category/<slug>), never at /?category=… (which canonicalizes
	// to the homepage).
	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
			{ "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/blog` },
			{ "@type": "ListItem", position: 3, name: categoryName, item: categoryUrl },
			{ "@type": "ListItem", position: 4, name: cleanTitle, item: canonicalUrl },
		],
	};

	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: authorName,
		url: authorUrl,
		image: authorAvatar,
		jobTitle: article.profiles?.professional_role || undefined,
		worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
		description: cleanBio(article.profiles?.bio) || undefined,
		sameAs: authorSameAs.length ? authorSameAs : undefined,
		knowsAbout,
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
			<ArticleContent
				serverArticle={article}
				slug={slug}
				related={related}
				hub={{ href: hub.href, label: hub.label }}
				categoryPage={categoryPagePath(article.category, hint)}
				categoryName={categoryName}
			/>
		</>
	);
}
