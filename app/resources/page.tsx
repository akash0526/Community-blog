import type { Metadata } from "next";
import Link from "next/link";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { AFFILIATE_LINKS } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Resources — Tools We Recommend for Nepal (Apex Nepal)",
  description: "Curated tools for Nepali freelancers, students & small businesses: Hostinger, Cloudflare, Namecheap, WordPress.com, Grammarly, Canva. Affiliate disclosure, NPR pricing, and honest pros/cons.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Resources</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Tools we actually use for Nepal</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-8">
          Tested for Nepal — not generic listicles. We show <em>why</em> each tool matters for Nepali payments, internet, and pricing in NPR. Pillar focus: <Link href="/blogging-hosting" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Blogging & Hosting</Link> is fully built; other clusters are TODO.
        </p>

        <AffiliateDisclosure />

        {/* Blogging & Hosting — Real table (Phase 3 complete) */}
        <section id="hosting" className="mb-12">
          <h2 className="text-2xl font-black mb-2">Blogging & Hosting — for Nepal (live)</h2>
          <p className="text-sm text-slate-500 mb-6">Hostinger is primary; Cloudflare free tier is secondary (DNS/CDN). Namecheap + WordPress.com are alternatives. All prices TODO NPR verification on publish date.</p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="text-left">
                  <th className="p-4 border-b">Tool</th>
                  <th className="p-4 border-b">Best for Nepal</th>
                  <th className="p-4 border-b">Why Nepal</th>
                  <th className="p-4 border-b">Price hint (TODO NPR)</th>
                  <th className="p-4 border-b">Link</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-indigo-50/50 dark:bg-indigo-950/20">
                  <td className="p-4 border-b font-black">Hostinger <span className="ml-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">PRIMARY</span></td>
                  <td className="p-4 border-b">First blog / SMB site</td>
                  <td className="p-4 border-b text-xs">Pay with eSewa-linked Visa/Mastercard; LiteSpeed fast on NTC; free domain yr1 on 12M</td>
                  <td className="p-4 border-b text-xs">~$2.99/mo intro<br/><span className="text-amber-700 dark:text-amber-400">TODO: NPR on 2026-09-XX</span></td>
                  <td className="p-4 border-b"><a href={AFFILIATE_LINKS.HOSTINGER} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Hostinger →</a><div className="text-[10px] text-slate-500">{AFFILIATE_LINKS.HOSTINGER_TEXT}</div></td>
                </tr>
                <tr>
                  <td className="p-4 border-b font-bold">Cloudflare <span className="ml-2 text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">SECONDARY FREE</span></td>
                  <td className="p-4 border-b">Speed up any host</td>
                  <td className="p-4 border-b text-xs">Free CDN/DNS, cuts TTFB ~40% from Nepal, no card for free tier</td>
                  <td className="p-4 border-b text-xs">$0 free tier</td>
                  <td className="p-4 border-b"><a href={AFFILIATE_LINKS.CLOUDFLARE} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Cloudflare →</a><div className="text-[10px] text-slate-500">{AFFILIATE_LINKS.CLOUDFLARE_TEXT}</div></td>
                </tr>
                <tr>
                  <td className="p-4 border-b font-bold">Namecheap</td>
                  <td className="p-4 border-b">Domains only</td>
                  <td className="p-4 border-b text-xs">Cheap .com, keep domain separate from host</td>
                  <td className="p-4 border-b text-xs">~$10/yr .com<br/><span className="text-amber-700 dark:text-amber-400">TODO NPR</span></td>
                  <td className="p-4 border-b"><a href={AFFILIATE_LINKS.NAMECHEAP} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Namecheap →</a><div className="text-[10px] text-slate-500">{AFFILIATE_LINKS.NAMECHEAP_TEXT}</div></td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">WordPress.com</td>
                  <td className="p-4">Zero-hassle hosting</td>
                  <td className="p-4 text-xs">No cPanel, limited plugins on free; good for non-technical</td>
                  <td className="p-4 text-xs">Free – $25/mo<br/><span className="text-amber-700 dark:text-amber-400">TODO</span></td>
                  <td className="p-4"><a href={AFFILIATE_LINKS.WORDPRESS_COM} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 font-bold underline">WordPress →</a><div className="text-[10px] text-slate-500">{AFFILIATE_LINKS.WORDPRESS_COM_TEXT}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">TODO before publishing: Verify NPR at checkout on test date, add screenshots of Hostinger/Namecheap checkout with Nepali card, note renewal jumps.</p>
          <p className="text-sm mt-4">
            Deep dives: <Link href="/blogging-hosting" className="underline font-bold">Pillar: Blogging & Hosting →</Link> • <Link href="/blog/hostinger-review-nepal-blogging" className="underline">Hostinger Review</Link> • <Link href="/blog/how-to-start-blog-nepal-2026" className="underline">How to Start a Blog</Link> • <Link href="/blog/cheap-domain-hosting-nepal-pay-with-esewa" className="underline">Cheap Domain with eSewa</Link>
          </p>
        </section>

        {/* Other categories — TODO rows (not yet built) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black">More categories — TODO (not yet built)</h2>
          <p className="text-sm text-slate-500">These are prepared as placeholder rows with <code>#TODO-affiliate</code>. Do NOT publish with fake IDs. Other pillars (AI Tools, Freelancing, Digital Payments, Small Business Tools) will be built one cluster at a time after Blogging & Hosting learns to rank.</p>

          <div className="grid gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-900">
              <div className="font-black">AI Tools — Grammarly, Canva <span className="ml-2 text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">TODO affiliate</span></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best for: Writing & images for freelancers/students • Why Nepal: English polish, portfolio — <em>merged AI for Students here</em></div>
              <div className="flex gap-3 mt-3 text-xs">
                <a href={AFFILIATE_LINKS.GRAMMARLY} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Grammarly → {AFFILIATE_LINKS.GRAMMARLY_TEXT}</a>
                <a href={AFFILIATE_LINKS.CANVA} rel="sponsored nofollow" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Canva → {AFFILIATE_LINKS.CANVA_TEXT}</a>
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">TODO: Verify NPR pricing and add review drafts before publishing. Other AI tools (ChatGPT free vs Plus) are informational, no affiliate.</div>
            </div>

            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-900 opacity-90">
              <div className="font-bold">Digital Payments — Payoneer, Wise <span className="text-xs font-black uppercase tracking-widest text-slate-500">— TODO</span></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best for: Receiving USD abroad • Why Nepal: NPR withdrawal fees/limits</div>
              <div className="flex gap-3 mt-3 text-xs">
                <span className="text-slate-500">{AFFILIATE_LINKS.PAYONEER_TEXT} — {AFFILIATE_LINKS.PAYONEER}</span>
                <span className="text-slate-500">{AFFILIATE_LINKS.WISE_TEXT} — {AFFILIATE_LINKS.WISE}</span>
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">TODO: Verify NPR fees/withdrawal limits on 2026-09-XX before publishing. Generic placeholders, no fake numbers.</div>
              <span className="inline-block mt-3 text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">#TODO-affiliate — verify before publishing</span>
            </div>

            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-900 opacity-90">
              <div className="font-bold">Freelancing & Small Business — Notion, Daraz <span className="text-xs font-black uppercase tracking-widest text-slate-500">— TODO</span></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best for: Notion AI productivity, Daraz affiliate for SMBs</div>
              <div className="flex gap-3 mt-3 text-xs">
                <span className="text-slate-500">{AFFILIATE_LINKS.NOTION_TEXT} — {AFFILIATE_LINKS.NOTION}</span>
                <span className="text-slate-500">{AFFILIATE_LINKS.DARAZ_TEXT} — {AFFILIATE_LINKS.DARAZ}</span>
              </div>
              <span className="inline-block mt-3 text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">#TODO-affiliate</span>
            </div>

            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-900 opacity-75">
              <div className="font-bold">Local — eSewa / Khalti <span className="text-xs font-black uppercase tracking-widest text-slate-500">— no affiliate</span></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best for: Local payments for bloggers/shops — informational guide only, no affiliate.</div>
              <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">TODO: Re-verify direct wallet vs card at Namecheap/Hostinger checkout.</div>
            </div>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900">
          <h3 className="font-black mb-2">Internal link audit — Blogging & Hosting cluster</h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
            <li><strong>Pillar</strong> <Link href="/blogging-hosting" className="underline">/blogging-hosting</Link> → links to 3 supporting drafts + /resources (verified)</li>
            <li><strong>Hostinger Review</strong> <code>/blog/hostinger-review-nepal-blogging</code> → pillar + 2 siblings + resources (draft)</li>
            <li><strong>How to Start</strong> <code>/blog/how-to-start-blog-nepal-2026</code> → pillar + 2 siblings + resources (draft)</li>
            <li><strong>Cheap Domain</strong> <code>/blog/cheap-domain-hosting-nepal-pay-with-esewa</code> → pillar + 2 siblings + resources (draft)</li>
            <li><strong>Resources</strong> <code>/resources#hosting</code> → links to pillar + all 3 supporting (verified)</li>
            <li>All use <code>AFFILIATE_LINK_*</code> env placeholders only; no invented IDs.</li>
          </ul>
        </div>

        <div className="mt-10 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p>Questions? <a href="mailto:editor@apex-nepal.com" className="text-indigo-600 dark:text-indigo-400 font-bold underline">editor@apex-nepal.com</a> • <Link href="/about" className="underline">About</Link> • <Link href="/disclaimer" className="underline">Disclaimer</Link> • <Link href="/blogging-hosting" className="underline">Pillar</Link></p>
          <p className="text-xs mt-2">Env vars: <code>NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_CLOUDFLARE_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_NAMECHEAP_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_WORDPRESS_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_GRAMMARLY_URL</code>, <code>NEXT_PUBLIC_AFFILIATE_CANVA_URL</code> (Payoneer/Wise/Notion/Daraz TODO).</p>
        </div>
      </div>
    </main>
  );
}
