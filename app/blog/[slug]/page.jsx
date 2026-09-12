import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getArticleBySlug, SITE_URL } from "@/lib/articles";
import { sanitizeCmsField, detectLanguage } from "@/lib/seoUtils";
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

function cleanTitleField(raw){
  if(!raw) return "";
  return sanitizeCmsField(String(raw).replace(/\s*Slug:.*$/i,'').trim());
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found | Apex",
      description: "The requested article could not be found on Apex.",
      robots: { index: false, follow: false },
    };
  }

  const cleanTitle = cleanTitleField(article.title);
  const cleanDescription = sanitizeCmsField(article.meta_description)?.slice(0,155) || cleanTitle;
  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug).normalize("NFC"))}`;
  const authorName = article.profiles?.full_name || "Apex Editorial";
  const isDraft = article.status === "draft";

  return {
    title: cleanTitle,
    description: cleanDescription,
    keywords: [
      article.target_keyword,
      article.category,
      "Apex",
    ].filter(Boolean),
    authors: [{ name: authorName, url: `${SITE_URL}/authors/${authorName.toLowerCase().replace(/\s+/g,'-')}` }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: "Apex",
      images: article.image_url ? [{ url: article.image_url, width: 1200, height: 630, alt: cleanTitle }] : [],
      type: "article",
      publishedTime: article.published_at || article.created_at,
      modifiedTime: article.updated_at || article.published_at || article.created_at,
      authors: [authorName],
      section: article.category,
      tags: [article.target_keyword, article.category].filter(Boolean),
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: article.image_url ? [article.image_url] : [],
      creator: "@apex_nepal",
    },
    robots: isDraft ? { index: false, follow: false } : {
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

  // Pageview bump – best effort
  if (!String(article.id||"").startsWith("seed-") && !String(article.id||"").startsWith("post-")) {
    try {
      await supabase.rpc("increment_pageview", { article_id: article.id });
    } catch {}
  }

  const cleanTitle = cleanTitleField(article.title);
  const cleanDescription = sanitizeCmsField(article.meta_description);
  const lang = detectLanguage(article.content || article.title);
  const canonicalUrl = `${SITE_URL}/blog/${encodeURIComponent(decodeURIComponent(slug).normalize("NFC"))}`;
  const authorName = article.profiles?.full_name || "Apex Editorial";
  const authorSlug = authorName.toLowerCase().replace(/\s+/g,'-');
  const authorUrl = `${SITE_URL}/authors/${authorSlug}`;
  const authorAvatar = article.profiles?.avatar_url && !article.profiles.avatar_url.includes('dicebear')
    ? article.profiles.avatar_url
    : `${SITE_URL}/icon.svg`;

  const isNews = false; // old news categories deleted — 5 pillars are BlogPosting

  const copyrightYear = new Date(article.published_at || article.created_at || "2026-01-01").getFullYear();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "BlogPosting",
    "headline": cleanTitle,
    "alternativeHeadline": cleanDescription,
    "description": cleanDescription,
    "image": article.image_url ? [article.image_url] : undefined,
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.published_at || article.created_at,
    "inLanguage": lang,
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl,
      "image": authorAvatar,
      "jobTitle": article.profiles?.professional_role || "Contributing Writer",
      "description": article.profiles?.bio || undefined,
      "sameAs": [
        "https://github.com/akash0526"
      ].filter(Boolean)
    },
    "editor": {
      "@type": "Person",
      "name": "Akash Adhikari",
      "url": `${SITE_URL}/authors/akash-adhikari`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Apex",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/icon.svg`,
        "width": 600,
        "height": 60
      },
      "sameAs": ["https://github.com/akash0526"]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": article.category,
    "keywords": [article.target_keyword, article.category].filter(Boolean).join(", "),
    "about": article.target_keyword || article.category,
    "copyrightYear": copyrightYear,
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Apex"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": article.category || "Stories", "item": `${SITE_URL}/?category=${encodeURIComponent(article.category||"")}` },
      { "@type": "ListItem", "position": 3, "name": cleanTitle, "item": canonicalUrl }
    ]
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": authorName,
    "url": authorUrl,
    "image": authorAvatar,
    "jobTitle": article.profiles?.professional_role || undefined,
    "worksFor": { "@type": "Organization", "name": "Apex", "url": SITE_URL },
    "description": article.profiles?.bio || undefined
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <ArticleContent serverArticle={article} slug={slug} />
    </>
  );
}
