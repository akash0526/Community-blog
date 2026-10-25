import { notFound } from "next/navigation";
import Link from "next/link";
import {
	getArticlesForCategory,
	getPublishedArticleCount,
	SITE_URL,
} from "@/lib/articles";
import { fallbackArticles } from "@/lib/seedData";
import { canonicalCategories, categoryFromSlug, normalizeCategory } from "@/lib/categories";
import { cleanExcerpt, sanitizeCmsField } from "@/lib/seoUtils";
import { BlogCard } from "@/components/BlogCard";

// Real category pages (playbook §5.4): breadcrumbs and internal links point
// here instead of /?category=… URLs that canonicalized to the homepage.
// Each page carries a real intro, its posts, and a link up to the hub.

export const revalidate = 60;

export function generateStaticParams() {
	return canonicalCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const category = categoryFromSlug(slug);
	if (!category) notFound();

	return {
		title: `${category.value} guides for Nepal`,
		description: category.intro.slice(0, 155),
		alternates: { canonical: `/blog/category/${category.slug}` },
		openGraph: {
			title: `${category.value} guides | Apex Nepal`,
			description: category.intro.slice(0, 155),
			url: `${SITE_URL}/blog/category/${category.slug}`,
			type: "website",
		},
	};
}

function cleanTitle(title) {
	return sanitizeCmsField(String(title || "").replace(/\s*Slug:.*$/i, "").trim());
}

function formatDate(value) {
	if (!value) return "Recently";
	return new Date(String(value)).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export default async function CategoryPage({ params }) {
	const { slug } = await params;
	const category = categoryFromSlug(slug);
	if (!category) notFound();

	const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
	let articles;
	let total = 0;
	if (hasSupabase) {
		[articles, total] = await Promise.all([
			getArticlesForCategory(category.value, 48),
			getPublishedArticleCount({ category: category.value }),
		]);
	} else {
		articles = (fallbackArticles || []).filter(
			(a) =>
				normalizeCategory(a.category, a.title) === category.value,
		);
		total = articles.length;
	}

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
			{ "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/blog` },
			{
				"@type": "ListItem",
				position: 3,
				name: category.value,
				item: `${SITE_URL}/blog/category/${category.slug}`,
			},
		],
	};

	return (
		<div className="flex-1">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<section className="hero" style={{ paddingBottom: "var(--section)" }}>
				<div className="wrap">
					<nav className="text-xs text-slate-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
						<Link href="/">Home</Link>
						<span>/</span>
						<Link href="/blog">Guides</Link>
						<span>/</span>
						<span className="text-slate-400">{category.value}</span>
					</nav>
					<h1>{category.value}</h1>
					<p className="lede" style={{ marginTop: "1.25rem", maxWidth: "62ch" }}>
						{category.intro}
					</p>
					<div className="hero__cta">
						<Link href={category.hub} className="btn btn--primary">
							Open the {category.hubLabel}
						</Link>
						<Link href="/how-we-test" className="btn btn--ghost">
							How we test
						</Link>
					</div>
					<p className="text-sm text-slate-500 mt-4">
						{total} published {total === 1 ? "guide" : "guides"} in this topic.
					</p>
				</div>
			</section>

			<section className="section" style={{ paddingTop: 0 }}>
				<div className="wrap">
					{articles.length > 0 ? (
						<div className="cards">
							{articles.map((art) => (
								<BlogCard
									key={art.id || art.slug}
									title={cleanTitle(art.title)}
									excerpt={cleanExcerpt(art.meta_description)}
									image={art.image_url || "/opengraph-image"}
									author={{
										name: art.profiles?.full_name || "Apex Nepal Editorial",
										avatar:
											art.profiles?.avatar_url ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(art.profiles?.full_name || "Apex Nepal")}&background=A8471F&color=fff&size=64`,
									}}
									date={formatDate(art.published_at || art.created_at)}
									slug={art.slug}
									category={normalizeCategory(art.category, art.title) || category.value}
								/>
							))}
						</div>
					) : (
						<p className="lede">
							No guides here yet — the next one is being tested. Start with the{" "}
							<Link href={category.hub} className="link">
								{category.hubLabel}
							</Link>{" "}
							or browse{" "}
							<Link href="/blog" className="link">
								all guides
							</Link>
							.
						</p>
					)}

					<div className="mt-10 flex flex-wrap gap-2 text-sm">
						<span className="text-slate-500 mr-1">Other topics:</span>
						{canonicalCategories
							.filter((c) => c.slug !== category.slug)
							.map((c) => (
								<Link
									key={c.slug}
									href={`/blog/category/${c.slug}`}
									className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
								>
									{c.value}
								</Link>
							))}
					</div>
				</div>
			</section>
		</div>
	);
}
