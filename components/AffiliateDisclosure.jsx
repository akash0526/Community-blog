"use client";

import Link from "next/link";

/**
 * Reusable affiliate disclosure — use at top of any post/page with affiliate links.
 * Spec: amber left border, light bg, small text, link to /disclaimer.
 * Usage: <AffiliateDisclosure />  or  <AffiliateDisclosure compact />
 */
export default function AffiliateDisclosure({ compact = false }) {
  if (compact) {
    return (
      <aside className="mb-6 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <strong>Affiliate disclosure:</strong> Some links are affiliate links. If you buy, we may earn a commission at no extra cost to you.{" "}
        <Link href="/disclaimer" className="underline font-bold">
          Learn more
        </Link>
        .
      </aside>
    );
  }
  return (
    <aside className="mb-8 rounded-2xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-5 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
      <div className="font-black text-amber-800 dark:text-amber-300 mb-1">Affiliate disclosure</div>
      <p>
        Apex Nepal is reader-supported. Some links on this page are affiliate links (e.g., Hostinger, Grammarly, Canva).
        If you click and purchase, we may earn a commission at no extra cost to you. We only recommend tools we&apos;ve tested.
        Affiliate IDs are stored in <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded text-xs">NEXT_PUBLIC_AFFILIATE_*</code> env vars — currently placeholders like <code>AFFILIATE_LINK_HOSTINGER</code>.
        See our <Link href="/disclaimer" className="underline font-bold">Disclaimer</Link> &amp;{" "}
        <Link href="/editorial" className="underline font-bold">
          Editorial Policy
        </Link>
        . We never accept payment to alter results.
      </p>
      <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
        TODO: Verify NPR pricing and add real screenshots before flipping to published.
      </p>
    </aside>
  );
}
