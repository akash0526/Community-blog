import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources — Tools We Recommend for Nepal (Apex Nepal)",
  description: "Curated tools for Nepali freelancers, students & small businesses: Hostinger, Grammarly, Canva, Payoneer, Wise, Notion. Affiliate disclosure included. Prices in NPR.",
  alternates: { canonical: "/resources" },
};

// Placeholder affiliate links — use env vars in production, do NOT hardcode IDs
const HOSTINGER_LINK = process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL || "#TODO-affiliate-hostinger";
const GRAMMARLY_LINK = process.env.NEXT_PUBLIC_AFFILIATE_GRAMMARLY_URL || "#TODO-affiliate-grammarly";
const CANVA_LINK = process.env.NEXT_PUBLIC_AFFILIATE_CANVA_URL || "#TODO-affiliate-canva";

export default function ResourcesPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Resources</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Tools we actually use</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
          Tested for Nepal — freelancing, blogging, AI, and getting paid. We only recommend what we’ve tried. Full disclosure above.
          <span className="block mt-2 text-xs text-amber-700 dark:text-amber-300">Phase 2 placeholder — Phase 3 will add full comparison table with NPR pricing, pros/cons, and sponsored=nofollow.</span>
        </p>

        <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6 mb-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 mb-2">Affiliate disclosure</h2>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            Apex Nepal is reader-supported. Some links on this page are affiliate links. If you click and purchase (e.g., Hostinger, Grammarly, Canva), we may earn a commission at no extra cost to you. We only recommend tools we’ve tested. Affiliate IDs are stored in <code>NEXT_PUBLIC_AFFILIATE_*</code> env vars — currently placeholders. See <Link href="/disclaimer" className="underline font-bold">Disclaimer</Link> and <Link href="/editorial" className="underline font-bold">Editorial Policy</Link>. We never accept payment to alter results.
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">TODO: Verify NPR fees/withdrawal limits for Payoneer/Wise/eSewa/Khalti before publishing.</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black">Priority — Hostinger, Grammarly, Canva</h2>
          <div className="grid gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-black">Hostinger</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Best for: Blogging & Hosting in Nepal — pay with eSewa/Khalti, good on slow internet</div>
                <div className="text-xs text-slate-500 mt-1">Pricing: TODO verify NPR/month • Why Nepal: local payment support</div>
              </div>
              <a href={HOSTINGER_LINK} rel="sponsored nofollow" className="btn btn-primary px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap">Get Hostinger →</a>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-black">Grammarly</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Best for: AI writing help for freelancers & students</div>
                <div className="text-xs text-slate-500 mt-1">Pricing: TODO verify • Why Nepal: English polish for Upwork proposals</div>
              </div>
              <a href={GRAMMARLY_LINK} rel="sponsored nofollow" className="btn btn-secondary px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap">Try Grammarly →</a>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-black">Canva Pro</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Best for: AI images & business marketing</div>
                <div className="text-xs text-slate-500 mt-1">Pricing: TODO verify</div>
              </div>
              <a href={CANVA_LINK} rel="sponsored nofollow" className="btn btn-secondary px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap">Try Canva →</a>
            </div>
          </div>

          <h2 className="text-2xl font-black mt-10">More — TODO affiliate rows</h2>
          <p className="text-sm text-slate-500">Marked <code>#TODO-affiliate</code> — do not publish until fees verified.</p>
          <div className="grid gap-4 opacity-80">
            {[
              { name: "Payoneer", for: "Freelancers receiving USD", note: "TODO verify NPR withdrawal fees/limits" },
              { name: "Wise (TransferWise)", for: "Low-fee international transfers", note: "TODO verify" },
              { name: "Notion", for: "AI productivity stack", note: "#TODO-affiliate" },
              { name: "Daraz Affiliate", for: "Small business / local commerce", note: "#TODO-affiliate" },
              { name: "eSewa / Khalti", for: "Local payments for bloggers", note: "Generic placeholder — no affiliate, just guide" },
            ].map((r) => (
              <div key={r.name} className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-900">
                <div className="font-bold">{r.name} <span className="text-xs font-black uppercase tracking-widest text-slate-500">— TODO</span></div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Best for: {r.for}</div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">{r.note}</div>
                <span className="inline-block mt-3 text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">#TODO-affiliate — verify before publishing</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p>Questions? <a href="mailto:editor@apex-nepal.com" className="text-indigo-600 dark:text-indigo-400 font-bold underline">editor@apex-nepal.com</a> • <Link href="/about" className="underline">About</Link> • <Link href="/disclaimer" className="underline">Disclaimer</Link></p>
          <p className="text-xs mt-2">Env vars: <code>NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_GRAMMARLY_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_CANVA_URL</code> (others TODO).</p>
        </div>
      </div>
    </main>
  );
}
