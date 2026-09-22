import Link from "next/link";
import { resourceCategories, resourceHref, countResources } from "@/lib/resources";
import { SITE_URL } from "@/lib/articles";
import { IconArrowRight, IconArrowUpRight } from "@/components/Icon";

const RESOURCE_COUNT = countResources();

export const metadata = {
	title: "Resources for Nepal: AI, Freelancing, Hosting, Payments & Business Tools",
	description:
		"A tested directory of free and affordable tools for Nepali students, freelancers, bloggers, and small businesses.",
	alternates: { canonical: "/resources" },
	openGraph: {
		title: "Resources for Nepal | Apex",
		description:
			"Tools tested for Nepali internet, Nepali payments, and realistic NPR budgets.",
		url: `${SITE_URL}/resources`,
		type: "website",
	},
};

function statusTone(status) {
	if (status === "works") return "card__tag";
	if (status === "check first") return "card__tag card__tag--warn";
	return "card__tag";
}

export default function ResourcesPage() {
	const itemList = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Apex Nepal resources",
		numberOfItems: RESOURCE_COUNT,
		itemListElement: resourceCategories.flatMap((category) =>
			category.resources.map((resource, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: resource.name,
				url: resourceHref(resource) || `${SITE_URL}/resources#${category.id}`,
			})),
		),
	};

	return (
		<div className="flex-1">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
			/>
			<section className="hero" style={{ paddingBottom: "var(--section)" }}>
				<div className="wrap">
					<p className="eyebrow">
						<span className="num">01</span> Resources directory
					</p>
					<h1>
						Tools tested for <em>Nepal</em>.
					</h1>
					<p className="lede" style={{ marginTop: "1.25rem" }}>
						Not generic listicles. Every recommendation asks: does it work on
						Nepali internet, with Nepali payments, at a realistic NPR price?
					</p>
					<p className="mt-4 text-[0.875rem] text-[var(--ink-faint)]">
						{RESOURCE_COUNT} tools · {resourceCategories.length} categories ·
						prices verified Sept 2026
					</p>
					<div className="hero__cta">
						{resourceCategories.map((category) => (
							<Link
								key={category.id}
								href={`#${category.id}`}
								className="btn btn--ghost !px-4 !py-2 !text-[0.875rem]"
							>
								{category.title}
							</Link>
						))}
					</div>
				</div>
			</section>

			{resourceCategories.map((category, index) => {
				const pillarIsExternal = category.pillar && !category.pillar.startsWith("/resources");
				return (
					<section key={category.id} id={category.id} className="section" style={{ paddingTop: 0 }}>
						<div className="wrap">
							<div className="section-head--split">
								<div>
									<p className="eyebrow">
										<span className="num">{String(index + 2).padStart(2, "0")}</span>{" "}
										{category.title}
									</p>
									<h2>{category.title}</h2>
									<p className="lede" style={{ marginTop: "1rem" }}>
										{category.audience}
									</p>
								</div>
								{pillarIsExternal && (
									<Link href={category.pillar} className="link link--arrow">
										Read the pillar guide
										<IconArrowRight className="icon icon--15" />
									</Link>
								)}
							</div>

							<div className="cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
								{category.resources.map((resource) => {
									const href = resourceHref(resource);
									const Tag = href ? "a" : "div";
									const rel = resource.affiliate
										? "noopener noreferrer sponsored"
										: "noopener noreferrer";
									return (
										<Tag
											key={resource.name}
											{...(href ? { href, target: "_blank", rel } : {})}
											className="card !p-0"
										>
											<div className="card__body">
												<div className="flex flex-wrap items-start justify-between gap-2">
													<h3>{resource.name}</h3>
													{href && <IconArrowUpRight className="icon icon--15 text-[var(--ink-faint)]" />}
												</div>
												<div className="flex flex-wrap gap-1.5">
													<span className="card__tag">{resource.badge}</span>
													{resource.status ? (
														<span className={statusTone(resource.status)}>{resource.status}</span>
													) : null}
													{resource.affiliate ? (
														<span className="card__tag">Affiliate</span>
													) : null}
												</div>
												<p>{resource.why}</p>
												{resource.secondaryUrl && (
													<p className="text-[0.8125rem]">
														Also:{" "}
														<a
															href={resource.secondaryUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="link"
														>
															Mini QR
														</a>
													</p>
												)}
												{!href && (
													<p className="text-[0.8125rem] text-[var(--ink-faint)]">
														Link pending verification.
													</p>
												)}
											</div>
										</Tag>
									);
								})}
							</div>
						</div>
					</section>
				);
			})}

			<section className="section" style={{ paddingTop: 0 }}>
				<div className="wrap">
					<div className="border border-[var(--hairline)] bg-[var(--sunken)] px-5 py-5 text-[0.875rem] text-[var(--ink-muted)]">
						<strong className="text-[var(--ink)]">Status legend:</strong> “works”
						= link verified alive · “check first” = alive but bot-protected —
						confirm in a browser before relying on it. Prices and payment rails
						change fast, so money pages are re-verified quarterly.{" "}
						<Link href="/how-we-test" className="link">
							How we test
						</Link>
						.
					</div>
				</div>
			</section>
		</div>
	);
}
