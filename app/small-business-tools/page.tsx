import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Small Business Tools for Nepal — POS, Canva, WhatsApp & Google (2026)",
  description: "Tools for Nepali small businesses: free POS/billing, Canva marketing, WhatsApp Business catalog, Google Business Profile. Grow without big budget.",
  alternates: { canonical: "/small-business-tools" },
};

export default function SmallBusinessPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • Small Business Tools</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Small Business Tools</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          For Kathmandu shops to Pokhara startups — free and cheap tools that work in Nepal.
          <span className="block mt-2 text-sm text-amber-700 dark:text-amber-300">TODO: Full pillar in Phase 3.</span>
        </p>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Coming in Phase 3</h2>
          <ul>
            <li>Pillar: This page</li>
            <li>Free POS/billing tools for retail in Nepal <em>TODO</em></li>
            <li>Canva for business marketing — <code>AFFILIATE_LINK_CANVA</code> <em>TODO</em></li>
            <li>WhatsApp Business catalog setup <em>TODO</em></li>
            <li>Google Business Profile for Nepal <em>TODO</em></li>
            <li>Accounting tools: Bahi Khata <em>TODO</em></li>
          </ul>
          <p><Link href="/resources" className="text-indigo-600 dark:text-indigo-400 font-bold underline">See Resources →</Link></p>
        </div>
      </div>
    </main>
  );
}
