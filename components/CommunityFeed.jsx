"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, Clock, Search, Sparkles } from "lucide-react";

export default function CommunityFeed({ initialArticles = [] }) {
	const [articles, setArticles] = useState(initialArticles);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Feed");

	// Synchronize with demo articles published to localStorage
	useEffect(() => {
		try {
			const stored = JSON.parse(
				localStorage.getItem("apex_articles_v1") || "[]",
			);
			if (stored && stored.length > 0) {
				// Merge stored items that aren't already in the server list
				const existingIds = new Set(initialArticles.map((a) => a.id));
				const existingSlugs = new Set(initialArticles.map((a) => a.slug));

				const uniqueLocal = stored.filter(
					(localItem) =>
						localItem.status === "published" &&
						!existingIds.has(localItem.id) &&
						!existingSlugs.has(localItem.slug),
				);

				if (uniqueLocal.length > 0) {
					setArticles([...uniqueLocal, ...initialArticles]);
				}
			}
		} catch (e) {
			console.warn("Could not read local fallback articles:", e);
		}
	}, [initialArticles]);

	// Extract unique categories dynamically plus core ones
	const categories = useMemo(() => {
		const set = new Set([
			"All Feed",
			"Tech & AI",
			"Startups & Growth",
			"SEO Strategy",
			"Web Development",
			"Personal Stories",
			"Philosophy & Culture",
			"Travel & Lifestyle",
			"Arts & Fiction",
		]);
		articles.forEach((art) => {
			if (art.category) set.add(art.category);
		});
		return Array.from(set);
	}, [articles]);

	// Filter active ledger based on search query and selected category
	const filteredArticles = useMemo(() => {
		return articles.filter((art) => {
			const matchesCategory =
				selectedCategory === "All Feed" || art.category === selectedCategory;
			const matchesSearch =
				!searchQuery.trim() ||
				art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				art.meta_description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				art.target_keyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				art.profiles?.full_name
					?.toLowerCase()
					.includes(searchQuery.toLowerCase());

			return matchesCategory && matchesSearch;
		});
	}, [articles, selectedCategory, searchQuery]);

	return (
		<div id="community-feed-deck">
			{/* Categories Bar & Active Ledger Grid */}
			<div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-10">
				<div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
					{categories.map((cat, idx) => {
						const isActive = selectedCategory === cat;
						return (
							<button
								key={cat}
								type="button"
								onClick={() => setSelectedCategory(cat)}
								className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
									isActive
										? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-black scale-105"
										: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
								}`}
							>
								{cat}
							</button>
						);
					})}
				</div>

				{/* Search bar */}
				<div className="relative w-full sm:w-80">
					<span className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500">
						<Search className="w-4 h-4" />
					</span>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search active dispatches, exact keywords..."
						className="input pl-11 text-xs sm:text-sm font-bold rounded-2xl py-3.5 bg-white dark:bg-slate-900 dark:text-white dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
						>
							✕
						</button>
					)}
				</div>
			</div>

			{/* Filter Results Status / Empty State */}
			{filteredArticles.length === 0 ? (
				<div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
					<div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto mb-4">
						🔍
					</div>
					<h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
						No community dispatches found
					</h3>
					<p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
						We couldn&apos;t find any articles matching your search query &quot;
						<span className="text-indigo-600 dark:text-indigo-400 font-bold">
							{searchQuery}
						</span>
						&quot; or category &quot;
						<span className="text-indigo-600 dark:text-indigo-400 font-bold">
							{selectedCategory}
						</span>
						&quot;.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							onClick={() => {
								setSearchQuery("");
								setSelectedCategory("All Feed");
							}}
							className="btn btn-secondary px-5 py-2.5 rounded-xl text-xs font-black"
						>
							Reset Filters
						</button>
						<Link
							href="/studio"
							className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-indigo-600/25 flex items-center gap-1.5"
						>
							<Sparkles className="w-4 h-4" /> Write on this topic &rarr;
						</Link>
					</div>
				</div>
			) : (
				/* Regular Community Ledger Grid */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
					{filteredArticles.map((art) => {
						const isLocal = art.id?.startsWith("post-");
						return (
							<Link
								key={art.id}
								href={`/blog/${art.slug}`}
								className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition group flex flex-col justify-between h-full"
							>
								{/* Media Card */}
								<div
									className="h-56 bg-cover bg-center relative overflow-hidden flex-shrink-0"
									style={{ backgroundImage: `url('${art.image_url}')` }}
								>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

									<div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
										{art.category}
									</div>

									<div
										className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1 shadow-md ${
											isLocal
												? "bg-amber-500 text-slate-950"
												: "bg-emerald-500 text-slate-950"
										}`}
										title={
											isLocal ? "Local Draft Piece" : "Verified Cloud Dispatch"
										}
									>
										{isLocal ? "📍 Local Draft" : `⚡ ${art.seo_score} Score`}
									</div>
								</div>

								{/* Prose Card */}
								<div className="p-7 sm:p-8 flex flex-col flex-1 justify-between">
									<div>
										<div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
											<Clock className="w-3.5 h-3.5" />
											<span>{art.published_at || "Just now"}</span>
											<span>•</span>
											<span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
												<Eye className="w-3.5 h-3.5" />{" "}
												{(art.pageviews || 1).toLocaleString()} hits
											</span>
										</div>

										<h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
											{art.title}
										</h3>

										<p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-8 leading-relaxed font-normal">
											{art.meta_description}
										</p>
									</div>

									{/* Attribution Foot */}
									<div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/80">
										<div className="flex items-center gap-3">
											<img
												src={
													art.profiles?.avatar_url ||
													"https://api.dicebear.com/7.x/bottts/svg?seed=" +
														art.id
												}
												alt="Author"
												className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
											/>
											<span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
												{art.profiles?.full_name || "Community Dev"}
											</span>
										</div>
										<span className="text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition flex items-center gap-1 whitespace-nowrap">
											Read Live &rarr;
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
