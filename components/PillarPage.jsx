import Link from "next/link";
import { getCategory } from "@/lib/resources";

export default function PillarPage({ categoryId, eyebrow, title, description, steps, faqs }) {
	const category = getCategory(categoryId);
	return (
		<main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-12">
			<div className="max-w-5xl mx-auto px-6">
				<section className="glass rounded-3xl p-8 sm:p-12 mb-10">
					<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{eyebrow}</span>
					<h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-3 mb-5">{title}</h1>
					<p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">{description}</p>
					<div className="flex flex-wrap gap-3 mt-8">
						<Link href={`/resources#${categoryId}`} className="btn btn-primary rounded-xl text-sm">Open resource table</Link>
						<Link href="/how-we-test" className="btn btn-secondary rounded-xl text-sm">How we test</Link>
					</div>
				</section>

				<section className="prose prose-slate dark:prose-invert max-w-none mb-10">
					<h2>Starter roadmap</h2>
					<ol>
						{steps.map((step) => <li key={step}>{step}</li>)}
					</ol>
					<h2>Nepal checklist</h2>
					<ul>
						<li>Works on NTC/Ncell or common Nepali broadband without a VPN.</li>
						<li>Has a usable free tier, clear NPR-equivalent pricing, or a local payment workaround.</li>
						<li>Supports students, freelancers, or small businesses with practical outcomes.</li>
						<li>Links back to the resources directory so readers can compare alternatives.</li>
					</ul>
				</section>

				{category && (
					<section className="mb-12">
						<div className="flex items-end justify-between gap-4 mb-5">
							<h2 className="text-2xl font-black">{category.emoji} Recommended tools</h2>
							<Link href={`/resources#${category.id}`} className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline">See full directory →</Link>
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							{category.resources.slice(0, 8).map((resource) => (
								<div key={resource.name} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
									<div className="flex items-center justify-between gap-3 mb-2">
										<h3 className="font-black">{resource.name}</h3>
										<span className="text-xs font-black rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">{resource.badge}</span>
									</div>
									<p className="text-sm text-slate-600 dark:text-slate-300">{resource.why}</p>
								</div>
							))}
						</div>
					</section>
				)}

				<section className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
					<h2 className="text-2xl font-black mb-5">FAQ</h2>
					<div className="space-y-5">
						{faqs.map((faq) => (
							<div key={faq.q}>
								<h3 className="font-black mb-1">{faq.q}</h3>
								<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
