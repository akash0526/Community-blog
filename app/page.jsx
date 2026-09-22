import Link from "next/link";
import Image from "next/image";
import { getPaginatedArticles, getPublishedArticleCount } from "@/lib/articles";
import CommunityFeed from "@/components/CommunityFeed";
import NewsletterForm from "@/components/NewsletterForm";
import { monthlyPicks, resourceCategories, countResources, countByCategory } from "@/lib/resources";
import { cleanExcerpt } from "@/lib/seoUtils";
import {
	IconArrowRight,
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

// §9 — the three picks that have photography in public/redesign/ become media
// cards; the rest stay text cards in the same grid. Files are used at their
// original 1408x768 and framed with object-position (see globals.css), so the
// repo keeps the untrimmed photos for reuse elsewhere.
const PICK_PHOTOS = {
	DeepSeek: {
		src: "/redesign/deepseek.jpg",
		alt: "A hand on a mechanical keyboard beside a notebook of merge-sort diagrams, with a laptop of code behind",
	},
	Harper: {
		src: "/redesign/harper.jpg",
		alt: "A manuscript open on a laptop screen with tracked changes, reading glasses and a pen on the desk",
	},
	Photopea: {
		src: "/redesign/photopea.jpg",
		alt: "A vector logo edit open on a laptop beside fanned Pantone swatches and type specimens",
	},
};

const RESOURCE_COUNT = countResources();
const CATEGORY_COUNTS = countByCategory();

// §6 — ticker topics. Duplicated once inside the component so the 42s loop is seamless.
const TICKER_ITEMS = resourceCategories.map((category) => category.title);

// Six tiles, one per directory category, with counts taken from lib/resources.js.
const CATEGORY_TILES = [
	{
		variant: "tile--wide",
		icon: IconCard,
		title: "Getting paid",
		copy: "Payment gateways, remittance routes and payout options that actually clear for Nepali freelancers and businesses.",
		count: CATEGORY_COUNTS.payments,
		href: "/digital-payments",
	},
	{
		icon: IconSparkle,
		title: "AI tools",
		copy: "Free and paid assistants that work on NTC/Ncell — no VPN required.",
		count: CATEGORY_COUNTS["ai-tools"],
		href: "/ai-tools",
	},
	{
		icon: IconBriefcase,
		title: "Freelancing",
		copy: "CVs, portfolios, remote boards and time-zone tools for the first client.",
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


function cleanTitle(title) {
	if (!title) return "";
	return String(title).replace(/\s*Slug:.*$/i, "").trim();
}

function formatDate(value) {
	if (!value) return "";
	return new Date(value).toLocaleDateString("en-GB", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export default async function Homepage() {
	const articles = await getPaginatedArticles(PAGE_SIZE, 0);
	const totalCount = await getPublishedArticleCount();
	const featured = articles.slice(0, 3);
	const rest = articles.slice(3);
	const hasMore = totalCount > PAGE_SIZE;
	const showFeed = rest.length > 0 || hasMore;

	return (
		<div className="flex-1">
			{/* ═══ §5 HERO — asymmetric, left-aligned ═══ */}
			<section className="hero">
				<div className="wrap hero__grid">
					<div>
						<p className="eyebrow">
							<span className="num">01</span> Curated for Nepal
						</p>

						<h1>
							Everything you need to build <em>from here</em>.
						</h1>

						<p className="lede">
							A hand-checked directory of the tools, payment rails, guides and
							communities that actually work for freelancers, founders and
							creators based in Nepal.
						</p>

						<div className="hero__cta">
							<Link href="/resources" className="btn btn--primary">
								Browse resources
								<IconArrowRight />
							</Link>
							<Link href="/blog" className="btn btn--ghost">
								Read the guides
							</Link>
						</div>

						<div className="hero__stats">
							<div>
								<div className="stat__n">{RESOURCE_COUNT}</div>
								<div className="stat__l">Resources</div>
							</div>
							<div>
								<div className="stat__n">{resourceCategories.length}</div>
								<div className="stat__l">Categories</div>
							</div>
							<div>
								<div className="stat__n">Weekly</div>
								<div className="stat__l">Updated</div>
							</div>
						</div>
					</div>

					<div className="hero__visual">
						<div className="hero__block" aria-hidden="true" />
						<div className="hero__img">
							<Image
								src="/redesign/hero-builder.jpg"
								alt="A Nepali developer writing code on a laptop at a wooden table in a brick-and-timber Kathmandu cafe"
								width={1408}
								height={768}
								priority
								sizes="(max-width: 900px) 100vw, 420px"
							/>
						</div>
						<div className="hero__chip">
							<span className="pulse" aria-hidden="true" />Updated Sept 2026
						</div>
					</div>
				</div>
			</section>

			{/* ═══ §6 TICKER ═══ */}
			<div className="ticker" aria-hidden="true">
				<div className="ticker__track">
					{[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
						<span className="ticker__item" key={`${item}-${i}`}>
							{item}
						</span>
					))}
				</div>
			</div>

			{/* ═══ §7 CATEGORIES — bento grid ═══ */}
			<section className="section">
				<div className="wrap">
					<p className="eyebrow reveal">
						<span className="num">02</span> Explore
					</p>
					<h2 className="reveal" style={{ maxWidth: "16ch" }}>
						Start where you are.
					</h2>
					<p className="lede reveal" style={{ marginTop: "1.125rem" }}>
						Six working categories, each one checked on Nepali internet with
						Nepali payment methods — not copied from a global list.
					</p>

					<div className="bento">
						{CATEGORY_TILES.map((tile) => {
							const Icon = tile.icon;
							return (
								<Link
									key={tile.title}
									href={tile.href}
									className={`tile reveal${tile.variant ? ` ${tile.variant}` : ""}`}
								>
									<div>
										<span className="tile__icon">
											<Icon className="icon icon--17" />
										</span>
										<h3>{tile.title}</h3>
										<p>{tile.copy}</p>
									</div>
									<div className="tile__count" aria-hidden="true">
										{tile.count}
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══ §8 MOTIF DIVIDER — used once per page ═══ */}
			<div className="wrap">
				<div className="motif" aria-hidden="true" />
			</div>

			{/* ═══ §9 FEATURED CARDS ═══ */}
			<section className="section">
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow reveal">
								<span className="num">03</span> Featured
							</p>
							<h2 className="reveal">Picked this week.</h2>
						</div>
						<Link href={featured.length ? "/blog" : "/resources"} className="link link--arrow reveal">
							{featured.length ? "See all stories" : "See all resources"}
							<IconArrowRight className="icon icon--15" />
						</Link>
					</div>

					{featured.length > 0 ? (
						<div className="cards">
							{featured.map((art) => (
								<article className="card reveal" key={art.id || art.slug}>
									<Link
										href={`/blog/${art.slug}`}
										className="flex flex-1 flex-col"
										aria-label={cleanTitle(art.title)}
									>
										<div className="card__media">
											<Image
												src={art.image_url || "/opengraph-image"}
												alt={cleanTitle(art.title)}
												width={640}
												height={400}
												sizes="(max-width: 860px) 100vw, 33vw"
												loading="lazy"
											/>
										</div>
										<div className="card__body">
											<span className="card__tag">{art.category || "Guide"}</span>
											<h3>{cleanTitle(art.title)}</h3>
											<p>{cleanExcerpt(art.meta_description)}</p>
											<div className="card__foot">
												<span>
													{formatDate(
														art.published_at || art.created_at,
													) || "Recently"}
												</span>
												<span>{art.profiles?.full_name || "Apex Editorial"}</span>
											</div>
										</div>
									</Link>
								</article>
							))}
						</div>
					) : (
						<p className="lede" style={{ marginTop: "1.125rem" }}>
							No stories are published yet —{" "}
							<Link href="/write-for-us" className="link">
								be the first to submit one
							</Link>
							.
						</p>
					)}
				</div>
			</section>

			{/* ═══ §10 EDITORIAL QUOTE ═══ */}
			<section className="quote-band">
				<div className="wrap" style={{ paddingBlock: "var(--section)" }}>
					<div className="quote">
						<div className="quote__img reveal">
							<Image
								src="/redesign/quote-kathmandu.jpg"
								alt="A carved wooden lattice window set in weathered red brick, with a notebook and a clay cup of tea on the ledge below it"
								width={1408}
								height={768}
								loading="lazy"
								sizes="(max-width: 860px) 320px, 40vw"
							/>
						</div>
						<div>
							<p className="eyebrow reveal">
								<span className="num">04</span> Why this exists
							</p>
							<blockquote className="reveal">
								<span className="mark">&ldquo;</span>Most advice for builders
								assumes you&rsquo;re in San Francisco. This assumes you&rsquo;re
								in Kathmandu — and that everything should still work.
								<span className="mark">&rdquo;</span>
							</blockquote>
							<p className="quote__support reveal">
								Every entry is checked against one question: does this actually
								function from Nepal, today?
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ §11 NEWSLETTER — the one centred block on the page ═══ */}
			<section className="news">
				<div className="wrap news__in">
					<p className="eyebrow">
						<span className="num">05</span> Newsletter
					</p>
					<h2>One email. Every Thursday.</h2>
					<p className="news__copy">
						New resources, a short note on what changed, and nothing else.
					</p>
					<NewsletterForm />
				</div>
			</section>

			{/* ═══ Sections the site already had, kept and re-tokenised ═══ */}
			<section className="section">
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow reveal">
								<span className="num">06</span> Start here
							</p>
							<h2 className="reveal">Pick your Nepal-ready kit</h2>
						</div>
						<Link href="/resources" className="link reveal">
							View all resources
						</Link>
					</div>

					<div className="cards">
						{[
							{
								title: "Student Starter Kit",
								copy: "Free courses, free AI study help, free books. NPR 0 to start learning.",
								href: "/resources#students",
								foot: "Includes: MIT + Khan Academy guide",
							},
							{
								title: "First-Client Freelancer Kit",
								copy: "Profile, proposals, portfolio and payments — everything to earn your first $100.",
								href: "/resources#freelancing",
								foot: "Includes: First client on Upwork",
							},
							{
								title: "Shop Owner Kit",
								copy: "Free design, free billing tools and online visibility for your pasal.",
								href: "/resources#business",
								foot: "Includes: Free tools for a shop",
							},
						].map((kit) => (
							<Link
								key={kit.title}
								href={kit.href}
								className="card reveal !p-6 !gap-3"
							>
								<span className="card__tag">Kit</span>
								<h3>{kit.title}</h3>
								<p>{kit.copy}</p>
								<span className="card__foot">
									<span>{kit.foot}</span>
									<IconArrowRight className="icon icon--15" />
								</span>
							</Link>
						))}
					</div>

					<div className="mt-6 border border-[var(--hairline)] bg-[var(--sunken)] px-5 py-4 text-[0.875rem] text-[var(--ink-muted)]">
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
					</div>
				</div>
			</section>

			<section className="section" style={{ paddingTop: 0 }}>
				<div className="wrap">
					<div className="section-head--split">
						<div>
							<p className="eyebrow reveal">
								<span className="num">07</span> This month&rsquo;s picks
							</p>
							<h2 className="reveal">Useful now in Nepal</h2>
						</div>
						<span className="text-[0.8125rem] text-[var(--ink-faint)]">
							Rotated monthly
						</span>
					</div>

					<div className="cards">
						{monthlyPicks.map((pick) => {
							const photo = PICK_PHOTOS[pick.name];
							return (
								<Link
									key={pick.name}
									href={`/resources#${pick.categoryId}`}
									className="card reveal"
								>
									{photo && (
										<div className="card__media">
											<Image
												src={photo.src}
												alt={photo.alt}
												width={1408}
												height={768}
												loading="lazy"
												sizes="(max-width: 860px) 100vw, 33vw"
											/>
										</div>
									)}
									<div className="card__body">
										<span className="card__tag">{pick.badge}</span>
										<h3>{pick.name}</h3>
										<p>{pick.what}</p>
										<p className="text-[0.8125rem]">
											<strong className="font-semibold">Why Nepal:</strong>{" "}
											{pick.why}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* Community feed + search keeps its behaviour, gains the new tokens. */}
			<section className="section" id="feed" style={{ paddingTop: 0 }}>
				<div className="wrap">
					<p className="eyebrow reveal">
						<span className="num">08</span> The ledger
					</p>
					<h2 className="reveal">Latest from the community</h2>
					<div className="mt-8">
						{showFeed ? (
							<CommunityFeed
								initialArticles={rest}
								hasMore={hasMore}
								initialOffset={PAGE_SIZE}
							/>
						) : articles.length > 0 ? (
							<p className="lede" style={{ marginTop: "1.125rem" }}>
								That’s the latest story.{" "}
								<Link href="/write-for-us" className="link">
									Write the next one
								</Link>
								.
							</p>
						) : (
							<div className="card !p-10">
								<h3 className="mb-2">No published stories yet</h3>
								<p className="mb-6 text-[0.9375rem] text-[var(--ink-muted)]">
									Be the first to publish on Apex.
								</p>
								<Link href="/studio" className="btn btn--primary">
									Create first story
									<IconArrowRight />
								</Link>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
