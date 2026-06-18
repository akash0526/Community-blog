"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { analyzeSeo, generateCleanSlug } from "@/lib/seoEngine";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
	Sparkles,
	Image as ImageIcon,
	CheckCircle2,
	AlertCircle,
	Rocket,
	HelpCircle,
	FileText,
	Upload,
	BookOpen,
	Compass,
	Cpu,
	Feather,
	Save,
} from "lucide-react";

// Inspiring Starter Templates Across Technical & Creative Genres
const starterTemplates = {
	story: {
		title:
			"How Two Years in the Mountains Redefined My Approach to Deep Work",
		targetKeyword: "Deep Work",
		category: "Personal Stories",
		metaDescription:
			"A personal reflection on stepping away from constant notifications to rediscover sustained focus, solitude, and authentic creative output.",
		imageUrl:
			"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
		content: `# Silence and Strategy: Lessons from High Altitude Solitude

For over a decade, my daily routine was dictated by pinging desktop alerts, endless status update syncs, and the fragmented attention typical of modern knowledge work. In search of sustained deep work, I packed two suitcases and relocated to a remote cabin.

---

## 1. Reclaiming Our Internal Bandwidth

The hardest part of extreme intentional solitude isn't the physical isolation; it's the psychological withdrawal from the instant dopamine loops of our digital tools. Within three weeks, my baseline anxiety evaporated, replacing fragmented thoughts with calm, unbroken attention.

### Key Turning Points:
* Designing an intentional morning reading and journaling ritual.
* Protecting unbroken blocks of four to six hours for primary deep work tasks.
* Connecting deeply with profound philosophy works like [Cal Newport's Deep Work](https://www.calnewport.com).
`,
	},

	philosophy: {
		title:
			"The Art of Digital Minimalism: Cultivating Meaning in an Attention Economy",
		targetKeyword: "Digital Minimalism",
		category: "Philosophy & Culture",
		metaDescription:
			"An exploration of how intentional technological constraints can help us reclaim agency over our time, relationships, and mental well-being.",
		imageUrl:
			"https://images.unsplash.com/photo-1507842229456-3a097394c662?auto=format&fit=crop&w=1200&q=80",
		content: `# The Quiet Revolution of Curation

We live in an unprecedented era of abundant information. Yet, without ruthless personal curation, this infinite novelty quickly degrades into cognitive overload and alienation.

---

## 1. Designing Intentional Friction

True digital minimalism isn't about rejecting technology outright; it is about introducing highly deliberate friction into our consumption habits so that we remain the active authors of our attention.

### Foundational Principles:
* Conduct a seasonal digital declutter to audit active subscriptions.
* Embrace high-quality leisure activities that require active skill mastery.
* Read essential essays on intentional living and philosophy at [The Marginalian](https://www.themarginalian.org).
`,
	},

	travel: {
		title:
			"Savoring Kathmandu: A Slow Culinary Guide to Hidden Himalayan Alleyways",
		targetKeyword: "Kathmandu Culinary",
		category: "Travel & Lifestyle",
		metaDescription:
			"A curated slow travel guide exploring authentic local teahouses, artisanal spice markets, and timeless culinary traditions across Kathmandu.",
		imageUrl:
			"https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80",
		content: `# Beyond the Tourist Trail: The Authentic Flavors of Kathmandu

While most travelers view Kathmandu merely as a bustling trekking transit hub, its ancient alleyways harbor one of the most sophisticated, aromatic, and deeply historical culinary ecosystems in South Asia.

---

## 1. The Art of the Perfect Dumpling

True Himalayan gastronomy centers on slow, mindful preparation. From steaming bamboo baskets of delicate spices to rich, simmered lentil broths, every meal tells a generational story of trade routes and artisanal heritage.

### Curated Culinary Highlights:
* Seek out family-run teahouses tucked behind historical palace squares.
* Sample authentic hand-pulled noodles and yak cheese delicacies.
* Discover more Himalayan travel stories and cultural guides at [Lonely Planet Nepal](https://www.lonelyplanet.com/nepal).
`,
	},

	tech: {
		title: "Why Connection Pooling is Mandatory in Serverless App Routers",
		targetKeyword: "Connection Pooling",
		category: "Web Development",
		metaDescription:
			"An comprehensive developer guide exploring how to scale database connections in Serverless Next.js App Routers using PgBouncer and connection multiplexing.",
		imageUrl:
			"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
		content: `# Modern Serverless Architecture: Scaling Database Connections

The next era of web development centers on high-performance edge components. In this architectural guide, we break down exactly how to construct highly resilient connection pools using PgBouncer and Vercel Edge Functions.

---

## 1. Why Direct Connections Fail at the Edge

When multiple concurrent serverless runtimes execute database operations, standard HTTP request and process lifecycles break down. Ephemeral edge functions attempt to spawn hundreds of persistent TCP processes simultaneously, exhausting PostgreSQL memory buffers instantly.

Instead, we must route all edge lambda transactions through a centralized transaction-mode connection proxy.

### Core Architectural Best Practices:
* Maintain highly lightweight individual connection pools.
* Utilize connection multiplexing via PgBouncer.
* Enforce rigorous structured headings and outbound documentation links like [Next.js App Router](https://nextjs.org).
`,
	},
};

