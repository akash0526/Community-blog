"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
	Eye,
	Clock,
	Trash2,
	Edit3,
	Bookmark,
	Users,
	Sparkles,
	LayoutDashboard,
	Rocket,
	ArrowRight,
	UserCircle,
	Save,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";

export default function AuthorDashboard() {
	const [user, setUser] = useState(null);
	const [articles, setArticles] = useState([]);
	const [bookmarks, setBookmarks] = useState([]);
	const [following, setFollowing] = useState([]);
	const [activeTab, setActiveTab] = useState("stories"); // stories vs bookmarks vs following vs profile
	const [profileForm, setProfileForm] = useState({
		fullName: "",
		profession: "",
		bio: "",
		avatarUrl: "",
	});
	const [profileSaving, setProfileSaving] = useState(false);
	const [profileMessage, setProfileMessage] = useState(null);
	const [profileError, setProfileError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSessionAndVaults = async () => {
			setLoading(true);

			// 1. Identify active user session or demo identity
			let activeUser = null;
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				activeUser = session.user;
			} else {
				const demo = localStorage.getItem("apex_demo_user");
				if (demo) {
					try {
						activeUser = JSON.parse(demo);
					} catch (e) {}
				}
			}
			setUser(activeUser);

			if (activeUser) {
				const initialProfile = {
					fullName:
						activeUser.user_metadata?.full_name ||
						activeUser.email?.split("@")[0] ||
						"Community Storyteller",
					profession:
						activeUser.user_metadata?.professional_role ||
						activeUser.user_metadata?.profession ||
						"Community Creator",
					bio:
						activeUser.user_metadata?.bio ||
						"Writing and sharing stories with the open community.",
					avatarUrl:
						activeUser.user_metadata?.avatar_url ||
						`https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.id || activeUser.email}`,
				};

				try {
					const { data: profile } = await supabase
						.from("profiles")
						.select("full_name, professional_role, bio, avatar_url")
						.eq("id", activeUser.id)
						.maybeSingle();

					if (profile) {
						initialProfile.fullName =
							profile.full_name || initialProfile.fullName;
						initialProfile.profession =
							profile.professional_role || initialProfile.profession;
						initialProfile.bio = profile.bio || initialProfile.bio;
						initialProfile.avatarUrl =
							profile.avatar_url || initialProfile.avatarUrl;
					}
				} catch (e) {}

				setProfileForm(initialProfile);
			}

			// 2. Fetch User Specific Ledger or local memory fallback
			if (activeUser) {
				try {
					const { data, error: supaErr } = await supabase
						.from("articles")
						.select("*")
						.eq(
							"author_id",
							activeUser.id?.startsWith("demo-") ||
								activeUser.id?.startsWith("community-")
								? "00000000-0000-0000-0000-000000000000"
								: activeUser.id,
						)
						.order("created_at", { ascending: false });

					if (!supaErr && data && data.length > 0) {
						setArticles(data);
					}
				} catch (cloudErr) {}
			}

			// Fallback local memory stories
			if (articles.length === 0) {
				try {
					const local = localStorage.getItem("apex_articles_v1");
					if (local) {
						const parsed = JSON.parse(local);
						setArticles(
							activeUser
								? parsed.filter(
										(a) =>
											a.author_id === activeUser.id ||
											a.author_id === "00000000-0000-0000-0000-000000000000",
									)
								: parsed,
						);
					}
				} catch (e) {}
			}

			// 3. Load Bookmarks Reading List
			try {
				const bms = JSON.parse(
					localStorage.getItem("apex_bookmarks_v1") || "[]",
				);
				setBookmarks(bms);
			} catch (e) {}

			// 4. Load Following Network
			try {
				const fols = JSON.parse(
					localStorage.getItem("apex_following_v1") || "[]",
				);
				setFollowing(fols);
			} catch (e) {}

			setLoading(false);
		};

		fetchSessionAndVaults();
	}, [articles.length]);

	const handleDeleteStory = async (articleId) => {
		if (
			!confirm(
				"⚡ Warning: Are you sure you want to permanently delete this story from the open ledger?",
			)
		)
			return;

		// Mutate cloud DB
		try {
			await supabase.from("articles").delete().eq("id", articleId);
		} catch (e) {}

		// Mutate local storage
		const updated = articles.filter((a) => a.id !== articleId);
		setArticles(updated);

		try {
			const allLocal = JSON.parse(
				localStorage.getItem("apex_articles_v1") || "[]",
			);
			const filtered = allLocal.filter((a) => a.id !== articleId);
			localStorage.setItem("apex_articles_v1", JSON.stringify(filtered));
		} catch (e) {}
	};

	const handleRemoveBookmark = (slug) => {
		const updated = bookmarks.filter((b) => b.slug !== slug);
		setBookmarks(updated);
		try {
			localStorage.setItem("apex_bookmarks_v1", JSON.stringify(updated));
		} catch (e) {}
	};

	const handleUnfollow = (creatorName) => {
		const updated = following.filter((f) => f !== creatorName);
		setFollowing(updated);
		try {
			localStorage.setItem("apex_following_v1", JSON.stringify(updated));
		} catch (e) {}
	};

	const handleProfileChange = (field, value) => {
		setProfileForm((current) => ({ ...current, [field]: value }));
	};

	const handleProfileSave = async (e) => {
		e.preventDefault();
		if (!user) return;

		setProfileSaving(true);
		setProfileMessage(null);
		setProfileError(null);

		const cleanProfile = {
			fullName: profileForm.fullName.trim() || "Community Storyteller",
			profession: profileForm.profession.trim() || "Community Creator",
			bio:
				profileForm.bio.trim() ||
				"Writing and sharing stories with the open community.",
			avatarUrl:
				profileForm.avatarUrl.trim() ||
				`https://api.dicebear.com/7.x/bottts/svg?seed=${user.id || user.email}`,
		};

		const updatedMetadata = {
			...(user.user_metadata || {}),
			full_name: cleanProfile.fullName,
			professional_role: cleanProfile.profession,
			bio: cleanProfile.bio,
			avatar_url: cleanProfile.avatarUrl,
		};

		try {
			const isDemoUser =
				user.id?.startsWith("demo-") || user.id?.startsWith("community-");

			if (!isDemoUser) {
				await supabase.auth.updateUser({ data: updatedMetadata });
				await supabase
					.from("profiles")
					.update({
						full_name: cleanProfile.fullName,
						professional_role: cleanProfile.profession,
						bio: cleanProfile.bio,
						avatar_url: cleanProfile.avatarUrl,
					})
					.eq("id", user.id);
			}

			const updatedUser = { ...user, user_metadata: updatedMetadata };
			setUser(updatedUser);
			setProfileForm(cleanProfile);
			localStorage.setItem("apex_demo_user", JSON.stringify(updatedUser));
			setProfileMessage(
				"Profile updated successfully. Your author details will appear on new stories and across your dashboard.",
			);
		} catch (err) {
			setProfileError(
				err?.message || "Could not update profile right now. Please try again.",
			);
		} finally {
			setProfileSaving(false);
		}
	};

	const totalHits = articles.reduce((sum, a) => sum + (a.pageviews || 1), 0);
	const totalClaps = articles.reduce((sum, a) => sum + (a.claps || 0), 0);

	if (loading) {
		return (
			<div className="flex-1 py-20 text-center font-black text-lg">
				⚡ Synchronizing Creator Hub & Reading List...
			</div>
		);
	}

	return (
		<main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition text-left">
			<div className="max-w-7xl mx-auto px-6">
				{/* Dashboard Head */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
					<div>
						<div className="flex items-center gap-2">
							<span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-indigo-500/25">
								🚀
							</span>
							<span className="text-2xl font-black text-slate-900 dark:text-white">
								Creator
								<span className="text-indigo-600 dark:text-indigo-400">
									Social
								</span>{" "}
								Hub
							</span>
						</div>
						<p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold mt-1">
							Live engagement captures, multi-genre written dispatches, and
							saved reading vaults for{" "}
							<span className="text-indigo-600 dark:text-indigo-400 font-bold">
								{user?.user_metadata?.full_name ||
									user?.email ||
									"Community Storyteller"}
							</span>
							.
						</p>
					</div>

					<Link
						href="/studio"
						className="btn btn-primary px-7 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 flex-shrink-0"
					>
						<Rocket className="w-4 h-4" />
						<span>✍️ Craft New Story</span>
					</Link>
				</div>

				{/* 3 Analytics Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
					<div className="card p-7 border-l-4 border-indigo-600 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
						<div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
							<span>Total Captured Pageviews</span>
							<span className="text-indigo-600 dark:text-indigo-400 font-bold">
								100% Genuine
							</span>
						</div>
						<div className="text-4xl font-black text-slate-900 dark:text-white my-3 font-mono">
							{totalHits.toLocaleString()}{" "}
							<span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-sans">
								Hits
							</span>
						</div>
						<div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
							Across {articles.length} published dispatches
						</div>
					</div>

					<div className="card p-7 border-l-4 border-amber-500 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
						<div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
							<span>Total Audience Claps</span>
							<span className="text-amber-500 font-bold">👏 Applause Hits</span>
						</div>
						<div className="text-4xl font-black text-slate-900 dark:text-white my-3 font-mono">
							{totalClaps.toLocaleString()}{" "}
							<span className="text-sm font-extrabold text-amber-500 font-sans">
								Claps
							</span>
						</div>
						<div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
							Audience resonance hits
						</div>
					</div>

					<div className="card p-7 border-l-4 border-emerald-500 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
						<div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
							<span>Personal Vault / Network</span>
							<span className="text-emerald-500 font-bold">Reading List</span>
						</div>
						<div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 my-3 font-mono">
							{bookmarks.length}{" "}
							<span className="text-sm font-extrabold text-slate-500 dark:text-slate-400 font-sans">
								Bookmarked
							</span>
						</div>
						<div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
							Following {following.length} active peers
						</div>
					</div>
				</div>

				{/* Master Social Navigation Deck */}
				<div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
					<button
						type="button"
						onClick={() => setActiveTab("stories")}
						className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
							activeTab === "stories"
								? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
								: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
						}`}
					>
						<LayoutDashboard className="w-4 h-4" />
						<span>My Stories & Vault ({articles.length})</span>
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("bookmarks")}
						className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
							activeTab === "bookmarks"
								? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
								: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
						}`}
					>
						<Bookmark className="w-4 h-4" />
						<span>🔖 Saved Reading List ({bookmarks.length})</span>
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("following")}
						className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
							activeTab === "following"
								? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
								: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
						}`}
					>
						<Users className="w-4 h-4" />
						<span>✨ Creators Following ({following.length})</span>
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("profile")}
						className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
							activeTab === "profile"
								? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
								: "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
						}`}
					>
						<UserCircle className="w-4 h-4" />
						<span>👤 Profile Settings</span>
					</button>
				</div>

				{/* Dynamic Tab Body */}
				<div className="card bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800">
					{/* Tab 1: Stories */}
					{activeTab === "stories" && (
						<div>
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
								<h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
									My Written Stories Vault
								</h3>
								<span className="text-xs font-extrabold text-slate-400">
									Fully Indexable & Public
								</span>
							</div>

							{articles.length === 0 ? (
								<div className="py-16 text-center space-y-4">
									<div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">
										✍️
									</div>
									<h4 className="text-xl font-black text-slate-900 dark:text-white">
										Your creator vault is empty
									</h4>
									<p className="text-xs text-slate-500 max-w-md mx-auto">
										You have not drafted or published any stories yet. Unleash
										your creative authority and write your first piece!
									</p>
									<Link
										href="/studio"
										className="btn btn-primary px-6 py-3 rounded-2xl text-xs font-black shadow-md"
									>
										Craft First Story &rarr;
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{articles.map((art) => (
										<div
											key={art.id}
											className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition hover:border-indigo-500 shadow-sm"
										>
											<div className="flex items-center gap-5 flex-1 min-w-0">
												<img
													src={art.image_url}
													alt="Banner"
													className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 hidden md:block flex-shrink-0"
												/>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														<span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
															{art.category}
														</span>

														<span
															className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
																art.status === "draft"
																	? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800"
																	: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
															}`}
														>
															{art.status === "draft"
																? "📝 Draft"
																: "⚡ Published"}
														</span>

														<span className="text-xs font-bold text-slate-500">
															{art.published_at || "Just now"}
														</span>
													</div>

													<Link
														href={`/blog/${art.slug}`}
														className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate block hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-1"
													>
														{art.title}
													</Link>

													<div className="flex items-center gap-4 text-xs text-slate-500 font-bold flex-wrap">
														<span>
															🔑 Topic:{" "}
															<span className="font-extrabold text-indigo-600 dark:text-indigo-400">
																{art.target_keyword}
															</span>
														</span>
														<span>•</span>
														<span className="text-amber-600 dark:text-amber-400">
															👏 {art.claps || 0} Claps
														</span>
														<span>•</span>
														<span className="text-indigo-500">
															⚡ {art.seo_score} Reach Points
														</span>
													</div>
												</div>
											</div>

											{/* Actions */}
											<div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0 flex-wrap">
												<div className="text-right mr-2 hidden sm:block">
													<div className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
														{(art.pageviews || 1).toLocaleString()}
													</div>
													<div className="text-[10px] font-extrabold text-slate-400 uppercase">
														Hits
													</div>
												</div>

												<Link
													href={`/studio?edit=${art.slug}`}
													className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition cursor-pointer"
													title="Resume Editing in Studio"
												>
													<Edit3 className="w-3.5 h-3.5" />
													<span>Edit</span>
												</Link>

												<Link
													href={`/blog/${art.slug}`}
													className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 bg-white dark:bg-slate-900 shadow-sm"
												>
													<span>
														{art.status === "draft" ? "Preview" : "Read"}
													</span>
												</Link>

												<button
													onClick={() => handleDeleteStory(art.id)}
													className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer border border-rose-200 dark:border-rose-900"
													title="Permanently Delete Story"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Tab 2: Bookmarks */}
					{activeTab === "bookmarks" && (
						<div>
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
								<h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
									<Bookmark className="w-5 h-5 text-indigo-500 fill-current" />
									<span>My Saved Bookmarks & Reading List</span>
								</h3>
								<span className="text-xs font-extrabold text-slate-400">
									Stored in browser cache
								</span>
							</div>

							{bookmarks.length === 0 ? (
								<div className="py-16 text-center space-y-4">
									<div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">
										🔖
									</div>
									<h4 className="text-xl font-black text-slate-900 dark:text-white">
										Your Reading List is empty
									</h4>
									<p className="text-xs text-slate-500 max-w-md mx-auto">
										When exploring articles, click the <b>&quot;Save&quot;</b>{" "}
										bookmark icon on the floating action deck to save your
										favorite deep dives here for later!
									</p>
									<Link
										href="/"
										className="btn btn-primary px-6 py-3 rounded-2xl text-xs font-black shadow-md"
									>
										Explore Stories Feed &rarr;
									</Link>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{bookmarks.map((bm) => (
										<div
											key={bm.slug}
											className="card p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between shadow-sm transition hover:shadow-lg"
										>
											<div>
												<div className="flex items-center justify-between gap-2 mb-3">
													<span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-3 py-1 rounded-full">
														{bm.category || "Story"}
													</span>
													<button
														type="button"
														onClick={() => handleRemoveBookmark(bm.slug)}
														className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer pl-2"
														title="Remove Bookmark"
													>
														✕ Remove
													</button>
												</div>

												<h4 className="font-black text-lg text-slate-900 dark:text-white leading-snug mb-3 hover:text-indigo-600 transition">
													<Link href={`/blog/${bm.slug}`}>{bm.title}</Link>
												</h4>

												<p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-6">
													{bm.meta_description}
												</p>
											</div>

											<div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/80">
												<div className="flex items-center gap-2">
													<span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
														{bm.profiles?.full_name || "Community Storyteller"}
													</span>
												</div>
												<Link
													href={`/blog/${bm.slug}`}
													className="btn btn-primary px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1"
												>
													<span>Read</span> <ArrowRight className="w-3 h-3" />
												</Link>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Tab 3: Following Network */}
					{activeTab === "following" && (
						<div>
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
								<h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
									<Users className="w-5 h-5 text-indigo-500" />
									<span>Creators I am Following</span>
								</h3>
								<span className="text-xs font-extrabold text-slate-400">
									Open Community Network
								</span>
							</div>

							{following.length === 0 ? (
								<div className="py-16 text-center space-y-4">
									<div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">
										👥
									</div>
									<h4 className="text-xl font-black text-slate-900 dark:text-white">
										You are not following any creators yet
									</h4>
									<p className="text-xs text-slate-500 max-w-md mx-auto">
										When reading an inspiring personal story or engineering deep
										dive, click the <b>&quot;➕ Follow&quot;</b> button next to
										the author&apos;s name to construct your peer network!
									</p>
									<Link
										href="/"
										className="btn btn-primary px-6 py-3 rounded-2xl text-xs font-black shadow-md"
									>
										Discover Creators &rarr;
									</Link>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{following.map((creator) => (
										<div
											key={creator}
											className="card p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 shadow-sm"
										>
											<div className="flex items-center gap-3.5 min-w-0">
												<img
													src={`https://api.dicebear.com/7.x/bottts/svg?seed=${creator}`}
													alt="Creator"
													className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 flex-shrink-0"
												/>
												<div className="min-w-0">
													<div className="font-black text-base text-slate-900 dark:text-white truncate block">
														{creator}
													</div>
													<div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
														Author & Peer
													</div>
												</div>
											</div>

											<button
												type="button"
												onClick={() => handleUnfollow(creator)}
												className="btn btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 flex-shrink-0"
											>
												Unfollow
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Tab 4: Profile Settings */}
					{activeTab === "profile" && (
						<div>
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 flex-wrap gap-3">
								<h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
									<UserCircle className="w-5 h-5 text-indigo-500" />
									<span>Update My Public Profile</span>
								</h3>
								<span className="text-xs font-extrabold text-slate-400">
									Shown beside your stories
								</span>
							</div>

							{!user ? (
								<div className="py-16 text-center space-y-4">
									<div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">
										👤
									</div>
									<h4 className="text-xl font-black text-slate-900 dark:text-white">
										Please log in to edit your profile
									</h4>
									<p className="text-xs text-slate-500 max-w-md mx-auto">
										Create an account or use demo login from the navbar to
										customize your author identity.
									</p>
								</div>
							) : (
								<form
									onSubmit={handleProfileSave}
									className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
								>
									<div className="lg:col-span-4 card p-6 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-center">
										<img
											src={
												profileForm.avatarUrl ||
												`https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`
											}
											alt="Profile avatar preview"
											className="w-28 h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl mx-auto mb-4"
										/>
										<h4 className="text-xl font-black text-slate-900 dark:text-white truncate">
											{profileForm.fullName || "Community Storyteller"}
										</h4>
										<p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
											{profileForm.profession || "Community Creator"}
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
											{profileForm.bio || "Your short bio will appear here."}
										</p>
									</div>

									<div className="lg:col-span-8 space-y-5">
										{profileMessage && (
											<div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-start gap-2.5">
												<CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
												<span>{profileMessage}</span>
											</div>
										)}

										{profileError && (
											<div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2.5">
												<AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
												<span>{profileError}</span>
											</div>
										)}

										<div>
											<label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
												Full Name
											</label>
											<input
												type="text"
												value={profileForm.fullName}
												onChange={(e) =>
													handleProfileChange("fullName", e.target.value)
												}
												className="input font-bold text-sm py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
												placeholder="Your public author name"
											/>
										</div>

										<div>
											<label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
												Profession / Role
											</label>
											<input
												type="text"
												value={profileForm.profession}
												onChange={(e) =>
													handleProfileChange("profession", e.target.value)
												}
												className="input font-bold text-sm py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
												placeholder="Journalist, Student, Teacher, Developer..."
											/>
										</div>

										<div>
											<label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
												Avatar URL
											</label>
											<input
												type="url"
												value={profileForm.avatarUrl}
												onChange={(e) =>
													handleProfileChange("avatarUrl", e.target.value)
												}
												className="input font-mono text-xs py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
												placeholder="https://..."
											/>
										</div>

										<div>
											<label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
												Bio
											</label>
											<textarea
												rows="5"
												value={profileForm.bio}
												onChange={(e) =>
													handleProfileChange("bio", e.target.value)
												}
												className="input font-medium text-sm py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 leading-relaxed resize-none"
												placeholder="Tell readers about your interests, expertise, or community voice..."
											/>
										</div>

										<button
											type="submit"
											disabled={profileSaving}
											className="btn btn-primary px-7 py-3 rounded-2xl text-sm font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2"
										>
											<Save className="w-4 h-4" />
											<span>
												{profileSaving
													? "Saving Profile..."
													: "Save Profile Details"}
											</span>
										</button>
									</div>
								</form>
							)}
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
