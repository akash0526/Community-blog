import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Write for Apex Nepal",
	description: "Contribution guidelines for Nepal-tested tools, freelancing, AI, payments, hosting, and small business guides.",
	alternates: { canonical: "/write-for-us" },
};

export default function WriteForUsPage() {
	return (
		<div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
			<div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
				<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Community contributions</span>
				<h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-5">Write for Apex Nepal</h1>
				<p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
					Help Nepali students, freelancers, and small businesses find tools that actually work here. We welcome tested guides, resource suggestions, and correction notes.
				</p>

				<div className="grid gap-6 text-[15px] leading-relaxed">
					<section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
						<h2 className="text-2xl font-black mb-3">Topics we want</h2>
						<ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
							<li>AI tools that work well on Nepali internet and free tiers.</li>
							<li>Freelancing profiles, proposals, portfolios, and payment workflows.</li>
							<li>Hosting, blogging, domains, CDN, speed, and NPR cost breakdowns.</li>
							<li>Small-business workflows for shops, tutors, agencies, and local services.</li>
							<li>Student learning resources, free courses, books, coding paths, and exam systems.</li>
						</ul>
					</section>

					<section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
						<h2 className="text-2xl font-black mb-3">Quality bar</h2>
						<p className="text-slate-700 dark:text-slate-300">Your piece should include screenshots or clear steps where possible, a Nepal-specific note, links to official sources, and an honest free alternative if an affiliate or paid tool is mentioned.</p>
					</section>

					<section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
						<h2 className="text-2xl font-black mb-3">Disclosure rules</h2>
						<p className="text-slate-700 dark:text-slate-300">Disclose paid relationships, referral links, free accounts, sponsored access, and conflicts of interest. We reject affiliate spam and thin rewrites.</p>
					</section>

					<section className="rounded-3xl bg-indigo-600 text-white p-6 sm:p-8">
						<h2 className="text-2xl font-black mb-3">Submit a draft or tool suggestion</h2>
						<p className="text-indigo-100 mb-5">Use the studio if you are ready to draft, or email a short pitch with the tool name, URL, and why it matters in Nepal.</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<Link href="/studio" className="btn bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-sm">Open Studio</Link>
							<a href="mailto:editor@apex-nepal.com?subject=Apex%20Nepal%20pitch" className="btn border-white/40 text-white hover:bg-white/10 rounded-xl text-sm">Email editor@</a>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
