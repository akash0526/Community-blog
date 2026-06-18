import { supabase } from "@/lib/supabase";
import { getArticleBySlug } from "@/lib/articles";
import { SITE_URL } from "@/lib/articles";
import { fallbackArticles } from "@/lib/seedData";
import ArticleContent from "./ArticleContent";

export const revalidate = 60; // Incremental Static Regeneration (ISR) every 60s

// Pre-render known articles at build time (static + ISR combo = fast + SEO-friendly)
export async function generateStaticParams() {
  const slugs = new Set();

  // Seed articles
  for (const article of fallbackArticles) {
    slugs.add(article.slug);
  }

  // Live articles from Supabase
  try {
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("status", "published");

    if (data) for (const row of data) if (row.slug) slugs.add(row.slug);
  } catch (err) {
    // ignore — seed slugs already added
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug))}`;

  if (!article) {
    return {
      title: "Story Not Found",
      description: "The requested article could not be found.",
      alternates: { canonical: canonicalUrl },
      robots: { index: false, follow: false },
    };
  }

  const authorName = article.profiles?.full_name || "Apex Community";

  return {
    title: article.title,
    description: article.meta_description,
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
      title: article.title,
      description: article.meta_description,
      url: canonicalUrl,
      siteName: "Apex Community Platform",
      images: [{ url: article.image_url, width: 1200, height: 630, alt: article.title }],
      type: "article",
      publishedTime: article.created_at,
      authors: [authorName],
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
  const article = await getArticleBySlug(slug);

  // Bump pageviews asynchronously (fire-and-forget). Only for real DB rows.
  if (
    article &&
    !article.id?.startsWith("seed-") &&
    !article.id?.startsWith("post-")
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
    } catch (err) {
      // ignore — pageview tracking is best-effort
    }
  }

  // Article structured data (JSON-LD) — drives rich results in Google.
  let articleJsonLd = null;
  if (article) {
    const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(
      decodeURIComponent(slug),
    )}`;
    articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.meta_description,
      image: article.image_url ? [article.image_url] : undefined,
      datePublished: article.created_at || article.published_at,
      dateModified: article.updated_at || article.created_at || article.published_at,
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
      keywords: [article.target_keyword, article.category].filter(Boolean).join(", "),
      articleSection: article.category,
      inLanguage: "en",
    };
  }

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ArticleContent serverArticle={article} slug={slug} />
    </>
  );
}
