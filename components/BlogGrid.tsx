"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
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
 * Story archive.
 *
 * Filtering is client-side over the fetched list (no extra round-trips), the
 * typed query is deferred so keystrokes never block on the filter pass, and
 * the whole grid is a plain CSS grid — no animation library, no staggered
 * entrances that delay reading.
 */
export function BlogGrid({ articles }: BlogGridProps) {
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const deferredQuery = useDeferredValue(query);
	const searchRef = useRef<HTMLInputElement | null>(null);

	const categories = useMemo(() => {
		const set = new Set<string>();
		for (const article of articles) {
			if (article.category) set.add(article.category);
		}
		return ["All", ...Array.from(set).sort()];
	}, [articles]);

	const filtered = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase();
		return articles.filter((article) => {
			const matchesCategory =
				activeCategory === "All" || article.category === activeCategory;
			if (!matchesCategory) return false;
			if (!q) return true;
			return (
				cleanTitle(article.title).toLowerCase().includes(q) ||
				cleanExcerpt(article.meta_description).toLowerCase().includes(q) ||
				(article.category ?? "").toLowerCase().includes(q) ||
				(article.profiles?.full_name ?? "").toLowerCase().includes(q)
			);
		});
	}, [articles, deferredQuery, activeCategory]);

	const visible = filtered.slice(0, visibleCount);
	const hasFilters = query.trim() !== "" || activeCategory !== "All";

	function resetPage() {
		setVisibleCount(PAGE_SIZE);
	}

	// Deep links such as /blog?q=hosting open pre-filtered. Read on the
	// client (the route is statically rendered, so useSearchParams would
	// force a Suspense boundary for a purely cosmetic filter).
	useEffect(() => {
		// Deferred by a tick so the server-rendered list hydrates untouched;
		// the filter then applies without a hydration mismatch.
		const apply = () => {
			try {
				const initialQuery = new URLSearchParams(window.location.search).get("q");
				if (initialQuery) setQuery(initialQuery.slice(0, 80));
			} catch {}
		};
		const timer = window.setTimeout(apply, 0);
		return () => window.clearTimeout(timer);
	}, []);

	// "/" focuses search — a familiar shortcut, skipped while typing
	// anywhere else or when a modifier is held.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
				return;
			const target = event.target as HTMLElement | null;
			const tag = target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable)
				return;
			event.preventDefault();
			searchRef.current?.focus();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<div className="wrap py-[clamp(2.5rem,5vw,4rem)]">
			<header className="section-head">
				<p className="eyebrow">The archive</p>
				<h1>Every story, newest first</h1>
				<p className="lede mt-3">
					Field tests, guides and honest reviews from Nepal&rsquo;s maker
					community. Filter by topic, or search for something specific.
				</p>
			</header>

			<div className="flex flex-col gap-4 border-b border-[var(--hairline)] pb-5 lg:flex-row lg:items-center lg:justify-between">
				<div
					className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5"
					role="group"
					aria-label="Filter by category"
				>
					{categories.map((category) => {
						const active = activeCategory === category;
						return (
							<button
								key={category}
								type="button"
								aria-pressed={active}
								onClick={() => {
									setActiveCategory(category);
									resetPage();
								}}
								className={`pill shrink-0${active ? " pill--active" : ""}`}
							>
								{category}
							</button>
						);
					})}
				</div>

				<div className="relative w-full lg:w-72">
					<Search
						size={16}
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
					/>
					<label htmlFor="archive-search" className="sr-only">
						Search stories
					</label>
					<input
						ref={searchRef}
						id="archive-search"
						type="search"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							resetPage();
						}}
						placeholder="Search stories…"
						autoComplete="off"
						className="field !pl-9 !pr-9 [&::-webkit-search-cancel-button]:hidden"
					/>
					{query ? (
						<button
							type="button"
							onClick={() => {
								setQuery("");
								resetPage();
								searchRef.current?.focus();
							}}
							aria-label="Clear search"
							className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-[var(--ink-faint)] transition-colors hover:bg-[var(--sunken)] hover:text-[var(--ink)]"
						>
							<X size={14} aria-hidden="true" />
						</button>
					) : null}
				</div>
			</div>

			<p aria-live="polite" className="mt-4 text-[0.8125rem] text-[var(--ink-faint)]">
				{filtered.length === 0
					? "No matching stories"
					: `${filtered.length} ${filtered.length === 1 ? "story" : "stories"}${
							hasFilters ? " match your filters" : ""
						}`}
			</p>

			{visible.length > 0 ? (
				<>
					<div className="cards !mt-4">
						{visible.map((article, index) => (
							<BlogCard
								key={article.slug}
								title={cleanTitle(article.title)}
								excerpt={cleanExcerpt(article.meta_description)}
								image={article.image_url || "/opengraph-image"}
								author={{
									name: article.profiles?.full_name || "Apex Editorial",
									avatar:
										article.profiles?.avatar_url ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(
											article.profiles?.full_name || "Apex",
										)}&background=5440d6&color=fff&size=64`,
								}}
								date={
									formatDate(article.published_at || article.created_at) ||
									"Recently"
								}
								slug={article.slug}
								category={article.category || "Guide"}
								priority={index === 0}
							/>
						))}
					</div>

					{visible.length < filtered.length ? (
						<div className="mt-10 flex justify-center">
							<button
								type="button"
								onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
								className="btn btn--ghost"
							>
								Load more stories
								<span className="text-[var(--ink-faint)]">
									({filtered.length - visible.length} left)
								</span>
							</button>
						</div>
					) : null}
				</>
			) : (
				<div className="glass mt-6 p-10 text-center">
					<p className="font-display text-lg font-semibold">
						{articles.length === 0
							? "The first stories are on their way"
							: "No stories match your search"}
					</p>
					<p className="mt-2 text-[0.9375rem] text-[var(--ink-muted)]">
						{articles.length === 0
							? "Check back soon — or write the first one."
							: "Try a different keyword or category."}
					</p>
					{articles.length > 0 ? (
						<button
							type="button"
							onClick={() => {
								setQuery("");
								setActiveCategory("All");
								resetPage();
							}}
							className="btn btn--primary mt-6"
						>
							Clear filters
						</button>
					) : null}
				</div>
			)}
		</div>
	);
}
