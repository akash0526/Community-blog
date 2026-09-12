import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Freelancing in Nepal — Start Freelancing on Upwork & Fiverr (2026)",
  description:
    "How to start freelancing in Nepal: Upwork, Fiverr, profile tips, getting first clients, PAN/taxes, and niches that work from Nepal. Honest, tested guides coming soon.",
  alternates: { canonical: "/freelancing-in-nepal" },
};

export default function FreelancingPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pillar • Freelancing in Nepal
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Freelancing in Nepal</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Zero-to-first-client guides for Nepalis — whether you&apos;re in Kathmandu, Pokhara, or working from
          Qatar/UAE. We&apos;re writing honest, step-by-step walkthroughs for profiles, proposals, and payments
          that work in Nepal.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-black mb-3">Coming soon</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>How to start freelancing in Nepal — Upwork vs Fiverr in 2026</li>
            <li>Profile bio examples that get clicks (with templates)</li>
            <li>How to get your first client with no experience</li>
            <li>Freelancing taxes in Nepal — PAN, invoicing, and basics</li>
            <li>Best niches for Nepali freelancers in 2026</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">No affiliate links here yet.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
          <h3 className="font-black">Get notified</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When the first freelancing guide is live.</p>
          <SubscribeForm category="freelancing-in-nepal" />
          <p className="text-[11px] text-slate-500 mt-3">Placeholder form — wire to Supabase when ready.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/resources" className="underline font-bold">
            See Resources →
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/digital-payments" className="underline">
            Next: Digital Payments →
          </Link>
        </div>
      </div>
    </main>
  );
}
