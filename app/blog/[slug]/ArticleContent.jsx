"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowLeft,
	ArrowUp,
	ArrowUpRight,
	Bookmark,
	Clock,
	Share2,
	ShieldCheck,
	Tag,
} from "lucide-react";
import DiscussionThread from "@/components/DiscussionThread";
import ArticleBody from "@/components/ArticleBody";
import { sanitizeCmsField, detectLanguage, cleanExcerpt, cleanBio } from "@/lib/seoUtils";
import { extractHeadings, readingTimeMinutes, wordCount } from "@/lib/markdownHeadings";

function cleanTitle(title = "") {
	return sanitizeCmsField(String(title).replace(/\s*Slug:.*$/i, "").trim());
}

function getAvatar(profile) {
	const raw = profile?.avatar_url || "";
	if (!raw || raw.includes("dicebear") || raw.includes("bottts")) {
		const name = encodeURIComponent(profile?.full_name || "Apex Editorial");
		return `https://ui-avatars.com/api/?name=${name}&background=7C3AED&color=fff&size=128`;
	}
	return raw;
}

function formatDate(d) {
	if (!d) return "";
	try {
		return new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
	} catch {
		return d;
	}
}

const FONT_SIZES = [
	{ id: "s", label: "Small text", value: "1rem", glyph: "A" },
	{ id: "m", label: "Comfortable text", value: "1.125rem", glyph: "A" },
	{ id: "l", label: "Large text", value: "1.25rem", glyph: "A" },
];

/** Reader text-size switch (Aa) — scales the whole .article-prose system. */
function FontSizeControl({ value, onChange, vertical = false }) {
	return (
		<div
			className={`inline-flex items-center gap-1 rounded-full border border-(--hairline) bg-(--surface) p-1 ${vertical ? "flex-col rounded-2xl" : ""}`}
			role="group"
			aria-label="Article text size"
		>
			{FONT_SIZES.map((size, i) => (
				<button
					key={size.id}
					type="button"
					onClick={() => onChange(size.id)}
					aria-label={size.label}
					aria-pressed={value === size.id}
					className={`grid h-8 w-8 place-items-center rounded-full font-bold transition ${
						value === size.id
							? "bg-(--clay) text-white shadow"
							: "text-(--ink-muted) hover:text-(--ink)"
					}`}
					style={{ fontSize: `${11 + i * 3}px` }}
				>
					{size.glyph}
				</button>
			))}
		</div>
	);
}

