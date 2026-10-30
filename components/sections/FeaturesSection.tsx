import {
	Rocket,
	ShieldCheck,
	Users,
	Wifi,
	type LucideIcon,
} from "lucide-react";

interface Feature {
	icon: LucideIcon;
	title: string;
	description: string;
}

const FEATURES: Feature[] = [
	{
		icon: Wifi,
		title: "Tested from Nepal",
		description:
			"Verified on NTC, Ncell and WorldLink — plus eSewa, Khalti and Payoneer. If it does not work here, we say so.",
	},
	{
		icon: Users,
		title: "Community driven",
		description:
			"Built and kept honest by Nepal's maker community. Share a pick, flag a stale one, see what others use.",
	},
	{
		icon: Rocket,
		title: "Fresh every week",
		description:
			"New guides, field notes and picks — written for Nepali speeds, prices and payment rails.",
	},
	{
		icon: ShieldCheck,
		title: "Open and honest",
		description:
			"Cited sources, public corrections, no affiliate surprises. When a pick changes, you can read why.",
	},
];

/**
 * "Why Apex" — a four-up grid of quiet cards. No ambient blobs, no
 * staggered scroll animations: the content is short, so it should just
 * be there.
 */
export function FeaturesSection() {
	return (
		<section className="section">
			<div className="wrap">
				<div className="section-head">
					<p className="eyebrow">Why this site</p>
					<h2>Written for the way Nepal actually works</h2>
					<p className="lede">
						Most advice for builders assumes you are in San Francisco.
						This assumes you are in Kathmandu — and that everything should
						still work.
					</p>
				</div>

				<div className="feature-grid">
					{FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<div key={feature.title} className="feature">
								<span className="feature__icon">
									<Icon size={17} aria-hidden="true" />
								</span>
								<h3>{feature.title}</h3>
								<p>{feature.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
