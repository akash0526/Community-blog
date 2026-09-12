import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Tools for Nepal — Best AI Tools for Freelancers & Students (2026)",
  description: "Best AI tools for Nepali freelancers and students: ChatGPT, Grammarly, Canva, Notion. Practical, tested guides for Nepal — prompts, workflows, and pricing in NPR.",
  alternates: { canonical: "/ai-tools" },
};

export default function AIToolsPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • AI Tools</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">AI Tools for Nepal</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Practical AI tools that actually help Nepali freelancers and students earn more — ChatGPT, Grammarly, Canva, Notion. No hype, just tested workflows for Nepal.
          <span className="block mt-2 text-sm text-amber-700 dark:text-amber-300">TODO: Expand to full pillar in Phase 3. Student content merged here (no separate AI for Students pillar yet).</span>
        </p>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 mb-10 text-sm text-amber-900 dark:text-amber-200">
          <strong>Affiliate disclosure:</strong> Some links are affiliate links (Grammarly, Canva). We may earn a commission at no extra cost to you. <Link href="/disclaimer" className="underline">Learn more</Link>.
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Coming in Phase 3 — Topic Cluster</h2>
          <ul>
            <li><strong>Pillar:</strong> This page (AI Tools ultimate guide for Nepal)</li>
            <li><Link href="/blog/best-ai-writing-tools-nepal-grammarly-chatgpt">Best AI writing tools: Grammarly vs ChatGPT for Nepali freelancers</Link> — <code>AFFILIATE_LINK_GRAMMARLY</code> <em>TODO</em></li>
            <li>ChatGPT prompts for freelancers in Nepal <em>TODO</em></li>
            <li>AI image tools: Canva for Nepal <em>TODO AFFILIATE_LINK_CANVA</em></li>
            <li>AI productivity stack: Notion for Nepal <em>TODO #TODO-affiliate</em></li>
            <li>Is AI allowed in university in Nepal? Ethical guide <em>TODO — merged student content</em></li>
          </ul>
          <p className="text-sm text-slate-500">All supporting articles will link back here and to each other. Status: draft stubs with TODO markers.</p>
          <p><Link href="/resources" className="text-indigo-600 dark:text-indigo-400 font-bold underline">See Resources →</Link> • <Link href="/" className="underline">Back home</Link></p>
        </div>
      </div>
    </main>
  );
}
