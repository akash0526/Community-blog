"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Heart, Send, User, Sparkles } from "lucide-react";

export default function DiscussionThread({ articleSlug }) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	// New comment form state
	const [content, setContent] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [submitting, setSubmitting] = useState(false);

	// Load session and comments
	useEffect(() => {
		const loadData = async () => {
			// 1. Get session or demo identity
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
			if (activeUser?.user_metadata?.full_name) {
				setAuthorName(activeUser.user_metadata.full_name);
			}

			// 2. Fetch remote comments
			let fetched = [];
			try {
				const { data, error } = await supabase
					.from("comments")
					.select("*")
					.eq("article_slug", articleSlug)
					.order("created_at", { ascending: true });

				if (!error && data) fetched = data;
			} catch (cloudErr) {}

			// 3. Fallback to localStorage comments
			try {
				const local = JSON.parse(
					localStorage.getItem("apex_comments_v1") || "[]",
				);
				const matchingLocal = local.filter((c) => c.article_slug === articleSlug);

				// Merge unique
				const existingIds = new Set(fetched.map((c) => c.id));
				const uniqueLocal = matchingLocal.filter((c) => !existingIds.has(c.id));

				setComments([...fetched, ...uniqueLocal]);
			} catch (e) {}

			setLoading(false);
		};

		loadData();
	}, [articleSlug]);

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (!content.trim()) return;

		setSubmitting(true);

		const activeName = authorName.trim() || "Community Storyteller";
		const activeAvatar =
			user?.user_metadata?.avatar_url ||
			"https://api.dicebear.com/7.x/bottts/svg?seed=" + activeName;
		const activeRole =
			user?.user_metadata?.professional_role || "Community Reader";

		const newComment = {
			id: "comm-" + Date.now(),
			created_at: new Date().toISOString(),
			article_slug: articleSlug,
			author_name: activeName,
			author_avatar: activeAvatar,
			author_role: activeRole,
			content: content.trim(),
			likes: 0,
		};

		// 1. Try Supabase cloud insert
		try {
			await supabase.from("comments").insert([
				{
					article_slug: articleSlug,
					author_name: activeName,
					author_avatar: activeAvatar,
					author_role: activeRole,
					content: content.trim(),
					likes: 0,
				},
			]);
		} catch (cloudErr) {}

		// 2. Always persist locally
		const updated = [...comments, newComment];
		setComments(updated);

		try {
			const allLocal = JSON.parse(
				localStorage.getItem("apex_comments_v1") || "[]",
			);
			allLocal.push(newComment);
			localStorage.setItem("apex_comments_v1", JSON.stringify(allLocal));
		} catch (err) {}

		setContent("");
		setSubmitting(false);
	};

	const handleLikeComment = async (commentId) => {
		// Update local instant state
		const updated = comments.map((c) => {
			if (c.id === commentId) return { ...c, likes: (c.likes || 0) + 1 };
			return c;
		});
		setComments(updated);

		// Mutate Cloud DB if remote comment
		if (!commentId.startsWith("comm-")) {
			try {
				await supabase.rpc("increment_comment_likes", {
					comment_row_id: commentId,
				});
			} catch (e) {}
		} else {
			// Mutate local storage
			try {
				const allLocal = JSON.parse(
					localStorage.getItem("apex_comments_v1") || "[]",
				);
				const target = allLocal.find((c) => c.id === commentId);
				if (target) target.likes = (target.likes || 0) + 1;
				localStorage.setItem("apex_comments_v1", JSON.stringify(allLocal));
			} catch (e) {}
		}
	};

	return (
		<section
			id="discussion-thread"
			className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800 text-left"
		>
			<div className="flex items-center justify-between mb-10 flex-wrap gap-4">
				<div className="flex items-center gap-3">
					<span className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shadow-sm">
						<MessageSquare className="w-5 h-5" />
					</span>
					<h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
						Community Discussion
					</h3>
				</div>
				<span className="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full text-xs font-black text-slate-600 dark:text-slate-300">
					{comments.length} {comments.length === 1 ? "Contribution" : "Contributions"}
				</span>
			</div>

			{/* Comment Submission Deck */}
			<form
				onSubmit={handleAddComment}
				className="card bg-white dark:bg-slate-900 p-6 sm:p-8 mb-14 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4"
			>
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
					<div className="flex items-center gap-2.5">
						<User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
						<input
							type="text"
							value={authorName}
							onChange={(e) => setAuthorName(e.target.value)}
							placeholder="Your Display Name..."
							className="bg-transparent font-black text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:text-indigo-600 dark:focus:text-indigo-400 transition"
						/>
					</div>
					<span className="text-[11px] font-extrabold text-slate-400 sm:self-center uppercase tracking-wider">
						Markdown Supported
					</span>
				</div>

				<textarea
					rows="3"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="What are your thoughts on this story? Leave an authentic perspective..."
					className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed resize-none"
				></textarea>

				<div className="flex items-center justify-between gap-3 pt-2">
					<div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
						{["🔥 Flawless", "👏 Spectacular", "💡 Brilliant idea", "🚀 Launch it"].map(
							(emoji) => (
								<button
									key={emoji}
									type="button"
									onClick={() => setContent((prev) => prev + " " + emoji)}
									className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-400 transition whitespace-nowrap cursor-pointer flex-shrink-0"
								>
									{emoji}
								</button>
							),
						)}
					</div>

					<button
						type="submit"
						disabled={submitting || !content.trim()}
						className="btn btn-primary px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/25 flex items-center gap-2 transform hover:scale-105 transition flex-shrink-0 cursor-pointer self-end sm:self-auto"
					>
						<Send className="w-3.5 h-3.5" />
						<span>{submitting ? "Posting..." : "Post Reply"}</span>
					</button>
				</div>
			</form>

			{/* Comments Stream */}
			{loading ? (
				<div className="py-12 text-center font-bold text-slate-400">
					⚡ Loading community perspectives...
				</div>
			) : comments.length === 0 ? (
				<div className="py-16 text-center bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
					<div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xl mx-auto mb-3">
						💡
					</div>
					<h4 className="font-black text-base text-slate-900 dark:text-white mb-1">
						Start the open conversation
					</h4>
					<p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
						Be the first community member to drop a perspective, reflection, or question on this piece!
					</p>
				</div>
			) : (
				<div className="space-y-6">
					{comments.map((comm) => (
						<div
							key={comm.id}
							className="card bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm transition hover:shadow-md border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
						>
							<div>
								{/* Author Header */}
								<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
									<div className="flex items-center gap-3">
										<img
											src={
												comm.author_avatar ||
												"https://api.dicebear.com/7.x/bottts/svg?seed=" + comm.id
											}
											alt="Avatar"
											className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
										/>
										<div>
											<div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
												<span>{comm.author_name}</span>
												<span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
													{comm.author_role}
												</span>
											</div>
											<div className="text-[11px] font-semibold text-slate-400 mt-0.5">
												{comm.created_at
													? new Date(comm.created_at).toLocaleDateString("en-US", {
															month: "short",
															day: "numeric",
															year: "numeric",
														})
													: "Just now"}
											</div>
										</div>
									</div>
								</div>

								{/* Comment Content */}
								<p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line break-words">
									{comm.content}
								</p>
							</div>

							{/* Actions Foot */}
							<div className="flex items-center justify-end pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
								<button
									type="button"
									onClick={() => handleLikeComment(comm.id)}
									className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-800/60 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 text-xs font-black transition cursor-pointer transform hover:scale-105 border border-slate-200/60 dark:border-slate-700/60"
								>
									<Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
									<span>{comm.likes || 0}</span>
									<span className="font-semibold text-slate-400 ml-0.5 hidden sm:inline">Likes</span>
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
