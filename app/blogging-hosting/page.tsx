import type { Metadata } from "next";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Blogging & Hosting for Nepal — Ultimate Guide (2026) | Apex Nepal",
  description:
    "Start a blog in Nepal that actually loads fast and gets paid: Hostinger (primary) + Cloudflare, Namecheap domains, eSewa/Khalti payments, and SEO that ranks in Nepal. Honest guides coming soon.",
  alternates: { canonical: "/blogging-hosting" },
  openGraph: {
    title: "Blogging & Hosting for Nepal — Ultimate Guide (2026)",
    description:
      "Hostinger + Cloudflare for Nepal, Namecheap domains, and SEO that ranks — honest guides coming soon.",
    url: "https://www.apex-nepal.com/blogging-hosting",
    type: "article",
  },
};

export default function BloggingHostingPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Pillar • Blogging & Hosting
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">
          Blogging & Hosting for Nepal
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          We&apos;re writing honest, tested guides for Nepali bloggers — how to pick hosting and domains that work
          on slow internet and can be paid with eSewa/Khalti, and how to set up WordPress so it actually ranks. No
          fluff, no fake screenshots — real checkout tests from Kathmandu.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="text-lg font-black mb-3">Coming soon</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            I&apos;m writing these one at a time — each with real NPR pricing, checkout screenshots, and test dates.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>Hostinger for Nepal — honest review (speed, payments, renewal in NPR)</li>
            <li>How to start a blog in Nepal (2026) — step-by-step with screenshots</li>
            <li>Cheap domain & hosting you can pay with eSewa/Khalti</li>
            <li>Cloudflare free CDN for Nepal — does it actually help on NTC?</li>
            <li>WordPress.com vs self-hosted for Nepali freelancers</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            No affiliate links on this page yet. When guides go live, any affiliate link will be clearly disclosed.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
          <h3 className="font-black">Get notified when this guide is live</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            One email when the first Blogging & Hosting article publishes. No spam.
          </p>
          <SubscribeForm category="blogging-hosting" />
          <p className="text-[11px] text-slate-500 mt-3">
            Placeholder form — stores locally for now. Wire to Supabase <code>subscribers</code> table when ready.
          </p>
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