/** "On this page" — sticky table of contents with scroll-spy. */
function TableOfContents({ headings, activeId }) {
	if (headings.length < 2) return null;
	return (
		<nav aria-label="On this page" className="text-sm">
			<p className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-[0.14em] text-(--ink-faint) uppercase">
				<span className="h-1.5 w-1.5 rounded-full bg-(--saffron)" aria-hidden="true" />
				On this page
			</p>
			<ul className="space-y-0.5 border-l border-(--hairline)">
				{headings.map((heading) => {
					const active = heading.id === activeId;
					return (
						<li key={heading.id}>
							<a
								href={`#${heading.id}`}
								aria-current={active ? "location" : undefined}
								className={`-ml-px block border-l-2 py-1.5 leading-snug transition ${
									heading.level === 3 ? "pl-6 text-[13px]" : "pl-4 font-semibold"
								} ${
									active
										? "border-(--clay) text-(--clay)"
										: "border-transparent text-(--ink-muted) hover:border-(--clay) hover:text-(--ink)"
								}`}
							>
								{heading.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

function RelatedCard({ item }) {
	const title = cleanTitle(item.title || "");
	const authorName = item.profiles?.full_name || "Apex Editorial";
	return (
		<Link
			href={`/blog/${item.slug}`}
			className="card card-hover group block overflow-hidden rounded-(--radius) border border-(--hairline) bg-(--surface)"
		>
			<div className="relative aspect-[16/10] overflow-hidden bg-(--sunken)">
				{item.image_url ? (
					<Image
						src={item.image_url}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 340px"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="gradient-bg flex h-full items-center justify-center p-6">
						<span className="font-article text-center text-lg text-white/90 italic">{title}</span>
					</div>
				)}
				<span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
					{item.category || "Stories"}
				</span>
			</div>
			<div className="p-5">
				<h3 className="article-card__title line-clamp-2 font-semibold text-(--ink) transition group-hover:text-(--clay)">
					{title}
				</h3>
				<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-(--ink-muted)">
					{cleanExcerpt(item.meta_description)}
				</p>
				<div className="mt-4 flex items-center justify-between border-t border-(--hairline) pt-3 text-xs text-(--ink-faint)">
					<span className="truncate font-semibold">{authorName}</span>
					<span className="flex shrink-0 items-center gap-1">
						{formatDate(item.published_at || item.created_at)}
						<ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</span>
				</div>
			</div>
		</Link>
	);
}

export default function ArticleContent({ serverArticle, slug, relatedArticles = [] }) {
	const [article, setArticle] = useState(serverArticle);
	const [loading, setLoading] = useState(!serverArticle);
	const [bookmarked, setBookmarked] = useState(false);
	const [shareToast, setShareToast] = useState(false);
	const [activeHeading, setActiveHeading] = useState("");
	const [fontSize, setFontSize] = useState("m");

	// Browser-storage reads (local drafts, bookmark state) run deferred, after
	// hydration: synchronous setState here would cascade renders, and reading
	// localStorage during render would mismatch the server HTML.
	useEffect(() => {
		const t = setTimeout(() => {
			if (!serverArticle) {
				try {
					const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
					const found = stored.find((a) => decodeURIComponent(a.slug || "") === decodeURIComponent(slug));
					if (found) setArticle(found);
				} catch {}
			}
			try {
				const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
				setBookmarked(bms.some((b) => decodeURIComponent(b.slug || "") === decodeURIComponent(slug)));
				const savedSize = localStorage.getItem("apex_article_font_size");
				if (FONT_SIZES.some((s) => s.id === savedSize)) setFontSize(savedSize);
			} catch {}
			setLoading(false);
		}, 0);
		return () => clearTimeout(t);
	}, [serverArticle, slug]);

	const content = article?.content || "";
	const headings = useMemo(() => extractHeadings(content), [content]);

	// Scroll-spy: highlight the section the reader is currently in.
	useEffect(() => {
		if (headings.length < 2) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveHeading(entry.target.id);
				}
			},
			{ rootMargin: "-15% 0px -70% 0px" },
		);
		for (const heading of headings) {
			const el = document.getElementById(heading.id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, [headings, loading]);

	const changeFontSize = (id) => {
		setFontSize(id);
		try {
			localStorage.setItem("apex_article_font_size", id);
		} catch {}
	};

	const handleBookmark = () => {
		try {
			const bms = JSON.parse(localStorage.getItem("apex_bookmarks_v1") || "[]");
			const idx = bms.findIndex((b) => decodeURIComponent(b.slug || "") === decodeURIComponent(slug));
			if (idx >= 0) {
				bms.splice(idx, 1);
				setBookmarked(false);
			} else if (article) {
				// Store a slim card (not the whole article body) — full content
				// blobs would exhaust the ~5MB localStorage quota after a few saves.
				bms.unshift({
					id: article.id,
					slug: article.slug,
					title: cleanTitle(article.title),
					meta_description: article.meta_description,
					category: article.category,
					image_url: article.image_url,
					published_at: article.published_at || article.created_at,
					profiles: { full_name: article.profiles?.full_name || "Apex Editorial" },
				});
				setBookmarked(true);
			}
			localStorage.setItem("apex_bookmarks_v1", JSON.stringify(bms));
		} catch {}
	};

	const handleShare = async () => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		try {
			if (navigator.share) {
				await navigator.share({ title: cleanTitle(article?.title), url });
			} else {
				await navigator.clipboard.writeText(url);
				setShareToast(true);
				setTimeout(() => setShareToast(false), 2000);
			}
		} catch {}
	};

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-3xl px-6 py-24">
				<div className="animate-pulse space-y-5">
					<div className="mx-auto h-6 w-32 rounded-full bg-(--sunken)" />
					<div className="mx-auto h-12 w-4/5 rounded-xl bg-(--sunken)" />
					<div className="mx-auto h-12 w-3/5 rounded-xl bg-(--sunken)" />
					<div className="h-72 rounded-[28px] bg-(--sunken)" />
					<div className="space-y-3 pt-4">
						<div className="h-4 rounded bg-(--sunken)" />
						<div className="h-4 rounded bg-(--sunken)" />
						<div className="h-4 w-2/3 rounded bg-(--sunken)" />
					</div>
				</div>
			</div>
		);
	}
	if (!article) {
		return (
			<div className="mx-auto max-w-2xl px-6 py-24 text-center">
				<h1 className="font-article mb-3 font-semibold" style={{ fontSize: "1.875rem", lineHeight: 1.2 }}>Article not found</h1>
				<p className="mb-8 text-(--ink-muted)">This story may have been moved or removed.</p>
				<Link href="/" className="btn btn--primary">
					← Back home
				</Link>
			</div>
		);
	}

	const title = cleanTitle(article.title);
	const description = cleanExcerpt(article.meta_description);
	const words = wordCount(content);
	const readMinutes = readingTimeMinutes(content);
	const contentLang = detectLanguage(`${article.title || ""} ${content}`);
	const author = article.profiles || {};
	const authorName = author.full_name || "Apex Editorial";
	const authorRole = author.professional_role || "Contributing Writer";
	const authorBio = cleanBio(author.bio || "");
	const authorAvatar = getAvatar(author);
	const authorPath = `/authors/${encodeURIComponent(authorName.toLowerCase().replace(/\s+/g, "-"))}`;
	const published = formatDate(article.published_at || article.created_at);
	const updated =
		article.updated_at && article.updated_at !== article.created_at ? formatDate(article.updated_at) : null;
	const category = article.category || "Stories";
	const keyword = article.target_keyword || "";
	const isFinance = ["Business & Finance", "Finance", "Money"].includes(category);
	const isHealth = (category || "").toLowerCase().includes("health");
	const isLegal = (category || "").toLowerCase().includes("legal");
	const activeFont = FONT_SIZES.find((s) => s.id === fontSize) || FONT_SIZES[1];

	const shareButton = (
		<button
			type="button"
			onClick={handleShare}
			className="relative grid h-10 w-10 place-items-center rounded-full border border-(--hairline) bg-(--surface) text-(--ink-muted) transition hover:border-(--clay) hover:text-(--clay)"
			aria-label="Share this article"
		>
			<Share2 className="h-4 w-4" />
			{shareToast && (
				<span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-(--ink) px-2 py-1 text-[10px] font-bold whitespace-nowrap text-(--paper)">
					Link copied
				</span>
			)}
		</button>
	);
	const bookmarkButton = (
		<button
			type="button"
			onClick={handleBookmark}
			className={`grid h-10 w-10 place-items-center rounded-full border transition ${
				bookmarked
					? "border-(--clay) bg-(--clay) text-white"
					: "border-(--hairline) bg-(--surface) text-(--ink-muted) hover:border-(--clay) hover:text-(--clay)"
			}`}
			aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
			aria-pressed={bookmarked}
		>
			<Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
		</button>
	);

	return (
		<div className="flex-1">
			<article
				lang={contentLang}
				className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-4 sm:px-8 sm:pt-12"
				style={{ "--article-font-size": activeFont.value }}
			>
				{/* Breadcrumbs */}
				<div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-3">
					<nav className="flex flex-wrap items-center gap-2 text-xs text-(--ink-faint)" aria-label="Breadcrumb">
						<Link href="/" className="transition hover:text-(--clay)">Home</Link>
						<span aria-hidden="true">/</span>
						<Link href={`/blog?category=${encodeURIComponent(category)}`} className="transition hover:text-(--clay)">
							{category}
						</Link>
						<span aria-hidden="true">/</span>
						<span className="max-w-[220px] truncate text-(--ink-muted)">{title}</span>
					</nav>
					<Link
						href="/blog"
						className="inline-flex items-center gap-1.5 text-xs font-bold text-(--ink-muted) transition hover:text-(--clay)"
					>
						<ArrowLeft className="h-3.5 w-3.5" /> All stories
					</Link>
				</div>

				{/* ── Header: centred editorial masthead ─────────────────── */}
				<header className="mx-auto mt-10 max-w-[820px] text-center sm:mt-14">
					<Link
						href={`/blog?category=${encodeURIComponent(category)}`}
						className="inline-flex items-center gap-2 rounded-full border border-(--hairline) bg-(--clay-tint) px-3.5 py-1.5 text-[11px] font-black tracking-[0.13em] text-(--clay) uppercase transition hover:border-(--clay)"
					>
						<span className="h-1.5 w-1.5 rounded-full bg-(--saffron)" aria-hidden="true" />
						{category}
					</Link>

					<h1 className="article-title mt-6 font-semibold text-(--ink)">
						{title}
					</h1>

					{description && description !== title && (
						<p className="mx-auto mt-6 max-w-[62ch] text-[1.08rem] leading-relaxed text-pretty text-(--ink-muted) sm:text-[1.22rem] sm:leading-[1.6]">
							{description}
						</p>
					)}

					{/* Byline */}
					<div className="mt-9 flex flex-col items-center justify-center gap-4 border-y border-(--hairline) py-5 sm:flex-row sm:flex-wrap sm:gap-x-6">
						<Link href={authorPath} className="group flex items-center gap-3 text-left">
							<Image
								src={authorAvatar}
								alt={authorName}
								width={44}
								height={44}
								className="rounded-full object-cover ring-2 ring-(--clay-tint) transition group-hover:ring-(--clay)"
							/>
							<span>
								<span className="flex items-center gap-1.5 text-sm font-black text-(--ink) transition group-hover:text-(--clay)">
									{authorName}
									<ShieldCheck className="h-3.5 w-3.5 text-(--clay)" aria-label="Verified author" />
								</span>
								<span className="block text-xs font-semibold text-(--ink-faint)">{authorRole}</span>
							</span>
						</Link>

						<span className="hidden h-8 w-px bg-(--hairline) sm:block" aria-hidden="true" />

						<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[13px] font-medium text-(--ink-muted)">
							<time dateTime={article.published_at || article.created_at}>{published}</time>
							{updated && <span>Updated {updated}</span>}
							<span className="inline-flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5 text-(--clay)" />
								{readMinutes} min read
							</span>
							<span>{words.toLocaleString()} words</span>
						</div>

						<span className="hidden h-8 w-px bg-(--hairline) sm:block" aria-hidden="true" />

						<div className="flex items-center gap-2">
							<FontSizeControl value={fontSize} onChange={changeFontSize} />
							{bookmarkButton}
							{shareButton}
						</div>
					</div>
				</header>

				{/* ── Hero image ─────────────────────────────────────────── */}
				{article.image_url && (
					<figure className="mx-auto mt-10 max-w-[960px] sm:mt-12">
						<div className="relative aspect-[16/9] max-h-[540px] w-full overflow-hidden rounded-[24px] border border-(--hairline) shadow-(--shadow) sm:rounded-[28px]">
							<Image
								src={article.image_url}
								alt={title}
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 960px"
								quality={88}
								priority
							/>
							<div
								className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
								aria-hidden="true"
							/>
						</div>
						<figcaption className="mt-3 text-center text-xs text-(--ink-faint)">
							{title} — published on Apex by {authorName}
						</figcaption>
					</figure>
				)}

				{/* YMYL disclaimer */}
				{(isFinance || isHealth || isLegal) && (
					<div className="mx-auto mt-10 max-w-[720px] rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
						<strong>Disclaimer:</strong>{" "}
						{isFinance && "This is not financial advice. Rates and fees change frequently – verify in the provider app before transferring. See our "}
						{isHealth && "This is educational content only, not medical advice. Consult a qualified professional. See our "}
						{isLegal && "General information only, not legal advice. Confirm with official government sources. See our "}
						<Link href="/disclaimer" className="font-bold underline">full disclaimer</Link>.
					</div>
				)}

				{/* ── Body: sticky contents rail + reading column ────────── */}
				<div className="mx-auto mt-12 grid max-w-[1060px] justify-center gap-10 sm:mt-16 lg:grid-cols-[228px_minmax(0,700px)] lg:gap-14">
					<aside className="hidden lg:block">
						<div className="sticky top-28 space-y-8">
							<TableOfContents headings={headings} activeId={activeHeading} />
							{headings.length >= 2 && (
								<div className="space-y-3 border-t border-(--hairline) pt-6">
									<p className="text-[11px] font-black tracking-[0.14em] text-(--ink-faint) uppercase">
										Enjoying this?
									</p>
									<div className="flex items-center gap-2">
										{shareButton}
										{bookmarkButton}
										<button
											type="button"
											onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
											className="grid h-10 w-10 place-items-center rounded-full border border-(--hairline) bg-(--surface) text-(--ink-muted) transition hover:border-(--clay) hover:text-(--clay)"
											aria-label="Back to top"
										>
											<ArrowUp className="h-4 w-4" />
										</button>
									</div>
									<p className="text-xs leading-relaxed text-(--ink-faint)">
										Share it with someone it could help, or save it for later.
									</p>
								</div>
							)}
						</div>
					</aside>

					<div className="min-w-0">
						{/* Mobile / tablet contents */}
						{headings.length >= 2 && (
							<details className="group mb-10 rounded-2xl border border-(--hairline) bg-(--surface) px-5 py-4 lg:hidden">
								<summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-(--ink) [&::-webkit-details-marker]:hidden">
									<span>
										In this article{" "}
										<span className="ml-1 font-semibold text-(--ink-faint)">
											{headings.length} sections · {readMinutes} min
										</span>
									</span>
									<span className="text-(--clay) transition group-open:rotate-45" aria-hidden="true">+</span>
								</summary>
								<ul className="mt-3 space-y-1 border-t border-(--hairline) pt-3">
									{headings.map((heading) => (
										<li key={heading.id}>
											<a
												href={`#${heading.id}`}
												className={`block py-1 text-sm text-(--ink-muted) transition hover:text-(--clay) ${heading.level === 3 ? "pl-4 text-[13px]" : "font-semibold"}`}
											>
												{heading.text}
											</a>
										</li>
									))}
								</ul>
							</details>
						)}

						<ArticleBody content={content} />

						{/* End mark + tags */}
						<div className="mt-14 flex flex-wrap items-center gap-2" aria-label="Article tags">
							<Tag className="h-4 w-4 text-(--ink-faint)" aria-hidden="true" />
							<Link
								href={`/blog?category=${encodeURIComponent(category)}`}
								className="rounded-full border border-(--hairline) bg-(--surface) px-3.5 py-1.5 text-xs font-bold text-(--ink-muted) transition hover:border-(--clay) hover:text-(--clay)"
							>
								{category}
							</Link>
							{keyword && keyword.toLowerCase() !== category.toLowerCase() && (
								<Link
									href={`/blog?q=${encodeURIComponent(keyword)}`}
									className="rounded-full border border-(--hairline) bg-(--surface) px-3.5 py-1.5 text-xs font-bold text-(--ink-muted) transition hover:border-(--clay) hover:text-(--clay)"
								>
									{keyword}
								</Link>
							)}
							<span className="ml-auto font-article text-lg text-(--clay) italic" aria-hidden="true">
								— End —
							</span>
						</div>

						{/* Share band */}
						<div className="gradient-bg mt-10 flex flex-col items-center gap-4 rounded-[24px] border border-(--hairline) px-6 py-8 text-center">
							<p className="font-article max-w-[38ch] text-xl leading-snug font-semibold text-balance text-white">
								Found this useful? Pass it on — someone you know needs it too.
							</p>
							<div className="flex flex-wrap items-center justify-center gap-3">
								<button type="button" onClick={handleShare} className="btn btn--primary !px-5 !py-2.5 text-sm">
									<Share2 className="h-4 w-4" /> Share article
								</button>
								<button
									type="button"
									onClick={handleBookmark}
									className="btn btn--ghost !border-white/25 !px-5 !py-2.5 text-sm !text-white hover:!border-white hover:!text-white"
								>
									<Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
									{bookmarked ? "Saved to reading list" : "Save for later"}
								</button>
							</div>
							{shareToast && <p className="text-xs font-bold text-white/85">Link copied to clipboard ✓</p>}
						</div>

						{/* Methodology / sources box – E-E-A-T */}
						<div className="mt-10 rounded-[24px] border border-(--hairline) bg-(--surface) p-6 sm:p-7">
							<div className="mb-3 flex items-center gap-2 font-black text-(--ink)">
								<ShieldCheck className="h-4.5 w-4.5 text-(--clay)" /> How we verified this
							</div>
							<ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-(--ink-muted)">
								<li>Written by {authorName} — {authorRole}</li>
								<li>Published {published}{updated ? ` · Last updated ${updated}` : ""}</li>
								<li>Sources cited inline with live links</li>
								<li>
									Corrections policy:{" "}
									<Link href="/editorial" className="font-semibold text-(--clay) underline">see Editorial Policy</Link>
								</li>
								<li>
									Found an error?{" "}
									<a href="mailto:editor@apex-nepal.com" className="font-semibold text-(--clay) underline">
										editor@apex-nepal.com
									</a>{" "}
									· <Link href="/corrections" className="underline">Report a correction</Link>
								</li>
							</ul>
						</div>

						{/* Author footer card */}
						<div className="mt-8 rounded-[24px] border border-(--hairline) bg-(--clay-tint) p-6 sm:p-7">
							<div className="flex flex-wrap items-center gap-4">
								<Image
									src={authorAvatar}
									width={56}
									height={56}
									className="rounded-full object-cover ring-2 ring-(--clay)"
									alt={authorName}
								/>
								<div className="min-w-0">
									<div className="text-[11px] font-black tracking-[0.13em] text-(--clay) uppercase">
										Written by
									</div>
									<div className="font-article text-lg font-semibold text-(--ink)">{authorName}</div>
									<div className="text-xs font-semibold text-(--ink-muted)">{authorRole}</div>
								</div>
								<Link href={authorPath} className="btn btn--ghost ml-auto !px-4 !py-2 text-xs">
									View profile <ArrowUpRight className="h-3.5 w-3.5" />
								</Link>
							</div>
							{authorBio && (
								<p className="mt-4 text-sm leading-relaxed text-(--ink-muted)">{authorBio}</p>
							)}
							{(author.website || author.twitter || author.linkedin) && (
								<div className="mt-4 flex gap-4 text-xs font-bold">
									{author.website && (
										<a href={author.website} target="_blank" rel="noopener" className="text-(--clay) underline">Website</a>
									)}
									{author.twitter && (
										<a href={author.twitter} target="_blank" rel="noopener" className="text-(--clay) underline">X</a>
									)}
									{author.linkedin && (
										<a href={author.linkedin} target="_blank" rel="noopener" className="text-(--clay) underline">LinkedIn</a>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* ── Keep reading ───────────────────────────────────────── */}
				{relatedArticles.length > 0 && (
					<section className="mx-auto mt-20 max-w-[1060px]" aria-labelledby="keep-reading">
						<div className="mb-7 flex flex-wrap items-end justify-between gap-3">
							<div>
								<p className="eyebrow">
									<span className="num">→</span> Keep reading
								</p>
								<h2 id="keep-reading" className="article-section-title font-semibold text-(--ink)">
									More stories like this
								</h2>
							</div>
							<Link href="/blog" className="link link--arrow text-sm font-bold">
								Browse all stories <ArrowUpRight className="h-4 w-4" />
							</Link>
						</div>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{relatedArticles.slice(0, 3).map((item) => (
								<RelatedCard key={item.id || item.slug} item={item} />
							))}
						</div>
					</section>
				)}

				{/* Comments */}
				<div className="mx-auto mt-16 max-w-[760px]">
					<DiscussionThread articleSlug={decodeURIComponent(slug)} />
				</div>

				{/* CTA */}
				<div className="gradient-bg mx-auto mt-16 max-w-[760px] rounded-[24px] border border-(--hairline) px-6 py-10 text-center">
					<h3 className="font-article text-2xl font-semibold text-white">Want to publish on Apex?</h3>
					<p className="mt-2 text-sm text-white/75">Real authors. Tested stories. Global audience.</p>
					<Link
						href="/studio"
						className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-white/90"
					>
						Write your story →
					</Link>
				</div>
			</article>
		</div>
	);
}
