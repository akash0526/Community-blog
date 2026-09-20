import Link from "next/link";
import { resourceCategories, resourceHref } from "@/lib/resources";
import { SITE_URL } from "@/lib/articles";

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

function Badge({ children, tone = "slate" }) {
	const tones = {
		slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
		green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
		amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
	};
	return <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${tones[tone]}`}>{children}</span>;
}

export default function ResourcesPage() {
	return (
		<div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-12">
			<div className="max-w-7xl mx-auto px-6">
				<section className="glass rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden">
					<div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />
					<div className="relative z-10 max-w-3xl">
						<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Resources directory</span>
						<h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-3 mb-5">Tools tested for Nepal.</h1>
						<p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
							Not generic listicles. Every recommendation asks: does it work on Nepali internet, with Nepali payments, at a realistic NPR price?
						</p>
						<div className="flex flex-wrap gap-3 mt-8">
							{resourceCategories.map((category) => (
								<Link key={category.id} href={`#${category.id}`} className="btn btn-secondary px-4 py-2 rounded-xl text-xs">
									{category.title}
								</Link>
							))}
						</div>
					</div>
				</section>

				<div className="grid gap-10">
					{resourceCategories.map((category) => (
						<section key={category.id} id={category.id} className="scroll-mt-28">
							<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
								<div>
									<h2 className="text-2xl sm:text-3xl font-black">{category.title}</h2>
									<p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">{category.audience}</p>
								</div>
								<Link href={category.pillar} className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline">Read the pillar guide →</Link>
							</div>

							<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
								{category.resources.map((resource) => {
									const href = resourceHref(resource);
									const CardTag = href ? "a" : "div";
									return (
										<CardTag
											key={resource.name}
											{...(href ? { href, target: "_blank", rel: "noopener sponsored" } : {})}
											className="block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
										>
											<div className="flex items-start justify-between gap-3 mb-3">
												<h3 className="font-black text-lg leading-tight">{resource.name}</h3>
												<div className="flex gap-1.5 flex-wrap justify-end">
													<Badge tone={resource.badge === "Free" ? "green" : "slate"}>{resource.badge}</Badge>
													{resource.status && <Badge>{resource.status}</Badge>}
													{resource.affiliate && <Badge tone="amber">Affiliate</Badge>}
												</div>
											</div>
											<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{resource.why}</p>
											{resource.secondaryUrl && (
												<p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3 font-bold">Includes Mini QR alternative</p>
											)}
											{!href && <p className="text-xs text-slate-500 mt-3 font-bold">Link pending verification / affiliate setup.</p>}
										</CardTag>
									);
								})}
							</div>
						</section>
					))}
				</div>

				<div className="mt-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-sm text-slate-600 dark:text-slate-300">
					<strong className="text-slate-900 dark:text-white">Status legend:</strong> “works” = link verified alive · “check first” = alive but bot-protected · confirm in browser before relying on it. Prices and payment rails change fast, so money pages are re-verified quarterly.
				</div>
			</div>
		</div>
	);
}
