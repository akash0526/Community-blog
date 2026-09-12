import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Payments for Nepal — Payoneer, Wise, eSewa, Khalti (2026)",
  description: "Digital payments for Nepali freelancers & businesses: Payoneer vs Wise, PayPal alternatives, eSewa/Khalti for bloggers, NPR fees and withdrawal limits. Verify fees before sending.",
  alternates: { canonical: "/digital-payments" },
};

export default function DigitalPaymentsPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • Digital Payments</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Digital Payments</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          Get paid from abroad and in Nepal — Payoneer, Wise, eSewa, Khalti. Real NPR fees, KYC, and withdrawal limits.
          <span className="block mt-2 text-sm text-amber-700 dark:text-amber-300">TODO: Verify all NPR fees & limits before publishing. Treat as generic placeholders.</span>
        </p>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Coming in Phase 3</h2>
          <ul>
            <li>Pillar: This page</li>
            <li>Payoneer vs Wise for Nepali freelancers — <code>#TODO-affiliate</code> <em>TODO verify fees</em></li>
            <li>How to receive “PayPal” in Nepal — alternatives <em>TODO</em></li>
            <li>eSewa/Khalti for bloggers setup <em>TODO</em></li>
            <li>Payoneer fees in NPR: withdrawal limits <em>TODO</em></li>
            <li>Best payment gateway for small business in Nepal <em>TODO</em></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
