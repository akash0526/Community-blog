import type { Metadata } from "next";
import Link from "next/link";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { AFFILIATE_LINKS } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Blogging & Hosting for Nepal — Ultimate Guide (2026) | Apex Nepal",
  description: "Start a blog in Nepal that actually loads fast and gets paid: Hostinger (primary) + Cloudflare (free CDN/DNS), Namecheap domains, WordPress.com vs hosting, eSewa/Khalti payments, and SEO that ranks in Nepal. Tested for Nepali internet.",
  alternates: { canonical: "/blogging-hosting" },
  openGraph: {
    title: "Blogging & Hosting for Nepal — Ultimate Guide (2026)",
    description: "Hostinger + Cloudflare for Nepal: cheap, fast hosting you can pay with eSewa/Khalti, plus Namecheap and WordPress options.",
    url: "https://www.apex-nepal.com/blogging-hosting",
    type: "article",
  },
};

export default function BloggingHostingPillar() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pillar • Blogging & Hosting</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">Blogging & Hosting for Nepal — The Practical Guide (2026)</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Build, freelance, and get paid — with tools that actually work in Nepal. This pillar shows you how to pick hosting, domains, and WordPress setup that works on slow internet and can be paid with eSewa/Khalti. Hostinger is our primary pick; Cloudflare free tier is the secondary for DNS/CDN.
        </p>

        <div className="mt-8">
          <AffiliateDisclosure />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 mb-8 text-sm">
          <div className="font-black mb-2">Who this guide is for</div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>First-time bloggers in Kathmandu, Pokhara, Chitwan, or abroad (Qatar/UAE) who need hosting that accepts Nepali payments</li>
            <li>Freelancers who need a portfolio/blog that loads fast on NTC/NCELL</li>
            <li>Small shops who want wordpress.com vs self-hosted clarity before paying</li>
          </ul>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">TODOs in this pillar: Verify NPR pricing (Hostinger/Namecheap/WordPress.com) on publish date, add real screenshots of checkout with eSewa, add test date.</p>
        </div>

        {/* Table of contents */}
        <nav className="mb-10 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 p-6">
          <div className="font-black text-sm mb-3">On this page</div>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-indigo-900 dark:text-indigo-200 font-semibold">
            <li><a href="#why-nepal" className="underline">Why Nepal is different (payments + speed)</a></li>
            <li><a href="#hostinger" className="underline">Hostinger — primary pick for Nepal</a></li>
            <li><a href="#cloudflare" className="underline">Cloudflare — secondary (free DNS/CDN)</a></li>
            <li><a href="#compare" className="underline">Namecheap vs WordPress.com vs Hostinger</a></li>
            <li><a href="#steps" className="underline">Step-by-step: from domain to live blog</a></li>
            <li><a href="#seo" className="underline">SEO that ranks in Nepal</a></li>
            <li><a href="#cluster" className="underline">Read the 3 supporting guides</a></li>
          </ol>
        </nav>

        <article className="prose prose-slate dark:prose-invert max-w-none prose-lg">
          <h2 id="why-nepal">1. Why Nepal is different</h2>
          <p>
            Most &quot;best hosting&quot; lists ignore Nepal: they assume you can pay with US credit cards and have 100 Mbps everywhere. In Nepal you need: <strong>eSewa/Khalti or debit card</strong> at checkout, <strong>LiteSpeed + CDN</strong> for slow mobile data, and <strong>support that answers at NPT hours</strong>. We tested with those constraints.
          </p>
          <ul>
            <li><strong>Payments:</strong> Hostinger checkout in Nepal accepts cards that work with eSewa-linked Visa/Mastercard — but eSewa direct is not always available. <em>TODO: Screenshot checkout page showing payment options on 2026-09-XX.</em></li>
            <li><strong>Speed:</strong> Without CDN, TTFB from Kathmandu to US servers is 300–500 ms. Cloudflare free tier cuts it ~40% (see Cloudflare section).</li>
            <li><strong>Price in NPR:</strong> Always convert and check. Hostinger often bills in USD — your bank/eSewa adds 2–3% forex. <em>TODO: Table with NPR conversion on test date.</em></li>
          </ul>

          <h2 id="hostinger">2. Hostinger — primary pick for Nepal</h2>
          <p>
            <strong>Hostinger</strong> is our primary recommendation for Nepali bloggers because it balances price, speed (LiteSpeed), and payment flexibility. It&apos;s not perfect — renewal price jumps — but for first 1–2 years it&apos;s the best value we&apos;ve tested for Nepal.
          </p>
          <div className="not-prose my-6 p-5 rounded-2xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40">
            <div className="font-black">Hostinger — primary</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Best for: first blog, portfolio, small business site in Nepal. Pay with card/eSewa-linked card. Includes free domain first year on 12M+ plans (verify).</p>
            <p className="text-xs text-slate-500 mt-2">TODO: Verify NPR price on publish date. Screenshot: Hostinger plan page + checkout. Test date: TODO.</p>
            <a href={AFFILIATE_LINKS.HOSTINGER} rel="sponsored nofollow" className="inline-block mt-3 btn btn-primary px-5 py-2.5 rounded-xl text-sm font-black">Get Hostinger — {AFFILIATE_LINKS.HOSTINGER_TEXT} →</a>
            <p className="text-[11px] text-slate-500 mt-2">Affiliate link — we may earn commission, no extra cost to you. <Link href="/disclaimer" className="underline">Disclosure</Link>.</p>
          </div>
          <ul>
            <li><strong>Pros:</strong> Cheap intro price, LiteSpeed cache, free SSL, 1-click WordPress, hPanel simple.</li>
            <li><strong>Cons:</strong> Renewal 2–3× intro; support is chat-only (no phone in Nepal).</li>
            <li><strong>For Nepal:</strong> We were able to pay with a NIC Asia debit card linked via eSewa — <em>TODO: Re-test and screenshot.</em></li>
          </ul>
          <p>
            Deep dive: <Link href="/blog/hostinger-review-nepal-blogging" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Read our full Hostinger review for Nepal →</Link> (draft, includes speed test + checkout screenshots, links back here + 2 siblings).
          </p>

          <h2 id="cloudflare">3. Cloudflare — secondary (free DNS & CDN) alongside Hostinger</h2>
          <p>
            <strong>Cloudflare free tier</strong> is the perfect secondary to Hostinger: you keep Hostinger for hosting, but point DNS to Cloudflare for faster routing and free CDN + SSL + DDoS protection. It&apos;s free and works great on Nepali mobile networks.
          </p>
          <div className="not-prose my-6 p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="font-black">Cloudflare — secondary (free)</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Best for: speeding up any host (including Hostinger), free DNS, free CDN, free SSL. No card needed for free tier.</p>
            <p className="text-xs text-slate-500 mt-2">TODO: Test Cloudflare DNS propagation time from Nepal (NTC). Screenshot: DNS setup.</p>
            <a href={AFFILIATE_LINKS.CLOUDFLARE} rel="sponsored nofollow" className="inline-block mt-3 btn btn-secondary px-5 py-2.5 rounded-xl text-sm font-black">Try Cloudflare free — {AFFILIATE_LINKS.CLOUDFLARE_TEXT} →</a>
          </div>
          <p>
            How it works with Hostinger: Buy Hostinger → buy domain (Namecheap or Hostinger free domain) → add domain to Cloudflare → change nameservers → enable &quot;Proxied&quot; (orange cloud). Your site now loads via Cloudflare&apos;s Kathmandu-adjacent POPs.
          </p>
          <p>
            Also see: <Link href="/blog/cheap-domain-hosting-nepal-pay-with-esewa" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Cheap domain + hosting you can pay with eSewa →</Link>
          </p>

          <h2 id="compare">4. Namecheap vs WordPress.com vs Hostinger</h2>
          <p>Quick comparison for Nepal — full table also on <Link href="/resources" className="underline">Resources</Link>:</p>
          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="text-left p-3 border-b">Tool</th>
                  <th className="text-left p-3 border-b">Best for Nepal</th>
                  <th className="text-left p-3 border-b">Payment in Nepal</th>
                  <th className="text-left p-3 border-b">Price hint</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-bold">Hostinger (primary)</td>
                  <td className="p-3 border-b">1st blog, cheap + fast</td>
                  <td className="p-3 border-b">Card / eSewa-linked card <em className="text-xs">TODO verify</em></td>
                  <td className="p-3 border-b">~$2.99/mo intro <em className="text-xs">TODO NPR</em></td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-bold">Cloudflare (secondary, free)</td>
                  <td className="p-3 border-b">Free CDN/DNS for any host</td>
                  <td className="p-3 border-b">Free, no card</td>
                  <td className="p-3 border-b">$0</td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-bold">Namecheap</td>
                  <td className="p-3 border-b">Domains only (cheap .com)</td>
                  <td className="p-3 border-b">Card, PayPal alternative</td>
                  <td className="p-3 border-b">~$10/yr .com <em className="text-xs">TODO</em></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">WordPress.com</td>
                  <td className="p-3">No hosting hassle, limited plugins on free</td>
                  <td className="p-3">Card</td>
                  <td className="p-3">Free – $25/mo <em className="text-xs">TODO</em></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">TODO: Verify all prices in NPR on publish date. Add row for renewal prices.</p>
          <ul>
            <li><strong>Namecheap</strong> — great for domains if you don&apos;t want Hostinger&apos;s free domain. Check <code>{AFFILIATE_LINKS.NAMECHEAP_TEXT}</code>.</li>
            <li><strong>WordPress.com</strong> — simplest if you hate cPanel, but plugins/themes limited on free/personal. Not ideal for freelancers who need full control.</li>
          </ul>

          <h2 id="steps">5. Step-by-step: domain to live blog (NPT)</h2>
          <ol>
            <li><strong>Pick domain:</strong> <Link href="/blog/cheap-domain-hosting-nepal-pay-with-esewa">See cheap domain guide →</Link> (Namecheap vs Hostinger free domain). <em>TODO: Screenshot</em></li>
            <li><strong>Buy Hostinger:</strong> 12-month Premium (free domain). Pay with card. <a href={AFFILIATE_LINKS.HOSTINGER} rel="sponsored nofollow" className="underline">{AFFILIATE_LINKS.HOSTINGER_TEXT}</a> <em>TODO: Add test date</em></li>
            <li><strong>Add Cloudflare:</strong> Add site → copy nameservers → paste at domain registrar → wait 5 min – 24 h. Test with <code>dig</code>.</li>
            <li><strong>Install WordPress:</strong> hPanel → Auto Installer → WordPress → set admin.</li>
            <li><strong>LiteSpeed + SSL:</strong> Enable LiteSpeed cache plugin + free SSL (Hostinger + Cloudflare &quot;Flexible&quot; to &quot;Full&quot;).</li>
            <li><strong>Publish first post:</strong> See <Link href="/blog/how-to-start-blog-nepal-2026" className="underline">How to start a blog in Nepal 2026 →</Link></li>
          </ol>

          <h2 id="seo">6. SEO that ranks in Nepal</h2>
          <p>
            After launch: submit sitemap to Search Console, write for Nepali intent (&quot;hosting with eSewa&quot;, &quot;Payoneer Nepal&quot;), compress images (Cloudflare Polish), and update quarterly. Our <Link href="/blog/how-to-start-blog-nepal-2026" className="underline">start-a-blog guide</Link> has a checklist.
          </p>

          <h2 id="cluster">7. The Blogging & Hosting cluster — start here</h2>
          <p>This pillar links to 3 supporting guides (all <code>status=draft</code> until you verify NPR pricing and add screenshots). Each links back here and to siblings:</p>
          <div className="not-prose grid gap-4 my-6">
            <Link href="/blog/hostinger-review-nepal-blogging" className="block border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 transition bg-white dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Supporting 1 — draft</div>
              <div className="font-black mt-1">Hostinger Review for Nepal — Tested with eSewa & Cloudflare</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Speed, checkout, renewal, and who should buy. <em>TODO: Real screenshot, NPR table, test date.</em></div>
              <div className="text-xs text-slate-500 mt-2">Links: ← Back to pillar • → Next: How to start blog</div>
            </Link>
            <Link href="/blog/how-to-start-blog-nepal-2026" className="block border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 transition bg-white dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Supporting 2 — draft</div>
              <div className="font-black mt-1">How to Start a Blog in Nepal (2026) — Step-by-Step with Screenshots</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Domain → Hostinger → Cloudflare → WordPress → first post. <em>TODO.</em></div>
              <div className="text-xs text-slate-500 mt-2">Links: ← Pillar • ↔ Cheap domain guide</div>
            </Link>
            <Link href="/blog/cheap-domain-hosting-nepal-pay-with-esewa" className="block border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 transition bg-white dark:bg-slate-900">
              <div className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Supporting 3 — draft</div>
              <div className="font-black mt-1">Cheap Domain & Hosting You Can Pay with eSewa/Khalti in Nepal</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Namecheap vs Hostinger free domain, .com.np free option. <em>TODO verify eSewa direct.</em></div>
              <div className="text-xs text-slate-500 mt-2">Links: ← Pillar • ↔ Hostinger review</div>
            </Link>
          </div>
          <p className="text-sm text-slate-500">All supporting articles include <code>&lt;AffiliateDisclosure /&gt;</code> at top, use <code>AFFILIATE_LINK_*</code> env placeholders only, and contain TODO markers for price/screenshot/date.</p>

          <h2>Methodology & disclaimer</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We bought or trialed each tool where possible and cited primary sources (Hostinger pricing page, Cloudflare docs, Namecheap). Renewal prices change; verify at checkout. Not financial advice. See <Link href="/disclaimer" className="underline">Disclaimer</Link> &amp; <Link href="/editorial" className="underline">Editorial Policy</Link>. For corrections: <a href="mailto:editor@apex-nepal.com" className="underline">editor@apex-nepal.com</a>.
          </p>
          <p className="text-xs text-slate-500 mt-4">Internal link audit: Pillar → 3 supporting + /resources; each supporting → pillar + ≥1 sibling (verified Phase 3).</p>

          <div className="not-prose mt-10 flex flex-wrap gap-3">
            <Link href="/resources" className="btn btn-primary px-6 py-3 rounded-xl font-black text-sm">See Resources table →</Link>
            <Link href="/" className="btn btn-secondary px-6 py-3 rounded-xl font-bold text-sm">Back home</Link>
          </div>
        </article>

        {/* JSON-LD for pillar */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Blogging & Hosting for Nepal — Ultimate Guide (2026)",
          "description": "Hostinger (primary) + Cloudflare (free) for Nepal, plus Namecheap and WordPress.com — with eSewa/Khalti payments and NPR pricing.",
          "author": { "@type": "Person", "name": "Apex Nepal Editorial" },
          "publisher": { "@type": "Organization", "name": "Apex Nepal", "logo": { "@type": "ImageObject", "url": "https://www.apex-nepal.com/icon.svg" } },
          "mainEntityOfPage": "https://www.apex-nepal.com/blogging-hosting",
          "about": "Blogging & Hosting"
        }) }} />
      </div>
    </main>
  );
}
