import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "How Apex Tests Tools for Nepal",
	description: "Our methodology for testing tools on Nepali internet, Nepali payment paths, NPR pricing, and practical local use cases.",
	alternates: { canonical: "/how-we-test" },
};

export default function HowWeTestPage() {
	return (
		<div className="flex-1 bg-[var(--paper)] text-[var(--ink)]">
			<div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
				<span className="text-xs font-black uppercase tracking-widest text-[var(--accent)]">Trust methodology</span>
				<h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-5">How we test tools for Nepal</h1>
				<p className="text-lg text-[var(--ink-muted)] mb-10 leading-relaxed">
					Apex recommendations are not copied from global roundups. We check whether a tool works on common Nepali networks, whether the free tier is useful, and whether paid pricing makes sense in NPR.
				</p>

				<div className="space-y-8 text-[15px] leading-relaxed text-[var(--ink)]">
					<section>
						<h2 className="text-2xl font-black text-[var(--ink)] mb-3">What we verify</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Access from Nepal without a VPN where possible.</li>
							<li>Useful free tier, realistic NPR-equivalent pricing, and renewal warnings for paid tools.</li>
							<li>Payment paths Nepali readers can actually use, including local-wallet or card-link realities when relevant.</li>
							<li>Practical value for at least one audience: students, freelancers, or small businesses.</li>
							<li>Affiliate bias risk: every paid recommendation must mention a free alternative when one exists.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-black text-[var(--ink)] mb-3">Update cadence</h2>
						<p>Money pages and payment guides are checked quarterly because fees, limits, offers, and withdrawal rails change quickly. Resource links are rechecked quarterly, and homepage picks rotate monthly.</p>
					</section>

					<section>
						<h2 className="text-2xl font-black text-[var(--ink)] mb-3">Status labels</h2>
						<p>“Works” means the link was verified alive. “Check first” means the service is alive but bot-protected and should open normally in browsers. Where we could not confirm from Nepal, the entry says so.</p>
					</section>

					<section className="rounded-3xl bg-[var(--sunken)] border border-[var(--hairline)] p-6">
						<h2 className="text-2xl font-black text-[var(--ink)] mb-3">Found a mistake?</h2>
						<p>Email <a className="font-black text-[var(--accent)] underline" href="mailto:editor@apex-nepal.com">editor@apex-nepal.com</a>. We aim to reply to corrections within 7 days and fix verified errors quickly.</p>
						<Link href="/resources" className="btn btn-primary mt-5 rounded-xl text-sm">Browse resources</Link>
					</section>
				</div>
			</div>
		</div>
	);
}
