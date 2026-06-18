import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fallbackArticles } from "@/lib/seedData";
import { Eye, Clock, Sparkles, Flame, Award } from "lucide-react";
import CommunityFeed from "@/components/CommunityFeed";

export const revalidate = 10; // Incremental Static Regeneration (ISR) every 10 seconds

export default async function HomepageExplore() {
	// Try fetching canonical live dispatches from Supabase Cloud
	let articles = [];
	try {
		const { data, error } = await supabase
			.from("articles")
			.select("*, profiles(full_name, professional_role, avatar_url)")
			.eq("status", "published")
			.order("created_at", { ascending: false });

		if (!error && data && data.length > 0) {
			articles = data;
		} else {
			articles = fallbackArticles;
		}
	} catch (err) {
		articles = fallbackArticles;
	}

	// Identify featured leader piece
	const featuredLeader = articles[0] || fallbackArticles[0];
	const regularLedger = articles.slice(1);

	return (
		<main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition text-left">
			<div className="max-w-7xl mx-auto px-6">
				{/* Universal Introductory Hero Deck */}
				<div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl mb-12 relative overflow-hidden border border-slate-800">
					<div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

					<div className="max-w-3xl relative z-10">
						<div className="flex items-center gap-3 mb-6 flex-wrap">
							<span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
								<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
								OPEN MULTI-TOPIC COMMUNITY LEDGER
							</span>
							<span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/30">
								⚡ 2026 Definitive Edition
							</span>
						</div>

						<h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
							Share Your Stories. <br />
							<span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
								Reach the World Instantly.
							</span>
						</h1>

						<p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl leading-relaxed font-normal">
							Welcome to the open digital ecosystem. Whether you&apos;re
							drafting personal life stories, philosophical deep-dives, culinary
							reviews, or technical architecture guides, our real-time AI Reach
							Assistant polishes your structure so your voice finds its global
							audience.
						</p>

						<div className="flex flex-wrap items-center gap-4">
							<Link
								href="/studio"
								className="btn btn-primary px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-indigo-600/30 flex items-center gap-2 transform hover:scale-105 transition"
							>
								<Sparkles className="w-5 h-5" />
								<span>✍️ Write Your Story Live</span>
							</Link>
							<a
								href="#community-feed-deck"
								className="btn btn-secondary text-white bg-white/5 border-slate-700 hover:border-slate-500 px-7 py-4 rounded-2xl font-extrabold text-base"
							>
								Explore Feed &rarr;
							</a>
						</div>
					</div>
				</div>

				{/* Featured Leader Card */}
				<div id="community-feed" className="mb-14">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
							<Flame className="w-7 h-7 text-amber-500 fill-amber-500/20" />
							<span>Top Featured Spotlight Dispatch</span>
						</h2>
						<span className="bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-slate-800">
							Community Dominance
						</span>
					</div>

					<Link
						href={`/blog/${featuredLeader.slug}`}
						className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition hover:shadow-indigo-500/10 group flex flex-col lg:flex-row text-left"
					>
						{/* Featured Media */}
						<div
							className="lg:w-1/2 h-72 lg:h-auto bg-cover bg-center relative overflow-hidden flex-shrink-0"
							style={{ backgroundImage: `url('${featuredLeader.image_url}')` }}
						>
							<div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
								{featuredLeader.category}
							</div>
							<div className="absolute bottom-4 left-4 bg-slate-950/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-slate-800">
								<Award className="w-4 h-4 text-emerald-400" />
								<span>
									⚡ {featuredLeader.seo_score}/100 AI Readability Score
								</span>
							</div>
						</div>

						{/* Featured Prose */}
						<div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
							<div>
								<div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
									<Clock className="w-4 h-4" />
									<span>{featuredLeader.published_at}</span>
									<span>•</span>
									<span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
										<Eye className="w-4 h-4" />{" "}
										{(featuredLeader.pageviews || 1).toLocaleString()} Genuine
										Hits
									</span>
								</div>

								<h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
									{featuredLeader.title}
								</h3>

								<p className="text-slate-600 dark:text-slate-300 text-base line-clamp-3 mb-8 leading-relaxed font-normal">
									{featuredLeader.meta_description}
								</p>
							</div>

							{/* Author Bar */}
							<div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
								<div className="flex items-center gap-3">
									<img
										src={
											featuredLeader.profiles?.avatar_url ||
											"https://avatars.githubusercontent.com/akash0526"
										}
										alt="Author"
										className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
									/>
									<div>
										<div className="text-sm font-black text-slate-900 dark:text-white">
											{featuredLeader.profiles?.full_name || "Akash"}
										</div>
										<div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
											{featuredLeader.profiles?.professional_role || "Creator"}
										</div>
									</div>
								</div>
								<span className="text-sm font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition flex items-center gap-1 whitespace-nowrap">
									Read Full Story &rarr;
								</span>
							</div>
						</div>
					</Link>
				</div>

				{/* Interactive Multi-Category Community Feed Deck */}
				<CommunityFeed initialArticles={regularLedger} />
			</div>
		</main>
	);
}
