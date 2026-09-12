import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Digital Payments for Nepal — Payoneer, Wise, eSewa, Khalti (2026)",
  description:
    "Digital payments for Nepali freelancers & businesses: Payoneer vs Wise, PayPal alternatives, eSewa/Khalti setup, NPR fees and withdrawal limits. Verified guides coming soon.",
  alternates: { canonical: "/digital-payments" },
};

export default function DigitalPaymentsPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pillar • Digital Payments
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Digital Payments</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Getting paid from abroad and inside Nepal — without guessing fees. We&apos;re verifying Payoneer, Wise,
          eSewa, and Khalti for Nepali freelancers and small businesses, with real NPR fees and withdrawal limits.
        </p>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-black mb-3">Coming soon</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>Payoneer vs Wise for Nepali freelancers — fees in NPR, verified</li>
            <li>How to receive “PayPal” payments in Nepal — real alternatives</li>
            <li>eSewa / Khalti for bloggers and shops — setup</li>
            <li>Payoneer fees & withdrawal limits in NPR</li>
            <li>Best payment gateway for small business in Nepal</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">No affiliate links on this page yet. Any future link will be disclosed.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
          <h3 className="font-black">Get notified</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">One email when the first payments guide is live.</p>
          <SubscribeForm category="digital-payments" />
          <p className="text-[11px] text-slate-500 mt-3">Placeholder — stores locally. Replace with Supabase insert when ready.</p>
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
