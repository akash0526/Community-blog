import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
	getPaginatedArticles,
	getPublishedArticleCount,
} from "@/lib/articles";
import { fallbackArticles } from "@/lib/seedData";
import CommunityFeed from "@/components/CommunityFeed";
import NewsletterForm from "@/components/NewsletterForm";
import Hero from "@/components/Hero";
import { BlogCard } from "@/components/BlogCard";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CTASection } from "@/components/sections/CTASection";
import {
	monthlyPicks,
	resourceCategories,
	countResources,
	countByCategory,
} from "@/lib/resources";
import { cleanExcerpt } from "@/lib/seoUtils";
import {
	IconBook,
	IconBriefcase,
	IconCard,
	IconGlobe,
	IconSparkle,
	IconStore,
} from "@/components/Icon";

export const revalidate = 60;

export const metadata = {
	alternates: { canonical: "/" },
};

const PAGE_SIZE = 12;

// The three picks with photography in public/redesign/ become media cards;
// the rest stay text cards in the same grid.
const PICK_PHOTOS: Record<string, { src: string; alt: string }> = {
	DeepSeek: {
		src: "/redesign/deepseek.jpg",
		alt: "A hand on a mechanical keyboard beside a notebook of merge-sort diagrams",
	},
	Harper: {
		src: "/redesign/harper.jpg",
		alt: "A manuscript open on a laptop screen with tracked changes and reading glasses",
	},
	Photopea: {
		src: "/redesign/photopea.jpg",
		alt: "A vector logo edit open on a laptop beside fanned Pantone swatches",
	},
};

const RESOURCE_COUNT = countResources();
const CATEGORY_COUNTS = countByCategory();

const TICKER_ITEMS = resourceCategories.map((category) => category.title);

// Six tiles, one per directory category, with counts from lib/resources.js.
const CATEGORY_TILES = [
	{
		icon: IconCard,
		title: "Getting paid",
		copy: "Payment gateways, remittance routes and payout options that actually clear for Nepali freelancers.",
		count: CATEGORY_COUNTS.payments,
		href: "/digital-payments",
	},
	{
		icon: IconSparkle,
		title: "AI tools",
		copy: "Free and paid assistants that work on NTC and Ncell — no VPN required.",
		count: CATEGORY_COUNTS["ai-tools"],
		href: "/ai-tools",
	},
	{
		icon: IconBriefcase,
		title: "Freelancing",
		copy: "CVs, portfolios, remote boards and time-zone tools for your first client.",
		count: CATEGORY_COUNTS.freelancing,
		href: "/freelancing-in-nepal",
	},
	{
		icon: IconGlobe,
		title: "Hosting",
		copy: "Domains, CDN and static hosts that stay fast on Nepali broadband.",
		count: CATEGORY_COUNTS.hosting,
		href: "/blogging-hosting",
	},
	{
		icon: IconStore,
		title: "Small business",
		copy: "Free design, billing and backup tools for a pasal or Facebook shop.",
		count: CATEGORY_COUNTS.business,
		href: "/small-business-tools",
	},
	{
		icon: IconBook,
		title: "Students",
		copy: "Free courses, textbooks and exam prep. NPR 0 to start learning.",
		count: CATEGORY_COUNTS.students,
		href: "/resources#students",
	},
];

/** Minimal article row shape shared by the Supabase list query and the
 *  seed fallback (the fields the card UIs read). */
interface ArticleRow {
	id?: string | null;
	slug: string;
	title: string;
	meta_description?: string;
	category?: string;
	image_url?: string | null;
	published_at?: string | null;
	created_at?: string | null;
	content?: string;
	profiles?: { full_name?: string; avatar_url?: string } | null;
}

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

/** Reading time from the body when the query includes it (seed data);
 *  the slim Supabase list query does not fetch content. */
function readTimeFor(art: { content?: string }) {
	if (!art?.content) return undefined;
	const minutes = Math.max(2, Math.round(art.content.split(/\s+/).length / 200));
	return `${minutes} min`;
}

