import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
	resources: number;
	guides: number;
	categories: number;
}

/**
 * Home hero.
 *
 * A quiet, typographic opener: one headline, one line of context, two
 * actions and the real numbers. The previous version stacked animated
 * orbs, floating glass cards and parallax transforms on top of the LCP
 * element; all of that is gone, so the headline paints immediately and
 * the whole hero is a single server-rendered component (no client JS).
 */
export default function Hero({ resources, guides, categories }: HeroProps) {
	const stats = [
		{ value: `${resources}`, label: "Resources tested" },
		{ value: `${guides}`, label: "Guides published" },
		{ value: `${categories}`, label: "Categories" },
	];

	return (
		<section className="hero">
			<div className="hero__glow" aria-hidden="true" />

			<div className="wrap hero__in">
				<div>
					<span className="hero__badge">
						<span className="dot" aria-hidden="true" />
						Updated weekly · Tested from Kathmandu
					</span>

					<h1>
						Tools and guides for people building from <em>Nepal</em>.
					</h1>

					<p className="lede hero__lede">
						Payments, AI tools, hosting and online work — every entry checked
						on Nepali internet, priced in NPR, and corrected in public.
					</p>

					<div className="hero__cta">
						<Link href="/resources" className="btn btn--primary btn--lg">
							Browse resources
							<ArrowRight className="arrow" aria-hidden="true" />
						</Link>
						<Link href="/blog" className="btn btn--ghost btn--lg">
							Read the guides
						</Link>
					</div>

					<dl className="hero__stats">
						{stats.map((stat) => (
							<div key={stat.label}>
								<dt className="stat__l">{stat.label}</dt>
								<dd className="stat__n">{stat.value}</dd>
							</div>
						))}
					</dl>
				</div>

				<div className="hero__visual">
					<figure className="hero__img">
						<Image
							src="/redesign/hero-builder.jpg"
							alt="A developer writing code on a laptop at a wooden table in a brick-and-timber Kathmandu cafe"
							width={1408}
							height={768}
							sizes="(max-width: 900px) 92vw, 40vw"
							quality={70}
							priority
						/>
					</figure>
					<p className="hero__chip">
						<span className="pulse" aria-hidden="true" />
						Every entry verified from Nepal
					</p>
				</div>
			</div>
		</section>
	);
}
