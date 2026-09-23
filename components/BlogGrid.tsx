"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { BlogCard } from "@/components/BlogCard";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { TextReveal } from "@/components/animations/TextReveal";
import { cn } from "@/lib/utils";
import { cleanExcerpt } from "@/lib/seoUtils";

/** Mirrors the server page's ArticleRow — only the fields the card UI
 *  reads (the server passes whatever Supabase/seed returned). */
export interface BlogArticle {
	slug: string;
	title: string;
	meta_description?: string | null;
	category?: string | null;
	image_url?: string | null;
	published_at?: string | null;
	created_at?: string | null;
	profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
}

interface BlogGridProps {
	articles: BlogArticle[];
}

const PAGE_SIZE = 12;

function cleanTitle(title: unknown) {
	if (!title) return "";
	return String(title).replace(/\s*Slug:.*$/i, "").trim();
}

function formatDate(value: unknown) {
	if (!value) return "";
	return new Date(String(value)).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Enhanced blog list (plan §4, adapted) — the server page passes in
 * the real Supabase-fetched articles (or seed fallback); this
 * component layers the animated search box, category pills, staggered
 * card grid and "Load More" reveal on top of that real data.
 * Filtering happens client-side over the fetched list, so no mock
 * data and no extra API calls are needed.
 */
export function BlogGrid({ articles }: BlogGridProps) {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const categories = useMemo(() => {
		const set = new Set<string>();
		for (const article of articles) {
			if (article.category) set.add(article.category);
		}
		return ["All", ...Array.from(set).sort()];
	}, [articles]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return articles.filter((article) => {
			const matchesCategory =
				activeCategory === "All" ||
				article.category === activeCategory;
			const matchesQuery =
				q === "" ||
				cleanTitle(article.title).toLowerCase().includes(q) ||
				cleanExcerpt(article.meta_description)
					.toLowerCase()
					.includes(q) ||
				(article.category ?? "").toLowerCase().includes(q);
			return matchesCategory && matchesQuery;
		});
	}, [articles, query, activeCategory]);

	const visible = filtered.slice(0, visibleCount);

	function resetPage() {
		setVisibleCount(PAGE_SIZE);
	}

	return (
		<div className="relative overflow-hidden">
			{/* Soft gradient wash at the top of the archive */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-500/10 to-transparent"
			/>

			<div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
				<header className="mb-12 text-center">
					<FadeIn>
						<span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
							<TrendingUp className="h-3.5 w-3.5 text-purple-400" />
							Latest stories
						</span>
					</FadeIn>
					<h1 className="mt-6">
						<TextReveal
							text="All stories"
							className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
						/>
					</h1>
					<FadeIn delay={0.3}>
						<p className="mx-auto mt-4 max-w-2xl text-muted">
							Insights, field tests and honest reviews from
							Nepal&rsquo;s maker community &mdash; newest
							first. Filter by topic or search for a specific
							story.
						</p>
					</FadeIn>
				</header>

				<FadeIn delay={0.2}>
					<div className="relative mx-auto mb-8 max-w-2xl">
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
						/>
						<input
							type="search"
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								resetPage();
							}}
							placeholder="Search stories, guides, reviews..."
							aria-label="Search stories"
							className="glass-strong w-full rounded-2xl py-4 pl-14 pr-5 text-base tracking-tight outline-none transition-shadow focus:ring-2 focus:ring-purple-500/60"
						/>
					</div>
				</FadeIn>

				<FadeIn delay={0.3}>
					<div className="mb-12 flex flex-wrap items-center justify-center gap-2">
						{categories.map((category) => (
							<motion.button
								key={category}
								animate={{
									scale: activeCategory === category ? 1.05 : 1,
								}}
								onClick={() => {
									setActiveCategory(category);
									resetPage();
								}}
								className={cn(
									"cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
									activeCategory === category
										? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
										: "glass hover:glass-strong",
								)}
							>
								{category}
							</motion.button>
						))}
					</div>
				</FadeIn>

				{visible.length > 0 ? (
					<>
						<StaggerContainer
							key={`${activeCategory}-${query}`}
							className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
							staggerDelay={0.08}
						>
							{visible.map((article) => (
								<StaggerItem key={article.slug} className="h-full">
									<BlogCard
										title={cleanTitle(article.title)}
										excerpt={cleanExcerpt(
											article.meta_description,
										)}
										image={
											article.image_url ||
											"/opengraph-image"
										}
										author={{
											name:
												article.profiles?.full_name ||
												"Apex Editorial",
											avatar:
												article.profiles?.avatar_url ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													article.profiles?.full_name ||
													"Apex",
												)}&background=8b5cf6&color=fff&size=64`,
										}}
										date={
											formatDate(
												article.published_at ||
													article.created_at,
											) || "Recently"
										}
										slug={article.slug}
										category={article.category || "Guide"}
									/>
								</StaggerItem>
							))}
						</StaggerContainer>

						{visible.length < filtered.length && (
							<FadeIn>
								<div className="mt-12 text-center">
									<button
										onClick={() =>
											setVisibleCount(
												(c) => c + PAGE_SIZE,
											)
										}
										className="glass-strong rounded-full px-8 py-4 text-base font-semibold tracking-tight transition-colors hover:bg-white/15"
									>
										Load More Stories (
										{filtered.length - visible.length}{" "}
										more)
									</button>
								</div>
							</FadeIn>
						)}
					</>
				) : (
					<FadeIn>
						<div className="glass mx-auto max-w-md rounded-2xl p-12 text-center">
							<p className="text-lg font-semibold">
								{articles.length === 0
									? "The blog is being written"
									: "No stories match your search"}
							</p>
							<p className="mt-2 text-sm text-muted">
								{articles.length === 0
									? "Check back soon — the first stories are on the way."
									: "Try a different keyword or category."}
							</p>
							{articles.length > 0 && (
								<button
									onClick={() => {
										setQuery("");
										setActiveCategory("All");
										resetPage();
									}}
									className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
								>
									Clear filters
								</button>
							)}
						</div>
					</FadeIn>
				)}
			</div>
		</div>
	);
}
