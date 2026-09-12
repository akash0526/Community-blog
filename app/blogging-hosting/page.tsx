import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogging & Hosting for Nepal — Hostinger & WordPress Guide (2026)",
  description: "Start a blog in Nepal: Hostinger review for Nepal, WordPress vs static, cheap domains you can pay with eSewa/Khalti, and SEO that ranks in Nepal.",
  alternates: { canonical: "/blogging-hosting" },
};

export default function BloggingHostingPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • Blogging & Hosting</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Blogging & Hosting</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
          From Hostinger to WordPress on slow internet — hosting that works from Nepal, paid with eSewa/Khalti.
          <span className="block mt-2 text-sm text-amber-700 dark:text-amber-300">TODO: Full pillar + affiliate disclosure in Phase 3.</span>
        </p>
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-5 py-4 mb-10 text-sm text-amber-900 dark:text-amber-200">
          <strong>Affiliate disclosure:</strong> Hostinger links are affiliate (<code>AFFILIATE_LINK_HOSTINGER</code> via <code>NEXT_PUBLIC_AFFILIATE_HOSTINGER_ID</code>). <Link href="/disclaimer" className="underline">Learn more</Link>.
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Coming in Phase 3</h2>
          <ul>
            <li>Pillar: This page</li>
            <li>Hostinger review for Nepali bloggers — <code>AFFILIATE_LINK_HOSTINGER</code> <em>TODO</em></li>
            <li>How to start a blog in Nepal 2026 <em>TODO</em></li>
            <li>Cheap domain + hosting you can pay with eSewa <em>TODO</em></li>
            <li>WordPress vs static hosting in Nepal <em>TODO</em></li>
            <li>Blog SEO checklist for Nepal <em>TODO</em></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
