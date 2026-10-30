"use client";

import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { IconClose, IconSearch, IconSpinner } from "./Icon";
import { cleanExcerpt } from "@/lib/seoUtils";

const LOAD_MORE_SIZE = 12;

function cleanTitle(title) {
	if (!title) return "";
	return String(title).replace(/\s*Slug:.*$/i, "").trim();
}

function avatarUrl(art) {
	const raw = art.profiles?.avatar_url || "";
	if (!raw || raw.includes("dicebear") || raw.includes("bottts")) {
		const name = encodeURIComponent(art.profiles?.full_name || "Apex");
		return `https://ui-avatars.com/api/?name=${name}&background=5440d6&color=fff&size=64`;
	}
	return raw;
}

// Read URL filters once during state initialisation (never inside an effect)
// so shared links open pre-filtered with no render cascade.
function readUrlFilters() {
	if (typeof window === "undefined") return { q: "", category: "All" };
	try {
		const params = new URLSearchParams(window.location.search);
		return {
			q: (params.get("q") || "").slice(0, 100),
			category: params.get("category") || "All",
		};
	} catch {
		return { q: "", category: "All" };
	}
}

function readLocalPublished(initialArticles) {
	if (typeof window === "undefined") return [];
	try {
		const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
		const existing = new Set((initialArticles || []).map((a) => a.slug));
		return (stored || []).filter(
			(l) => l.status === "published" && !existing.has(l.slug),
		);
	} catch {
		return [];
	}
}

/**
 * Community feed — the stories already on the page, filtered instantly.
 *
 * Filtering used to fire a debounced `/api/articles` request on every
 * keystroke, which meant a skeleton swap, a network round-trip and a URL
 * rewrite for a list of ~12 cards. It now filters the rows that are already
 * in the browser (zero latency), keeps the URL in sync for shareable views,
 * and reserves the network for "load more" — where it is actually needed.
 */
