import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Apex Nepal",
  description: "Apex Nepal helps Nepali freelancers, students, and small businesses earn more with AI and digital tools. Learn who we are, why we exist, and how we help Nepalis in Nepal & abroad.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">About Apex Nepal</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">Helping Nepalis earn more with AI & digital tools.</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Apex Nepal is a practical guide for Nepali freelancers, students, and small businesses — in Nepal and abroad — who want to earn more online without the fluff.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
          <h2>What we do</h2>
          <p>
            We cover <strong>5 focused topics</strong> Nepalis actually search for:
          </p>
          <ul>
            <li><strong>AI Tools</strong> — ChatGPT, Grammarly, Canva, Notion, and how to use them ethically for writing, studying, and client work. <em>AI for Students is now inside AI Tools</em> — no separate section until we have 5+ student-specific guides.</li>
            <li><strong>Freelancing in Nepal</strong> — Upwork, Fiverr, profiles, getting first clients, PAN/tax basics, and niches that work from Nepal.</li>
            <li><strong>Blogging & Hosting</strong> — starting a blog with Hostinger/WordPress, domains, cheap hosting you can pay with eSewa/Khalti, and SEO that ranks in Nepal.</li>
            <li><strong>Digital Payments</strong> — Payoneer vs Wise, PayPal alternatives, eSewa/Khalti for bloggers, NPR fees and withdrawal limits. <em>TODO: verify all fees in NPR before publishing.</em></li>
            <li><strong>Small Business Tools</strong> — free POS/billing, Canva for marketing, WhatsApp Business, Google Business Profile for Kathmandu shops.</li>
          </ul>
          <p>
            Find our curated recommendations on <Link href="/resources" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Resources</Link> — always with a clear affiliate disclosure. We use placeholder links like <code>AFFILIATE_LINK_HOSTINGER</code> and env vars <code>NEXT_PUBLIC_AFFILIATE_*</code> until real affiliate IDs are approved.
          </p>

          <h2>Who it’s for</h2>
          <p>
            Nepali freelancers on Upwork/Fiverr, students learning AI without cheating, and small shop owners in Kathmandu, Pokhara, Chitwan, and the diaspora (Qatar, UAE, Malaysia, US/UK) who need payments and hosting that actually work from Nepal.
          </p>
          <p>
            Language: <strong>English primary</strong>, with occasional Nepali phrases where it helps. Full Devanagari translations are a <em>Phase 5 TODO</em> — not now.
          </p>

          <h2>Why we exist</h2>
          <p>
            The web is flooded with AI-generated listicles, fake “earn $10k” promises, and copy-paste hosting reviews that never mention Nepal’s realities (eSewa payment limits, Payoneer KYC, load-shedding internet). 
            Apex Nepal is the opposite: one niche, real authors, cited sources, and honest affiliate disclosures. We test where we can, cite primary sources (regulators, apps, receipts), and show publish + last-updated dates.
          </p>

          <h2>Where we are based</h2>
          <ul>
            <li><strong>Editorial base:</strong> Kathmandu, Nepal (global contributors)</li>
            <li><strong>Community:</strong> Nepalis in Nepal & abroad — freelancers, students, SMBs</li>
            <li><strong>Launched:</strong> November 2025 (rebranded Sept 2026 to AI & Digital Tools for Nepal)</li>
            <li><strong>Domain:</strong> apex-nepal.com — “Nepal” reflects our core community; content is global but Nepal-first</li>
          </ul>

          <h2>Editorial team</h2>
          <div className="not-prose grid sm:grid-cols-2 gap-6 my-8">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900">
              <img src="https://avatars.githubusercontent.com/u/148329502?v=4" alt="Akash Adhikari" className="w-16 h-16 rounded-full mb-3 object-cover" />
              <div className="font-black text-lg">Akash Adhikari</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-2">Founder & Lead Editor</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Full-stack engineer (Next.js / Supabase). Covers AI workflows, freelancing, hosting, and digital payments for Nepal.</p>
              <div className="text-xs mt-3 space-x-3">
                <a href="https://github.com/akash0526" className="text-indigo-600 dark:text-indigo-400 underline font-bold" target="_blank" rel="noopener">GitHub</a>
                <Link href="/authors/akash-adhikari" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Profile →</Link>
              </div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900">
              <div className="w-16 h-16 rounded-full mb-3 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-black text-indigo-700 dark:text-indigo-300 text-xl">AN</div>
              <div className="font-black text-lg">Apex Nepal Contributors</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-2">Verified Freelancers & SMB Owners</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Real Nepali freelancers and business owners. Every byline links to a profile with bio and proof of experience.</p>
              <div className="text-xs mt-3">
                <Link href="/studio" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Apply to write →</Link>
              </div>
            </div>
          </div>

          <h2>How we make money</h2>
          <p>
            Apex Nepal may use affiliate links (Hostinger, Grammarly, Canva first — then Payoneer, Wise, Notion, Daraz as <code>#TODO-affiliate</code>), display ads, and sponsored posts — all clearly labeled with our reusable <code>&lt;AffiliateDisclosure /&gt;</code> component. 
            See our <Link href="/editorial" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Editorial Policy</Link> and 
            <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-bold underline"> financial disclaimer</Link>. 
            We never accept payment to alter test results. Affiliate IDs live in <code>NEXT_PUBLIC_AFFILIATE_*</code> env vars, not hardcoded.
          </p>

          <h2>Our promise for Nepal</h2>
          <ul>
            <li>We mention <strong>eSewa, Khalti, Payoneer, Wise</strong> fees and withdrawal limits in NPR — with a TODO to re-verify before publishing.</li>
            <li>Hosting guides show how to pay from Nepal (eSewa/Khalti/debit card) and what happens on slow internet.</li>
            <li>AI guides teach ethical use — especially for students (no plagiarism, how to cite AI help).</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Email: <a href="mailto:editor@apex-nepal.com" className="font-bold text-indigo-600 dark:text-indigo-400">editor@apex-nepal.com</a><br/>
            Kathmandu, Nepal (global remote)<br/>
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Full contact page →</Link>
          </p>

          <hr className="my-12" />

          <p className="text-sm text-slate-500">
            Mission statement (appears in site footer): <br/>
            <em className="text-slate-700 dark:text-slate-300 font-semibold">“Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools.”</em>
          </p>
          <p className="text-xs text-slate-500 mt-4">
            TODO Phase 5: Full Nepali (Devanagari) versions of pillar pages. For now, English with occasional Nepali phrases.
          </p>
        </div>
      </div>
    </main>
  );
}