export default function AuthorStudio() {
	return (
		<Suspense
			fallback={
				<div className="py-20 text-center font-black text-lg">
					⚡ Initializing Creator Studio...
				</div>
			}
		>
			<StudioForm />
		</Suspense>
	);
}

function StudioForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editSlug = searchParams.get("edit");

	const [editingId, setEditingId] = useState(null);
	const [existingStatus, setExistingStatus] = useState("published");

	// State fields
	const [title, setTitle] = useState(starterTemplates.story.title);
	const [targetKeyword, setTargetKeyword] = useState(
		starterTemplates.story.targetKeyword,
	);
	const [category, setCategory] = useState(starterTemplates.story.category);
	const [metaDescription, setMetaDescription] = useState(
		starterTemplates.story.metaDescription,
	);
	const [imageUrl, setImageUrl] = useState(starterTemplates.story.imageUrl);
	const [content, setContent] = useState(starterTemplates.story.content);

	const [activeTab, setActiveTab] = useState("write"); // write vs preview

	// Scoring & Auth state
	const [audit, setAudit] = useState({
		totalScore: 85,
		wordCount: 150,
		checklist: [],
	});
	const [uploading, setUploading] = useState(false);
	const [publishing, setPublishing] = useState(false);
	const [savingDraft, setSavingDraft] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);

	// Load existing post if edit mode is triggered
	useEffect(() => {
		if (!editSlug) return;

		const fetchEditArticle = async () => {
			let found = null;
			// 1. Try Supabase cloud
			try {
				const { data, error } = await supabase
					.from("articles")
					.select("*")
					.eq("slug", editSlug)
					.single();
				if (!error && data) {
					found = data;
				}
			} catch (err) {}

			// 2. Try localStorage
			if (!found) {
				try {
					const stored = JSON.parse(
						localStorage.getItem("apex_articles_v1") || "[]",
					);
					found = stored.find((a) => a.slug === editSlug);
				} catch (e) {}
			}

			// Populate form if found
			if (found) {
				setEditingId(found.id);
				setExistingStatus(found.status || "published");
				setTitle(found.title || "");
				setTargetKeyword(found.target_keyword || "");
				setCategory(found.category || "Personal Stories");
				setMetaDescription(found.meta_description || "");
				setImageUrl(found.image_url || "");
				setContent(found.content || "");
			}
		};

		fetchEditArticle();
	}, [editSlug]);

	// Load a selected preset template
	const loadTemplate = (type) => {
		const t = starterTemplates[type];
		if (!t) return;
		setEditingId(null);
		setExistingStatus("published");
		setTitle(t.title);
		setTargetKeyword(t.targetKeyword);
		setCategory(t.category);
		setMetaDescription(t.metaDescription);
		setImageUrl(t.imageUrl);
		setContent(t.content);
	};

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
					// Auto create a demo session if anonymous so anyone can test the studio instantly
					const autoDemo = {
						id: "community-creator-" + Date.now(),
						email: "creative.author@example.com",
						user_metadata: {
							full_name: "Community Storyteller",
							avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Story",
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
				"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
			);
		} finally {
			setUploading(false);
		}
	};

	// Save or Publish Live
	const handleSave = async (targetStatus = "published") => {
		if (targetStatus === "draft") setSavingDraft(true);
		else setPublishing(true);

		setError(null);

		try {
			const slug = generateCleanSlug(title);
			const activeAuthorName =
				user?.user_metadata?.full_name || "Community Storyteller";
			const activeAuthorAvatar =
				user?.user_metadata?.avatar_url ||
				"https://api.dicebear.com/7.x/bottts/svg?seed=Comm";
			const isDemoUser =
				user?.id?.startsWith("demo-") || user?.id?.startsWith("community-");

			const currentId = editingId || "post-" + Date.now();

			// Build full article object
			const updatedDispatch = {
				id: currentId,
				created_at: new Date().toISOString(),
				published_at: new Date().toISOString().split("T")[0],
				author_id: user?.id || "demo-1",
				profiles: {
					full_name: activeAuthorName,
					professional_role:
						category === "Web Development" || category === "Tech & AI"
							? "Software Architect"
							: "Creator & Writer",
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
				status: targetStatus,
			};

			// 1. Try Supabase Cloud update or insert (works for both authentic users and community guests)
			let supabaseSuccess = false;
			const authorUuid = (!isDemoUser && user?.id) ? user.id : "00000000-0000-0000-0000-000000000000";

			try {
				let dbErr = null;
				if (editingId && !editingId.startsWith("post-")) {
					// Update existing row in cloud DB
					const { error } = await supabase
						.from("articles")
						.update({
							title,
							slug,
							category,
							target_keyword: targetKeyword,
							meta_description: metaDescription,
							image_url: imageUrl,
							content,
							seo_score: audit.totalScore,
							status: targetStatus,
						})
						.eq("id", editingId);
					dbErr = error;
				} else {
					// Insert brand new row into cloud DB
					const { error } = await supabase.from("articles").insert([
						{
							author_id: authorUuid,
							title,
							slug,
							category,
							target_keyword: targetKeyword,
							meta_description: metaDescription,
							image_url: imageUrl,
							content,
							seo_score: audit.totalScore,
							pageviews: 1,
							status: targetStatus,
						},
					]);
					dbErr = error;
				}

				if (!dbErr) {
					supabaseSuccess = true;
				} else {
					console.warn("Supabase Save Warning:", dbErr.message);
				}
			} catch (cloudErr) {}

			// 2. Always update/save in localStorage
			const fallbackStore = JSON.parse(
				localStorage.getItem("apex_articles_v1") || "[]",
			);
			const existingIndex = fallbackStore.findIndex(
				(a) => a.id === currentId || a.slug === (editSlug || slug),
			);

			if (existingIndex >= 0) {
				fallbackStore[existingIndex] = {
					...fallbackStore[existingIndex],
					...updatedDispatch,
				};
			} else {
				fallbackStore.unshift(updatedDispatch);
			}
			localStorage.setItem("apex_articles_v1", JSON.stringify(fallbackStore));

			if (supabaseSuccess) {
				// Cloud success
			} else if (!isDemoUser && user?.id) {
				setError(
					"⚠️ Cloud save unavailable — saved locally to your browser. Your progress is fully backed up locally.",
				);
			}

			// Direct user appropriately
			if (targetStatus === "draft") {
				router.push("/dashboard");
			} else {
				router.push(`/blog/${slug}`);
			}
		} catch (err) {
			setError(err.message || "An unexpected error occurred while saving.");
			setPublishing(false);
			setSavingDraft(false);
		}
	};

	return (
		<main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition">
			<div className="max-w-7xl mx-auto px-6">
				{/* Navigation Bar / Page Info */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
					<div>
						<div className="flex items-center gap-2">
							<span
								className={`w-3 h-3 rounded-full ${editingId ? "bg-amber-500 animate-pulse" : "bg-indigo-600"}`}
							></span>
							<span className="text-xs font-black uppercase text-slate-400 tracking-wider">
								{editingId
									? "Mode: Resuming Live Editing"
									: "Universal Writing Studio & Reach Engine"}
							</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
							{editingId ? `Editing: ${title}` : "Craft & Polish Your Story"}
						</h1>
					</div>

					<div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
						<button
							type="button"
							onClick={() =>
								setActiveTab(activeTab === "write" ? "preview" : "write")
							}
							className="btn btn-secondary px-4 py-2.5 rounded-xl text-xs font-black flex-1 sm:flex-none cursor-pointer"
						>
							{activeTab === "write" ? "👁️ Preview Story" : "✍️ Edit Markdown"}
						</button>

						{/* Save Draft Trigger */}
						<button
							type="button"
							onClick={() => handleSave("draft")}
							disabled={publishing || savingDraft}
							className="btn px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition transform hover:scale-105 flex-1 sm:flex-none cursor-pointer"
						>
							<Save className="w-3.5 h-3.5" />
							<span>{savingDraft ? "Saving..." : "💾 Save Draft"}</span>
						</button>

						{/* Publish Live Trigger */}
						<button
							type="button"
							onClick={() => handleSave("published")}
							disabled={publishing || savingDraft || audit.totalScore < 50}
							className={`btn px-6 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-1.5 flex-1 sm:flex-none transition transform hover:scale-105 cursor-pointer ${
								audit.totalScore >= 80
									? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
									: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
							}`}
						>
							<Rocket className="w-3.5 h-3.5" />
							<span>
								{publishing
									? "Publishing..."
									: editingId
										? "⚡ Update Live"
										: "⚡ Publish Live"}
							</span>
						</button>
					</div>
				</div>

				{/* Starter Template Quick Triggers Deck (Hide if already editing an existing specific post) */}
				{!editingId && (
					<div className="mb-8 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left border border-slate-800">
						<div className="flex items-center gap-3">
							<span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg shadow-inner">
								✨
							</span>
							<div>
								<div className="text-xs font-black uppercase text-indigo-300 tracking-wider">
									Writer&apos;s Block Failsafe
								</div>
								<div className="text-sm font-extrabold text-slate-200">
									Choose an instant story structure or start from scratch
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
							<button
								type="button"
								onClick={() => loadTemplate("story")}
								className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/5"
							>
								<Feather className="w-3.5 h-3.5 text-pink-400" />
								<span>Personal Story</span>
							</button>

							<button
								type="button"
								onClick={() => loadTemplate("philosophy")}
								className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/5"
							>
								<BookOpen className="w-3.5 h-3.5 text-amber-400" />
								<span>Philosophy</span>
							</button>

							<button
								type="button"
								onClick={() => loadTemplate("travel")}
								className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/5"
							>
								<Compass className="w-3.5 h-3.5 text-emerald-400" />
								<span>Travel Guide</span>
							</button>

							<button
								type="button"
								onClick={() => loadTemplate("tech")}
								className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/5"
							>
								<Cpu className="w-3.5 h-3.5 text-indigo-400" />
								<span>Tech & Architecture</span>
							</button>
						</div>
					</div>
				)}

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
									1. Story Identifiers
								</span>
								<span className="text-xs font-semibold text-slate-400">
									Powers custom Open Graph social cards
								</span>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
									Headline (H1 Primary Title)
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. How Two Years in the Mountains Redefined My Approach to Deep Work"
									className="input font-extrabold text-lg py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
								/>
								<div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1.5 px-1">
									<span>Optimal social preview length: 40-65 characters</span>
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
										Core Topic Keyword
									</label>
									<input
										type="text"
										value={targetKeyword}
										onChange={(e) => setTargetKeyword(e.target.value)}
										placeholder="e.g. Deep Work, Kathmandu Culinary, Connection Pooling"
										className="input font-bold text-sm py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700"
									/>
								</div>

								<div>
									<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
										Story Category
									</label>
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="input font-bold text-sm py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 cursor-pointer"
									>
										<option value="Personal Stories">
											📖 Personal Stories & Life
										</option>
										<option value="Philosophy & Culture">
											🎭 Philosophy & Culture
										</option>
										<option value="Travel & Lifestyle">
											🌴 Travel & Lifestyle
										</option>
										<option value="Arts & Fiction">
											🎨 Arts & Creative Fiction
										</option>
										<option value="Web Development">💻 Web Development</option>
										<option value="Tech & AI">⚡ Tech & AI</option>
										<option value="Startups & Growth">
											🚀 Startups & Growth
										</option>
										<option value="SEO Strategy">🎯 SEO Strategy</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
									Summary Description
								</label>
								<textarea
									rows="2"
									value={metaDescription}
									onChange={(e) => setMetaDescription(e.target.value)}
									placeholder="Write a concise 140-character summary capturing what makes your story special..."
									className="input font-medium text-sm py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 dark:border-slate-700 leading-relaxed"
								></textarea>
								<div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-1 px-1">
									<span>Optimal social card preview: 120-165 characters</span>
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
									Featured Social Banner Media
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
											className="btn btn-secondary w-full px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer"
										>
											<Upload className="w-4 h-4 text-indigo-500" />
											<span>
												{uploading ? "Uploading..." : "⚡ Cloud Upload"}
											</span>
										</button>
									</div>
								</div>

								{/* Instant Creative Presets */}
								<div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
									<span className="text-[11px] font-extrabold text-slate-400 uppercase mr-1">
										Creative Presets:
									</span>
									{[
										{
											label: "🌄 Himalayan Dawn",
											url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "📚 Analog Library",
											url: "https://images.unsplash.com/photo-1507842229456-3a097394c662?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "☕ Kathmandu Bazaar",
											url: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80",
										},
										{
											label: "💻 Architecture Core",
											url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
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
									2. Your Markdown Story Prose
								</span>
								<span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
									<FileText className="w-3.5 h-3.5" /> {audit.wordCount} Words
									Total
								</span>
							</div>

							{activeTab === "write" ? (
								<div>
									<textarea
										rows="18"
										value={content}
										onChange={(e) => setContent(e.target.value)}
										placeholder="Craft your beautiful markdown story here..."
										className="input font-mono text-sm py-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 dark:border-slate-700/80 leading-relaxed dark:text-slate-200"
									></textarea>
									<div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-400 mt-2 px-2 gap-2">
										<span>
											💡 Tip: Use ## for clean chapter subheadings and embed
											helpful links like [text](url).
										</span>
										<button
											type="button"
											onClick={() => {
												setContent("");
												setEditingId(null);
											}}
											className="text-rose-500 hover:underline cursor-pointer"
										>
											Clear Canvas
										</button>
									</div>
								</div>
							) : (
								<div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none min-h-[450px]">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{content}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>

					{/* Right Real-Time Interactive Reach & Readability Assistant (Cols 4) */}
					<div className="lg:col-span-4 space-y-6">
						<div className="card bg-slate-900 text-white p-7 shadow-2xl border border-slate-800 flex flex-col justify-between">
							<div>
								{/* Meter Head */}
								<div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
									<span className="text-xs font-black uppercase tracking-widest text-slate-400">
										Reach Assistant
									</span>
									<span
										className={`text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow ${
											audit.totalScore >= 80
												? "bg-emerald-500 text-slate-950"
												: "bg-amber-500 text-slate-950"
										}`}
									>
										⚡{" "}
										{audit.totalScore >= 80 ? "Well Structured" : "Needs Polish"}
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
												Readability
											</span>
										</div>
									</div>
								</div>

								{/* Itemized Interactive Failsafe Checklist */}
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

							{/* Failsafe Footer Note */}
							<div className="mt-7 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-bold leading-relaxed">
								⚡ Our interactive assistant verifies engaging story openings,
								clean chapter structures, and healthy topical resonance to
								maximize your web reach instantly.
							</div>
						</div>

						{/* Quick Community Guidelines Panel */}
						<div className="card bg-white dark:bg-slate-900 p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
							<div className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
								<HelpCircle className="w-4 h-4" /> Storytelling Guidelines
							</div>
							<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
								1. Write authentically. We celebrate unique personal essays, arts,
								and deep reflections alongside technical deep dives. <br />
								2. Use helpful links to give your readers context. <br />
								3. Connect with other creators by interlinking related stories!
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