export default function CommunityFeed({
	initialArticles = [],
	hasMore: initialHasMore = false,
	initialOffset = 0,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [localArticles, setLocalArticles] = useState([]);

	const [serverArticles, setServerArticles] = useState(initialArticles);
	const [offset, setOffset] = useState(initialOffset);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [loadingMore, setLoadingMore] = useState(false);
	const deferredQuery = useDeferredValue(searchQuery);

	// Client-only values (URL params & locally published drafts) are applied
	// after mount to avoid a hydration mismatch.
	useEffect(() => {
		// Deferred one tick: the server HTML is the unfiltered list, so the
		// client applies saved filters after hydration instead of during it.
		const timer = window.setTimeout(() => {
			const { q, category } = readUrlFilters();
			if (q) setSearchQuery(q);
			if (category && category !== "All") setSelectedCategory(category);
			setLocalArticles(readLocalPublished(initialArticles));
		}, 0);
		return () => window.clearTimeout(timer);
	}, [initialArticles]);

	// Keep the address bar shareable without navigating.
	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			if (searchQuery.trim()) params.set("q", searchQuery.trim());
			else params.delete("q");
			if (selectedCategory !== "All") params.set("category", selectedCategory);
			else params.delete("category");
			const next = `${window.location.pathname}${
				params.toString() ? `?${params.toString()}` : ""
			}${window.location.hash}`;
			window.history.replaceState(null, "", next);
		} catch {}
	}, [searchQuery, selectedCategory]);

	const articles = useMemo(
		() => [...localArticles, ...serverArticles],
		[localArticles, serverArticles],
	);

	const categories = useMemo(() => {
		const set = new Set(["All"]);
		articles.forEach((a) => {
			if (a.category) set.add(a.category);
		});
		return Array.from(set);
	}, [articles]);

	const filtered = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase();
		return articles.filter((art) => {
			const catMatch =
				selectedCategory === "All" || art.category === selectedCategory;
			if (!catMatch) return false;
			if (!q) return true;
			return (
				art.title?.toLowerCase().includes(q) ||
				art.meta_description?.toLowerCase().includes(q) ||
				art.target_keyword?.toLowerCase().includes(q) ||
				art.profiles?.full_name?.toLowerCase().includes(q)
			);
		});
	}, [articles, selectedCategory, deferredQuery]);

	const loadMore = useCallback(async () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
		try {
			const apiParams = new URLSearchParams();
			apiParams.set("limit", String(LOAD_MORE_SIZE));
			apiParams.set("offset", String(offset));
			const res = await fetch(`/api/articles?${apiParams.toString()}`);
			if (res.ok) {
				const data = await res.json();
				if (data.articles && data.articles.length > 0) {
					setServerArticles((prev) => [...prev, ...data.articles]);
					setOffset((prev) => prev + data.articles.length);
					setHasMore(Boolean(data.hasMore));
				} else {
					setHasMore(false);
				}
			} else {
				setHasMore(false);
			}
		} catch {
			// Leave the current list intact; the button stays available.
		} finally {
			setLoadingMore(false);
		}
	}, [loadingMore, hasMore, offset]);

	const reset = () => {
		setSearchQuery("");
		setSelectedCategory("All");
	};

	const searching = deferredQuery.trim().length > 0;

	return (
		<div id="feed" className="scroll-mt-24">
			<div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--hairline)] pb-5 lg:flex-row lg:items-center">
				<div
					className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-0.5"
					role="group"
					aria-label="Filter stories by category"
				>
					{categories.map((cat) => {
						const active = selectedCategory === cat;
						return (
							<button
								key={cat}
								type="button"
								onClick={() => setSelectedCategory(cat)}
								aria-pressed={active}
								className={`pill shrink-0${active ? " pill--active" : ""}`}
							>
								{cat}
							</button>
						);
					})}
				</div>

				<div className="relative w-full lg:w-72">
					<label htmlFor="feed-search" className="sr-only">
						Search stories
					</label>
					<IconSearch className="icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
					<input
						id="feed-search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search stories…"
						aria-label="Search stories"
						autoComplete="off"
						className="field !pl-9 !pr-9"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							aria-label="Clear search"
							className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-[var(--ink-faint)] transition-colors hover:bg-[var(--sunken)] hover:text-[var(--ink)]"
						>
							<IconClose className="icon icon--15" />
						</button>
					)}
				</div>
			</div>

			<p aria-live="polite" className="sr-only">
				{filtered.length} {filtered.length === 1 ? "story" : "stories"} shown
			</p>

			{filtered.length === 0 ? (
				<div className="card p-8">
					<h3 className="mb-1.5">No stories found</h3>
					<p className="mb-4 text-[0.9375rem] text-[var(--ink-muted)]">
						Nothing here matches that search.
						{searching && hasMore
							? " Only the stories loaded on this page are searched."
							: " Try a different keyword or category."}
					</p>
					<div className="flex flex-wrap items-center gap-4">
						<button type="button" onClick={reset} className="link cursor-pointer">
							Reset filters
						</button>
						{searching && (
							<Link
								href={`/blog?q=${encodeURIComponent(deferredQuery.trim())}`}
								className="btn btn--ghost btn--sm"
							>
								Search the full archive
							</Link>
						)}
					</div>
				</div>
			) : (
				<>
					<div className="cards !mt-0">
						{filtered.map((art) => (
							<article className="card" key={art.id || art.slug}>
								<Link
									href={`/blog/${art.slug}`}
									className="flex flex-1 flex-col"
									aria-label={cleanTitle(art.title)}
								>
									<div className="card__media">
										<Image
											src={art.image_url || "/opengraph-image"}
											alt=""
											fill
											quality={60}
											sizes="(max-width: 860px) 92vw, (max-width: 1160px) 45vw, 360px"
											loading="lazy"
											className="object-cover"
										/>
									</div>
									<div className="card__body">
										<span className="card__tag">
											{art.category || "Community"}
										</span>
										<h3 className="line-clamp-2">{cleanTitle(art.title)}</h3>
										<p className="line-clamp-2">
											{cleanExcerpt(art.meta_description)}
										</p>
										<div className="card__foot">
											<span>
												{art.published_at
													? new Date(art.published_at).toLocaleDateString(
															"en-GB",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)
													: "Recently"}
											</span>
											<span className="flex min-w-0 items-center gap-1.5">
												<Image
													src={avatarUrl(art)}
													alt=""
													width={20}
													height={20}
													className="h-5 w-5 rounded-full object-cover"
												/>
												<span className="truncate">
													{art.profiles?.full_name || "Apex Editorial"}
												</span>
											</span>
										</div>
									</div>
								</Link>
							</article>
						))}
					</div>

					{searching && hasMore && (
						<p className="mt-4 text-[0.8125rem] text-[var(--ink-faint)]">
							Searching the {articles.length} stories loaded here.{" "}
							<Link
								href={`/blog?q=${encodeURIComponent(deferredQuery.trim())}`}
								className="link"
							>
								Search the full archive
							</Link>
						</p>
					)}

					{hasMore && !searching && (
						<div className="mt-10 flex justify-center">
							<button
								type="button"
								onClick={loadMore}
								disabled={loadingMore}
								className="btn btn--ghost"
							>
								{loadingMore ? (
									<>
										<IconSpinner />
										Loading…
									</>
								) : (
									"Load more stories"
								)}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
