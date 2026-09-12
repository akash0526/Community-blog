import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "AI Tools for Nepal — Best AI Tools for Freelancers & Students (2026)",
  description:
    "Best AI tools for Nepali freelancers and students: ChatGPT, Grammarly, Canva, Notion. Practical, tested guides — prompts, workflows, and pricing in NPR. Coming soon.",
  alternates: { canonical: "/ai-tools" },
};

export default function AIToolsPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pillar • AI Tools
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">AI Tools for Nepal</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Practical AI tools that help Nepali freelancers and students earn more — not hype. We&apos;re testing
          ChatGPT, Grammarly, Canva, and Notion for real workflows in Nepal and will share prompts, pricing in
          NPR, and honest pros/cons.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-black mb-3">Coming soon</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>Best AI writing tools for Nepal — Grammarly vs ChatGPT for freelancers</li>
            <li>ChatGPT prompts for Nepali freelancers that actually get clients</li>
            <li>Canva AI for Nepal — designs that sell</li>
            <li>Notion AI productivity stack for students</li>
            <li>Is AI allowed in Nepali universities? An ethical guide</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">No affiliate links on this page yet. Disclosure will be clear when guides go live.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
          <h3 className="font-black">Get notified</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            One email when the first AI Tools guide publishes.
          </p>
          <SubscribeForm category="ai-tools" />
          <p className="text-[11px] text-slate-500 mt-3">Placeholder — stores locally. Wire to Supabase when you add a subscribers table.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/resources" className="underline font-bold">
            See Resources →
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/" className="underline">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
