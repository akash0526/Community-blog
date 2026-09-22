import Link from "next/link";
import { getCategory, resourceHref } from "@/lib/resources";
import { IconArrowRight, IconArrowUpRight } from "@/components/Icon";

export default function PillarPage({ categoryId, eyebrow, title, description, steps, faqs }) {
	const category = getCategory(categoryId);

	return (
		<div className="flex-1">
			<section className="hero" style={{ paddingBottom: "var(--section)" }}>
				<div className="wrap">
					<p className="eyebrow">
						<span className="num">01</span> {eyebrow}
					</p>
					<h1>{title}</h1>
					<p className="lede" style={{ marginTop: "1.25rem", maxWidth: "54ch" }}>
						{description}
					</p>
					<div className="hero__cta">
						<Link href={`/resources#${categoryId}`} className="btn btn--primary">
							Open resource table
							<IconArrowRight />
						</Link>
						<Link href="/how-we-test" className="btn btn--ghost">
							How we test
						</Link>
					</div>
				</div>
			</section>

			<section className="section" style={{ paddingTop: 0 }}>
				<div className="wrap" style={{ maxWidth: "760px" }}>
					<h2>Starter roadmap</h2>
					<ol className="mt-6 space-y-3 text-[var(--ink-muted)]">
						{steps.map((step, i) => (
							<li key={step} className="flex gap-3">
								<span className="font-display text-[var(--clay)]">{String(i + 1).padStart(2, "0")}</span>
								<span>{step}</span>
							</li>
						))}
					</ol>

					<h2 className="mt-16">Nepal checklist</h2>
					<ul className="mt-6 space-y-2 text-[var(--ink-muted)]">
						<li>Works on NTC/Ncell or common Nepali broadband without a VPN.</li>
						<li>Has a usable free tier, clear NPR-equivalent pricing, or a local payment workaround.</li>
						<li>Supports students, freelancers, or small businesses with practical outcomes.</li>
						<li>Links back to the resources directory so readers can compare alternatives.</li>
					</ul>
				</div>
			</section>

			{category && (
				<section className="section" style={{ paddingTop: 0 }}>
					<div className="wrap">
						<div className="section-head--split">
							<h2>Recommended tools</h2>
							<Link href={`/resources#${category.id}`} className="link link--arrow">
								See full directory
								<IconArrowRight className="icon icon--15" />
							</Link>
						</div>
						<div className="cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
							{category.resources.slice(0, 8).map((resource) => {
								const href = resourceHref(resource);
								const Tag = href ? "a" : "div";
								return (
									<Tag
										key={resource.name}
										{...(href
											? {
													href,
													target: "_blank",
													rel: resource.affiliate
														? "noopener noreferrer sponsored"
														: "noopener noreferrer",
												}
											: {})}
										className="card !p-0"
									>
										<div className="card__body">
											<div className="flex items-start justify-between gap-3">
												<h3>{resource.name}</h3>
												{href && <IconArrowUpRight className="icon icon--15 text-[var(--ink-faint)]" />}
											</div>
											<span className="card__tag">{resource.badge}</span>
											<p>{resource.why}</p>
										</div>
									</Tag>
								);
							})}
						</div>
					</div>
				</section>
			)}

			<section className="section" style={{ paddingTop: 0 }}>
				<div className="wrap" style={{ maxWidth: "760px" }}>
					<h2>FAQ</h2>
					<div className="mt-8 grid gap-8">
						{faqs.map((faq) => (
							<div key={faq.q}>
								<h3 className="!text-[1.1875rem]">{faq.q}</h3>
								<p className="mt-2 text-[var(--ink-muted)]">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
