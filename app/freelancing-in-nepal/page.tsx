import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Freelancing in Nepal — Start Freelancing on Upwork & Fiverr (2026)",
  description: "How to start freelancing in Nepal: Upwork, Fiverr, profile tips, getting first clients, PAN/taxes, and niches that work from Nepal. Tested for Nepalis in Nepal & abroad.",
  alternates: { canonical: "/freelancing-in-nepal" },
};

export default function FreelancingPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • Freelancing in Nepal</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Freelancing in Nepal</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Zero-to-first-client guide for Nepalis — profiles, proposals, and payments that work from Kathmandu to Qatar.
          <span className="block mt-2 text-sm text-amber-700 dark:text-amber-300">TODO: Full pillar in Phase 3.</span>
        </p>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Coming in Phase 3</h2>
          <ul>
            <li>Pillar: This page</li>
            <li>How to start freelancing in Nepal — Upwork vs Fiverr <em>TODO</em></li>
            <li>Profile bio examples that get clicks <em>TODO</em></li>
            <li>How to get first client with no experience <em>TODO</em></li>
            <li>Freelancing taxes in Nepal (PAN) <em>TODO</em></li>
            <li>Best niches for Nepali freelancers 2026 <em>TODO</em></li>
          </ul>
          <p><Link href="/digital-payments" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Next: Digital Payments →</Link></p>
        </div>
      </div>
    </main>
  );
}
