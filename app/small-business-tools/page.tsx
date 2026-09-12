import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Small Business Tools for Nepal — POS, Canva, WhatsApp & Google (2026)",
  description:
    "Tools for Nepali small businesses: free POS/billing, Canva marketing, WhatsApp Business catalog, Google Business Profile. Grow without big budget. Guides coming soon.",
  alternates: { canonical: "/small-business-tools" },
};

export default function SmallBusinessPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pillar • Small Business Tools
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Small Business Tools</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          For Kathmandu shops to Pokhara startups — free and cheap tools that actually work in Nepal. We&apos;re
          preparing practical, step-by-step guides you can use without a big budget.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-black mb-3">Coming soon</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>Free POS / billing tools for retail in Nepal</li>
            <li>Canva for business marketing — templates that work</li>
            <li>WhatsApp Business catalog setup for Nepali shops</li>
            <li>Google Business Profile for Nepal — get found on Maps</li>
            <li>Simple accounting — Bahi Khata and alternatives</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">No affiliate links on this page yet.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
          <h3 className="font-black">Get notified</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When the first small-business guide is live.</p>
          <SubscribeForm category="small-business-tools" />
          <p className="text-[11px] text-slate-500 mt-3">Placeholder form — wire to Supabase when ready.</p>
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