export default async function Homepage() {
	// Without Supabase credentials (local demo / CI) the queries fail
	// closed with an empty list — fall back to the seeded articles so the
	// homepage still renders real-looking content.
	const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

	let articles: ArticleRow[];
	let totalCount: number;
	if (hasSupabase) {
		// Two independent queries — run them concurrently.
		const [rows, count] = await Promise.all([
			getPaginatedArticles(PAGE_SIZE, 0),
			getPublishedArticleCount(),
		]);
		articles = rows as unknown as ArticleRow[];
		totalCount = count;
	} else {
		// No credentials: never touch the (placeholder) Supabase client —
		// an unreachable project would add a multi-second timeout.
		articles = fallbackArticles as unknown as ArticleRow[];
		totalCount = fallbackArticles.length;
	}

	const featured = articles.slice(0, 3);
	const rest = articles.slice(3);
	const hasMore = totalCount > PAGE_SIZE;
	const showFeed = rest.length > 0 || hasMore;

	return (
		<div className="flex-1">
			<Hero
				resources={RESOURCE_COUNT}
				guides={Math.max(totalCount, 1)}
				categories={resourceCategories.length}
			/>

			<div className="ticker" aria-hidden="true">
				<div className="ticker__track">
					{[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
						<span className="ticker__item" key={`${item}-${i}`}>
							{item}
						</span>
					))}
				</div>
			</div>

			{/* ═══ Explore ═══ */}
			<section className="section" id="explore">
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow">Explore</p>
							<h2>Start where you are.</h2>
							<p className="lede">
								Six working categories, each one checked on Nepali internet
								with Nepali payment methods — not copied from a global list.
							</p>
						</div>
						<Link href="/resources" className="link link--arrow reveal">
							All resources
							<ArrowRight size={15} aria-hidden="true" />
						</Link>
					</div>

					<div className="bento">
						{CATEGORY_TILES.map((tile) => {
							const Icon = tile.icon;
							return (
								<Link
									key={tile.title}
									href={tile.href}
									className="tile"
								>
									<div>
										<span className="tile__icon">
											<Icon className="icon icon--17" />
										</span>
										<h3>{tile.title}</h3>
										<p>{tile.copy}</p>
									</div>
									<div className="tile__count">
										{tile.count} entries
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══ Featured stories ═══ */}
			<section className="section pt-0">
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow">Latest</p>
							<h2>Fresh from the community.</h2>
						</div>
						<Link
							href={featured.length ? "/blog" : "/resources"}
							className="link link--arrow"
						>
							{featured.length ? "See all stories" : "See all resources"}
							<ArrowRight size={15} aria-hidden="true" />
						</Link>
					</div>

					{featured.length > 0 ? (
						<div className="cards !mt-0">
							{featured.map((art) => (
								<BlogCard
									key={art.id || art.slug}
									title={cleanTitle(art.title)}
									excerpt={cleanExcerpt(art.meta_description)}
									image={art.image_url || "/opengraph-image"}
									author={{
										name: art.profiles?.full_name || "Apex Editorial",
										avatar:
											art.profiles?.avatar_url ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												art.profiles?.full_name || "Apex",
											)}&background=5440d6&color=fff&size=64`,
									}}
									date={
										formatDate(art.published_at || art.created_at) || "Recently"
									}
									readTime={readTimeFor(art)}
									slug={art.slug}
									category={art.category || "Guide"}
								/>
							))}
						</div>
					) : (
						<div className="glass mt-1 flex flex-col items-start gap-4 p-8">
							<div>
								<h3>No stories have been published yet</h3>
								<p className="mt-1 text-[0.9375rem] text-[var(--ink-muted)]">
									Be the first — the studio takes about ten minutes.
								</p>
							</div>
							<Link href="/studio" className="btn btn--primary">
								Write the first story
								<ArrowRight className="arrow" aria-hidden="true" />
							</Link>
						</div>
					)}
				</div>
			</section>

			<FeaturesSection />

			{/* ═══ Editorial quote ═══ */}
			<section className="quote-band">
				<div className="wrap">
					<div className="quote">
						<div className="quote__img">
							<Image
								src="/redesign/quote-kathmandu.jpg"
								alt="A carved wooden lattice window set in weathered red brick"
								width={1408}
								height={768}
								loading="lazy"
								quality={60}
								sizes="(max-width: 900px) 92vw, 32vw"
							/>
						</div>
						<div>
							<p className="eyebrow">Why this exists</p>
							<blockquote>
								<span className="mark">&ldquo;</span>Most advice for builders
								assumes you&rsquo;re in San Francisco. This assumes you&rsquo;re
								in Kathmandu — and that everything should still work.
								<span className="mark">&rdquo;</span>
							</blockquote>
							<p className="quote__support">
								Every entry is checked against one question: does this
								actually function from Nepal, today?{" "}
								<Link href="/how-we-test" className="link">
									Read the method
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ This month&rsquo;s picks ═══ */}
			<section className="section">
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow">This month&rsquo;s picks</p>
							<h2>Useful right now in Nepal</h2>
						</div>
						<span className="text-[0.8125rem] text-[var(--ink-faint)]">
							Rotated monthly
						</span>
					</div>

					<div className="cards !mt-0">
						{monthlyPicks.map((pick) => {
							const photo = PICK_PHOTOS[pick.name];
							return (
								<Link
									key={pick.name}
									href={`/resources#${pick.categoryId}`}
									className="card"
								>
									{photo && (
										<div className="card__media">
											<Image
												src={photo.src}
												alt={photo.alt}
												width={1408}
												height={768}
												loading="lazy"
												quality={60}
												sizes="(max-width: 860px) 92vw, 360px"
											/>
										</div>
									)}
									<div className="card__body">
										<span className="card__tag">{pick.badge}</span>
										<h3>{pick.name}</h3>
										<p>{pick.what}</p>
										<p className="text-[0.8125rem]">
											<strong className="font-semibold text-[var(--ink)]">
												Why Nepal:
											</strong>{" "}
											{pick.why}
										</p>
									</div>
								</Link>
							);
						})}
					</div>

					<p className="mt-6 text-[0.875rem] text-[var(--ink-muted)]">
						Every tool tested from Nepal · Prices verified Sept 2026 ·{" "}
						<Link href="/how-we-test" className="link">
							How we test
						</Link>{" "}
						·{" "}
						<Link href="/editorial" className="link">
							Editorial policy
						</Link>{" "}
						·{" "}
						<Link href="/corrections" className="link">
							Corrections
						</Link>
					</p>
				</div>
			</section>

			{/* ═══ Community feed ═══ */}
			<section className="section pt-0">
				<div className="wrap">
					<div className="section-head">
						<p className="eyebrow">The ledger</p>
						<h2>Latest from the community</h2>
						<p className="lede">
							Everything published by writers on Apex, newest first. Filter by
							topic or search the whole archive.
						</p>
					</div>

					{showFeed ? (
						<CommunityFeed
							initialArticles={rest as unknown as never[]}
							hasMore={hasMore}
							initialOffset={PAGE_SIZE}
						/>
					) : articles.length > 0 ? (
						<p className="lede">
							That&rsquo;s the latest story.{" "}
							<Link href="/write-for-us" className="link">
								Write the next one
							</Link>
							.
						</p>
					) : (
						<div className="glass flex flex-col items-start gap-4 p-8">
							<div>
								<h3>No published stories yet</h3>
								<p className="mt-1 text-[0.9375rem] text-[var(--ink-muted)]">
									Be the first to publish on Apex.
								</p>
							</div>
							<Link href="/studio" className="btn btn--primary">
								Create the first story
								<ArrowRight className="arrow" aria-hidden="true" />
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* ═══ Newsletter ═══ */}
			<section className="news">
				<div className="wrap news__in">
					<p className="eyebrow">Newsletter</p>
					<h2>One email. Every Thursday.</h2>
					<p className="news__copy">
						New resources, a short note on what changed, and nothing else.
					</p>
					<NewsletterForm />
				</div>
			</section>

			<CTASection />
		</div>
	);
}
