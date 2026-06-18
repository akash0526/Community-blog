"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { analyzeSeo, generateCleanSlug } from "@/lib/seoEngine";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
	Sparkles,
	Image as ImageIcon,
	CheckCircle2,
	AlertCircle,
	Eye,
	Rocket,
	HelpCircle,
	FileText,
	Upload,
	Flame,
} from "lucide-react";

const defaultContent = `# Modern Serverless Architecture: Scaling Database Connections

The next era of web development centers on high-performance edge components. In this architectural guide, we break down exactly how to construct highly resilient connection pools using PgBouncer and Vercel Edge Functions.

---

## 1. Why Direct Connections Fail at the Edge

When multiple concurrent serverless runtimes execute database operations, standard HTTP request and process lifecycles break down. Ephemeral edge functions attempt to spawn hundreds of persistent TCP processes simultaneously, exhausting PostgreSQL memory buffers instantly.

Instead, we must route all edge lambda transactions through a centralized transaction-mode connection proxy.

### Core Architectural Best Practices:
* Maintain highly lightweight individual connection pools.
* Utilize connection multiplexing via PgBouncer.
* Enforce rigorous structured headings and outbound documentation links like [Next.js App Router](https://nextjs.org).
`;

export default function AuthorStudio() {
	const router = useRouter();
	const [title, setTitle] = useState(
		"Why Connection Pooling is Mandatory in Serverless App Routers",
	);
	const [targetKeyword, setTargetKeyword] = useState("Connection Pooling");
	const [category, setCategory] = useState("Web Development");
	const [metaDescription, setMetaDescription] = useState(
		"An comprehensive developer guide exploring how to scale database connections in Serverless Next.js App Routers using PgBouncer and connection multiplexing.",
	);
	const [imageUrl, setImageUrl] = useState(
		"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
	);
	const [content, setContent] = useState(defaultContent);
	const [activeTab, setActiveTab] = useState("write"); // write vs preview

	// Scoring state
	const [audit, setAudit] = useState({
		totalScore: 85,
		wordCount: 150,
		checklist: [],
	});
	const [uploading, setUploading] = useState(false);
	const [publishing, setPublishing] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);

	// Real-time evaluation effect
	useEffect(() => {
		const result = analyzeSeo({
			title,
			targetKeyword,
			metaDescription,
			content,
		});
		setAudit(result);
	}, [title, targetKeyword, metaDescription, content]);

	// Auth synchronization
	useEffect(() => {
		const getSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				setUser(session.user);
			} else {
				const demo = localStorage.getItem("apex_demo_user");
				if (demo) {
					try {
						setUser(JSON.parse(demo));
					} catch (e) {}
				} else {
					// Auto create a demo developer session if anonymous so anyone can test the studio instantly
					const autoDemo = {
						id: "community-dev-" + Date.now(),
						email: "independent.dev@example.com",
						user_metadata: {
							full_name: "Community Architect",
							avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Arch",
						},
					};
					setUser(autoDemo);
					localStorage.setItem("apex_demo_user", JSON.stringify(autoDemo));
				}
			}
		};
		getSession();
	}, []);

	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setError(null);

		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `community-${Date.now()}.${fileExt}`;
			const { error: uploadErr } = await supabase.storage
				.from("article_images")
				.upload(fileName, file, { upsert: true });

			if (uploadErr) {
				throw uploadErr;
			}

			const {
				data: { publicUrl },
			} = supabase.storage.from("article_images").getPublicUrl(fileName);

			setImageUrl(publicUrl);
		} catch (err) {
			setError(
				"⚡ Storage Notice: Using live professional backup CDNs for instant preview.",
			);
			setImageUrl(
				"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
			);
		} finally {
			setUploading(false);
		}
	};

	const handlePublish = async () => {
		setPublishing(true);
		setError(null);

		try {
			const slug = generateCleanSlug(title);
			const activeAuthorName =
				user?.user_metadata?.full_name || "Community Architect";
			const activeAuthorAvatar =
				user?.user_metadata?.avatar_url ||
				"https://api.dicebear.com/7.x/bottts/svg?seed=Comm";
			const isDemoUser =
				user?.id?.startsWith("demo-") || user?.id?.startsWith("community-");

			// Build the full article object
			const newDispatch = {
				id: "post-" + Date.now(),
				created_at: new Date().toISOString(),
				published_at: new Date().toISOString().split("T")[0],
				author_id: user?.id || "demo-1",
				profiles: {
					full_name: activeAuthorName,
					professional_role: "Software Architect",
					avatar_url: activeAuthorAvatar,
				},
				title,
				slug,
				category,
				target_keyword: targetKeyword,
				meta_description: metaDescription,
				image_url: imageUrl,
				content,
				seo_score: audit.totalScore,
				pageviews: 1,
				status: "published",
			};

			// 1. Try Supabase insert (only if user is a real authenticated user with a valid UUID)
			let supabaseSuccess = false;
			if (!isDemoUser && user?.id) {
				try {
					const { error: dbErr } = await supabase.from("articles").insert([
						{
							author_id: user.id,
							title,
							slug,
							category,
							target_keyword: targetKeyword,
							meta_description: metaDescription,
							image_url: imageUrl,
							content,
							seo_score: audit.totalScore,
							pageviews: 1,
							status: "published",
						},
					]);

					if (dbErr) {
						console.warn("Supabase Insert Notice:", dbErr.message);
					} else {
						supabaseSuccess = true;
					}
				} catch (cloudErr) {
					console.warn("Supabase Insert Error:", cloudErr);
				}
			}

			// 2. Always save to localStorage as fallback
			const fallbackStore = JSON.parse(
				localStorage.getItem("apex_articles_v1") || "[]",
			);
			fallbackStore.unshift(newDispatch);
			localStorage.setItem("apex_articles_v1", JSON.stringify(fallbackStore));

			// Let the user know what happened
			if (supabaseSuccess) {
				// All good, published to cloud!
			} else if (!isDemoUser && user?.id) {
				// Real user but Supabase insert failed
				setError(
					"⚠️ Cloud save unavailable — saved locally to your browser. You can view it, but other users won't see it until Supabase is connected.",
				);
			}
			// Demo users: silently use localStorage — this is expected behavior

			// Navigate to the new article
			router.push(`/blog/${slug}`);
		} catch (err) {
			setError(err.message || "An unexpected error occurred while publishing.");
			setPublishing(false);
		}
	};

	return (
		<main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition">
			<div className="max-w-7xl mx-auto px-6">
				{/* Navigation Bar / Page Info */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
					<div>
						<div className="flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-indigo-600"></span>
							<span className="text-xs font-black uppercase text-slate-400 tracking-wider">
								Expert Author Studio & Live Editor
							</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
							Draft & Score Technical Dispatch
						</h1>
					</div>

					<div className="flex items-center gap-3 w-full md:w-auto">
						<button
							onClick={() =>
								setActiveTab(activeTab === "write" ? "preview" : "write")
							}
							className="btn btn-secondary px-5 py-2.5 rounded-xl text-xs font-black flex-1 md:flex-none"
						>
							{activeTab === "write" ? "👁️ Preview Markdown" : "✍️ Edit Markdown"}
						</button>
						<button
							onClick={handlePublish}
							disabled={publishing || audit.totalScore < 50}
							className={`btn px-7 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 flex-1 md:flex-none transition transform hover:scale-105 ${
								audit.totalScore >= 80
									? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
									: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
							}`}
						>
							<Rocket className="w-4 h-4" />
							<span>{publishing ? "Publishing..." : "⚡ Publish Live"}</span>
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-3 text-left">
						<AlertCircle className="w-5 h-5 flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
					{/* Main Editing Deck (Cols 8) */}
					<div className="lg:col-span-8 space-y-6">
						{/* Metadata Configuration Box */}
						<div className="card bg-white dark:bg-slate-900 p-8 space-y-5">
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
								<span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
									1. Technical SEO Identifiers
								</span>
								<span className="text-xs font-semibold text-slate-400">
									Required for standardized Open Graph Schema
								</span>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
									Article Headline (H1 Primary Title)
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. Why Connection Pooling is Mandatory in Serverless App Routers"
									className="input font-extrabold text-lg py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
								/>
								<div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1.5 px-1">
									<span>Optimal SERP length: 40-65 characters</span>
									<span
										className={
											title.length >= 40 && title.length <= 65
												? "text-emerald-500 font-black"
												: "text-amber-500"
										}
									>
										{title.length} chars
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
										Target Intent Keyword
									</label>
									<input
										type="text"
										value={targetKeyword}
										onChange={(e) => setTargetKeyword(e.target.value)}
										placeholder="e.g. Connection Pooling"
										className="input font-bold text-sm py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
									/>
								</div>

								<div>
									<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
										Category Section
									</label>
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="input font-bold text-sm py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 cursor-pointer"
									>
										<option value="Web Development">Web Development</option>
										<option value="Tech & AI">Tech & AI</option>
										<option value="Startups & Growth">Startups & Growth</option>
										<option value="SEO Strategy">SEO Strategy</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
									Meta Description Snippet
								</label>
								<textarea
									rows="2"
									value={metaDescription}
									onChange={(e) => setMetaDescription(e.target.value)}
									placeholder="Write a concise 140-character overview of your piece containing your primary keyword..."
									className="input font-medium text-sm py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 leading-relaxed"
								></textarea>
								<div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1 px-1">
									<span>Optimal SERP snippet: 120-165 characters</span>
									<span
										className={
											metaDescription.length >= 120 &&
											metaDescription.length <= 165
												? "text-emerald-500 font-black"
												: "text-amber-500"
										}
									>
										{metaDescription.length} chars
									</span>
								</div>
							</div>

							{/* Media Hub */}
							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
									Featured Open Graph Media Banner
								</label>
								<div className="flex flex-col sm:flex-row items-center gap-4">
									<div className="relative flex-1 w-full">
										<span className="absolute left-3.5 top-3.5 text-slate-400">
											<ImageIcon className="w-4 h-4" />
										</span>
										<input
											type="url"
											value={imageUrl}
											onChange={(e) => setImageUrl(e.target.value)}
											placeholder="https://images.unsplash.com/..."
											className="input pl-10 font-mono text-xs py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
										/>
									</div>

									<div className="relative flex-shrink-0 w-full sm:w-auto">
										<input
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											disabled={uploading}
											className="absolute inset-0 opacity-0 cursor-pointer z-10"
										/>
										<button
											type="button"
											className="btn btn-secondary w-full px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
										>
											<Upload className="w-4 h-4 text-indigo-500" />
											<span>
												{uploading ? "Uploading..." : "⚡ Cloud Upload"}
											</span>
										</button>
									</div>
								</div>

								{/* Instant Photography Presets */}
								<div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
									<span className="text-[11px] font-extrabold text-slate-400 uppercase mr-1">
										Instant Presets:
									</span>
									{[
										{
											label: "⚡ Neural Stream",
											url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "🚀 Server Deck",
											url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "🌐 Jamstack Web",
											url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "💻 Autonomous Core",
											url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
										},
									].map((preset) => (
										<button
											key={preset.label}
											type="button"
											onClick={() => setImageUrl(preset.url)}
											className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition whitespace-nowrap cursor-pointer flex-shrink-0"
										>
											{preset.label}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Markdown Prose Zone */}
						<div className="card bg-white dark:bg-slate-900 p-8 space-y-4">
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
								<span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
									2. Master Standardized Markdown Prose
								</span>
								<span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
									<FileText className="w-3.5 h-3.5" /> {audit.wordCount} Words
									Total
								</span>
							</div>

							{activeTab === "write" ? (
								<div>
									<textarea
										rows="16"
										value={content}
										onChange={(e) => setContent(e.target.value)}
										placeholder="Write your beautiful markdown article here..."
										className="input font-mono text-sm py-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700/80 leading-relaxed dark:text-slate-200"
									></textarea>
									<div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-400 mt-2 px-2 gap-2">
										<span>
											Pro tip: Use ## for semantic sub-headings and embed
											outbound markdown reference links.
										</span>
										<button
											type="button"
											onClick={() => setContent(defaultContent)}
											className="text-indigo-500 hover:underline"
										>
											Reset Template
										</button>
									</div>
								</div>
							) : (
								<div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none min-h-[400px]">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{content}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>

					{/* Right Real-Time Interactive Live Scorecard (Cols 4) */}
					<div className="lg:col-span-4 space-y-6">
						<div className="card bg-slate-900 text-white p-7 shadow-2xl border border-slate-800 flex flex-col justify-between">
							<div>
								{/* Meter Head */}
								<div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
									<span className="text-xs font-black uppercase tracking-widest text-slate-400">
										Technical SEO Dial
									</span>
									<span
										className={`text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow ${
											audit.totalScore >= 80
												? "bg-emerald-500 text-slate-950"
												: "bg-amber-500 text-slate-950"
										}`}
									>
										⚡{" "}
										{audit.totalScore >= 80 ? "Well Optimized" : "Needs Polish"}
									</span>
								</div>

								{/* Main Big Dial */}
								<div className="text-center my-6">
									<div className="inline-flex items-center justify-center relative">
										<svg className="w-32 h-32 transform -rotate-90">
											<circle
												cx="64"
												cy="64"
												r="54"
												stroke="currentColor"
												strokeWidth="12"
												className="text-slate-800 fill-none"
											/>
											<circle
												cx="64"
												cy="64"
												r="54"
												stroke="currentColor"
												strokeWidth="12"
												strokeDasharray={339.29}
												strokeDashoffset={
													339.29 - (339.29 * audit.totalScore) / 100
												}
												strokeLinecap="round"
												className={`fill-none transition-all duration-500 ${
													audit.totalScore >= 80
														? "text-emerald-400"
														: "text-amber-400"
												}`}
											/>
										</svg>
										<div className="absolute flex flex-col items-center">
											<span className="text-4xl font-black tracking-tight">
												{audit.totalScore}
											</span>
											<span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
												Points
											</span>
										</div>
									</div>
								</div>

								{/* Itemized Interactive Checklist */}
								<div className="space-y-3 pt-2 border-t border-slate-800/80 max-h-[380px] overflow-y-auto pr-1">
									{audit.checklist.map((item, idx) => (
										<div
											key={idx}
											className={`p-3.5 rounded-2xl text-xs font-bold border transition flex items-start gap-3 ${
												item.passed
													? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
													: "bg-slate-800/60 border-slate-700 text-slate-300"
											}`}
										>
											{item.passed ? (
												<CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
											) : (
												<AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
											)}
											<div className="flex-1 leading-snug">
												<span className="block font-black text-white mb-0.5">
													{item.metric}
												</span>
												<span className="text-[11px] text-slate-400 font-normal">
													{item.text}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Secure Failsafe Footer Note */}
							<div className="mt-7 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-bold leading-relaxed">
								⚡ Our interactive checklist verifies exact exact string
								matches, semantic heading hierarchies, and optimal saturation
								density instantly.
							</div>
						</div>

						{/* Quick Community Guidelines Panel */}
						<div className="card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
							<div className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
								<HelpCircle className="w-4 h-4" /> Community Publishing Rules
							</div>
							<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
								1. Ensure zero fluff or corporate spam. <br />
								2. Embed fully functional code formatting where appropriate.{" "}
								<br />
								3. Interlink to other published community cluster pieces to
								establish absolute topical dominance!
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
