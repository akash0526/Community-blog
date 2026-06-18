"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
	Eye,
	Clock,
	ArrowLeft,
	Sparkles,
	Award,
	Bookmark,
	Share2,
	Heart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DiscussionThread from "@/components/DiscussionThread";

export default function ArticleContent({ serverArticle, slug }) {
	const [article, setArticle] = useState(serverArticle);
	const [loading, setLoading] = useState(!serverArticle);
	const router = useRouter();

	// Social & Reaction States
	const [bookmarked, setBookmarked] = useState(false);
	const [following, setFollowing] = useState(false);
	const [claps, setClaps] = useState(serverArticle?.claps || 0);
	const [clapping, setClapping] = useState(false);
	const [shareToast, setShareToast] = useState(false);

	useEffect(() => {
		// Master failsafe: Automatic decode of incoming path
		const decodedSlug = decodeURIComponent(slug);

		// If the server didn't find it, try localStorage (articles published by sandboxed demo creators)
		if (!serverArticle) {
			try {
				const stored = JSON.parse(
					localStorage.getItem("apex_articles_v1") || "[]",
				);
				const localArticle = stored.find(
					(a) => decodeURIComponent(a.slug || "") === decodedSlug,
				);
				if (localArticle) {
					setArticle(localArticle);
					if (localArticle.claps) setClaps(localArticle.claps);
				}
			} catch (e) {
				console.warn("Could not read local fallback articles:", e);
			}
		}

		// Check existing reading list bookmarks and creator follows
		try {
			const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
			if (bms.some((b) => decodeURIComponent(b.slug || "") === decodedSlug))
				setBookmarked(true);

			const creatorName =
				serverArticle?.profiles?.full_name || "Community Storyteller";
			const fols = JSON.parse(
				localStorage.getItem("apex_following_v1") || "[]",
			);
			if (fols.includes(creatorName)) setFollowing(true);
		} catch (e) {}

		setLoading(false);
	}, [serverArticle, slug]);

	const handleToggleBookmark = () => {
		const decodedSlug = decodeURIComponent(slug);
		try {
			const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
			const exists = bms.some(
				(b) => decodeURIComponent(b.slug || "") === decodedSlug,
			);
			if (exists) {
				const filtered = bms.filter(
					(b) => decodeURIComponent(b.slug || "") !== decodedSlug,
				);
				localStorage.setItem("apex_bookmarks_v1", JSON.stringify(filtered));
				setBookmarked(false);
			} else {
				if (article) {
					bms.unshift(article);
					localStorage.setItem("apex_bookmarks_v1", JSON.stringify(bms));
					setBookmarked(true);
				}
			}
		} catch (e) {}
	};

	const handleToggleFollow = () => {
		const creatorName = article?.profiles?.full_name || "Community Storyteller";
		try {
			const fols = JSON.parse(
				localStorage.getItem("apex_following_v1") || "[]",
			);
			const exists = fols.includes(creatorName);
			if (exists) {
				const filtered = fols.filter((f) => f !== creatorName);
				localStorage.setItem("apex_following_v1", JSON.stringify(filtered));
				setFollowing(false);
			} else {
				fols.push(creatorName);
				localStorage.setItem("apex_following_v1", JSON.stringify(fols));
				setFollowing(true);
			}
		} catch (e) {}
	};

	const handleClap = async () => {
		setClaps((prev) => prev + 1);
		setClapping(true);
		setTimeout(() => setClapping(false), 800);

		if (
			article &&
			!article.id?.startsWith("seed-") &&
			!article.id?.startsWith("post-")
		) {
			try {
				await supabase.rpc("increment_claps", { article_id: article.id });
			} catch (e) {}
		} else if (article) {
			article.claps = (article.claps || 0) + 1;
		}
	};

	const handleShare = () => {
		const url = window.location.href;
		navigator.clipboard?.writeText(url);
		setShareToast(true);
		setTimeout(() => setShareToast(false), 2500);
	};

	if (loading) {
		return (
			<main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8">
				<div className="max-w-4xl mx-auto px-6 text-center py-24">
					<div className="animate-pulse space-y-4">
						<div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
						<div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
						<div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
					</div>
				</div>
			</main>
		);
	}

	if (!article) {
		return (
			<main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8">
				<div className="max-w-2xl mx-auto px-6 text-center py-24">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 mb-6">
						<span className="text-4xl">📄</span>
					</div>
					<h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
						Story Not Found
					</h1>
					<p className="text-slate-500 dark:text-slate-400 text-base mb-3 max-w-md mx-auto leading-relaxed">
						This story doesn&apos;t exist or may have been removed.
					</p>
					<p className="text-slate-400 dark:text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
						Want to craft a story on this topic? Head to the Studio and drop
						your piece live!
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<Link
							href="/"
							className="btn btn-secondary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"
						>
							<ArrowLeft className="w-4 h-4" /> Back to Explore Feed
						</Link>
						<Link
							href="/studio"
							className="btn btn-primary px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2"
						>
							<Sparkles className="w-4 h-4" /> Write Your Story
						</Link>
					</div>
				</div>
			</main>
		);
	}

	const isLocalArticle = article.id?.startsWith("post-");

	return (
		<main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition text-left">
			<div className="max-w-4xl mx-auto px-6">
				{/* Top Breadcrumb Header */}
				<div className="py-6 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
					<Link
						href="/"
						className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-50 dark:bg-slate-900 shadow-sm hover:bg-slate-100 border-slate-200/80"
					>
						<ArrowLeft className="w-4 h-4" /> Back to Explore Feed
					</Link>

					<div className="flex items-center gap-2 flex-wrap">
						<span className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5">
							<Award className="w-3.5 h-3.5" />
							<span>⚡ {article.seo_score}/100 AI Reach Score Passed</span>
						</span>
						{isLocalArticle && (
							<span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5">
								📍 Local Draft
							</span>
						)}
					</div>
				</div>

				{/* Floating Sticky Social Engagement Deck */}
				<div className="sticky top-24 z-30 my-8 py-3.5 px-6 rounded-3xl bg-slate-900/95 text-white backdrop-blur-md border border-slate-800 shadow-2xl flex items-center justify-between gap-4 transition flex-wrap">
					<div className="flex items-center gap-3 flex-wrap">
						<button
							type="button"
							onClick={handleClap}
							className={`btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border transition cursor-pointer ${clapping ? "bg-amber-400 text-slate-950 scale-110 border-amber-500 shadow-xl shadow-amber-400/30 font-extrabold" : "bg-white/10 hover:bg-white/20 text-slate-100 border-white/5"}`}
						>
							<span className="text-base">👏</span>
							<span className="font-mono text-sm">{claps}</span>
							<span className="hidden sm:inline font-bold">Claps</span>
						</button>

						<a
							href="#discussion-thread"
							className="btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-100 border border-white/5 transition"
						>
							<span className="text-base">💬</span>
							<span className="hidden sm:inline">Discuss</span>
						</a>
					</div>

					<div className="flex items-center gap-2.5 flex-wrap">
						<button
							type="button"
							onClick={handleToggleBookmark}
							className={`btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${bookmarked ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30" : "bg-white/10 hover:bg-white/20 text-slate-100 border-white/5"}`}
							title={bookmarked ? "Saved to Reading List" : "Bookmark Story"}
						>
							<Bookmark
								className={`w-3.5 h-3.5 ${bookmarked ? "fill-current text-white" : ""}`}
							/>
							<span className="hidden sm:inline">
								{bookmarked ? "Saved" : "Bookmark"}
							</span>
						</button>

						<button
							type="button"
							onClick={handleShare}
							className="btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-100 border border-white/5 transition cursor-pointer relative"
							title="Copy Canonical Link"
						>
							<Share2 className="w-3.5 h-3.5 text-indigo-400" />
							<span className="hidden sm:inline">Share</span>
							{shareToast && (
								<span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-slate-950 text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-2xl whitespace-nowrap animate-fadeIn pointer-events-none border border-slate-200">
									⚡ Link Copied!
								</span>
							)}
						</button>
					</div>
				</div>

				{/* Category & Timing Tag */}
				<div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 flex-wrap mt-6">
					<span className="bg-indigo-50 dark:bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900">
						{article.category}
					</span>
					<span className="text-slate-300 dark:text-slate-700">•</span>
					<span className="text-slate-500 font-semibold">
						{article.published_at || "Just now"}
					</span>
					<span className="text-slate-300 dark:text-slate-700">•</span>
					<span className="text-slate-500 font-semibold flex items-center gap-1">
						<Clock className="w-3.5 h-3.5" /> 5 min read
					</span>
				</div>

				{/* Headline */}
				<h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-10 tracking-tight sm:tracking-normal break-words">
					{article.title}
				</h1>

				{/* Community Author Attribution Bio Bar */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-12 bg-slate-50/80 dark:bg-slate-900/60 px-6 sm:px-8 rounded-3xl shadow-sm">
					<div className="flex items-center gap-4 min-w-0">
						<img
							src={
								article.profiles?.avatar_url ||
								"https://api.dicebear.com/7.x/bottts/svg?seed=" + article.id
							}
							alt="Avatar"
							className="w-12 sm:w-14 h-12 sm:h-14 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-700 flex-shrink-0"
						/>
						<div className="min-w-0">
							<div className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate flex items-center gap-2.5 flex-wrap">
								<span>
									{article.profiles?.full_name || "Community Storyteller"}
								</span>

								{/* Fast Follow Button */}
								<button
									type="button"
									onClick={handleToggleFollow}
									className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer border shadow-sm ${following ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-600 hover:scale-105 transform"}`}
								>
									{following ? "✓ Following" : "➕ Follow"}
								</button>
							</div>
							<div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
								{article.profiles?.professional_role || "Creator & Contributor"}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3 text-xs font-black text-slate-500 dark:text-slate-400 sm:ml-auto flex-wrap">
						<span className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
							<Eye className="w-4 h-4 text-indigo-500" />{" "}
							{(article.pageviews || 1).toLocaleString()} Hits
						</span>
						<span className="bg-emerald-500 text-slate-950 px-3.5 py-2 rounded-xl font-black flex items-center gap-1 shadow-md">
							⚡ Verified SSR
						</span>
					</div>
				</div>

				{/* Featured Media */}
				{article.image_url && (
					<img
						src={article.image_url}
						alt={article.title}
						className="w-full h-72 sm:h-[480px] object-cover rounded-3xl mb-14 shadow-2xl border border-slate-200 dark:border-slate-800 flex-shrink-0"
					/>
				)}

				{/* Master Standardized Markdown Rendered Layout */}
				<article className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-lg sm:text-xl space-y-6 break-words">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{article.content}
					</ReactMarkdown>
				</article>

				{/* Interactive Multi-User Comments Stream Deck */}
				<DiscussionThread articleSlug={decodeURIComponent(slug)} />

				{/* Multi-User CTA Box */}
				<div className="mt-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex-1">
						<span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/30 inline-block mb-3">
							⚡ Open Digital Community
						</span>
						<h3 className="text-2xl sm:text-3xl font-black mb-2">
							Enjoyed this perspective?
						</h3>
						<p className="text-slate-300 text-sm mb-0">
							Whether you are writing personal life stories, philosophy,
							culinary guides, or tech architectures, our real-time AI Reach
							Assistant helps you polish your stories and drop live instantly.
						</p>
					</div>

					<Link
						href="/studio"
						className="btn btn-primary px-8 py-4 rounded-2xl font-black text-sm w-full md:w-auto text-center justify-center shadow-xl shadow-indigo-600/30 transform hover:scale-105 transition flex-shrink-0"
					>
						✍️ Write Your Story Live &rarr;
					</Link>
				</div>
			</div>
		</main>
	);
}
