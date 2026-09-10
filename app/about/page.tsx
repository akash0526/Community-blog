import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Apex",
  description: "Apex is an open global publishing platform where independent writers share tested, cited stories. Learn who we are, why we exist, and how we work.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">About Apex</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-6">Open stories from around the world.</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Apex is an open global publishing platform where independent writers share tested, cited stories.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
          <h2>Who runs this site</h2>
          <p>
            Apex is operated by an independent editorial team based in Doha, Qatar, with contributors worldwide. 
            The project was founded in 2025 by <strong>Akash Adhikari</strong>, a full-stack developer and community publisher, 
            to create a trustworthy, multi-author space for practical guides, personal stories, and cultural reporting.
          </p>

          <h2>Why we exist</h2>
          <p>
            The web is flooded with AI-generated content farms, fake review sites, and copy-paste SEO spam. 
            Apex was built as the opposite: a human-first publishing ledger where every article lists a real author, 
            cites real sources, and shows when it was last updated.
          </p>
          <p>
            We started covering Qatar / Doha expat life and Nepali community news because that is where our founding editors live. 
            Today Apex is a <strong>global blog</strong> – we publish tested guides, personal essays, tech architecture, 
            food, travel, and cultural commentary from writers anywhere in the world.
          </p>

          <h2>Where we are based</h2>
          <ul>
            <li><strong>Editorial base:</strong> Doha, Qatar</li>
            <li><strong>Founding community:</strong> Nepal & Qatar • Open to verified writers worldwide</li>
            <li><strong>Launched:</strong> November 2025</li>
            <li><strong>Domain:</strong> apex-nepal.com – “Nepal” reflects our founding community roots, the platform is global</li>
          </ul>

          <h2>Editorial team</h2>
          <div className="not-prose grid sm:grid-cols-2 gap-6 my-8">
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900">
              <img src="https://avatars.githubusercontent.com/u/148329502?v=4" alt="Akash Adhikari" className="w-16 h-16 rounded-full mb-3 object-cover" />
              <div className="font-black text-lg">Akash Adhikari</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-2">Founder & Lead Editor</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Full-stack engineer (Next.js / Supabase). Covers remittance tech, Qatar expat guides, and platform engineering.</p>
              <div className="text-xs mt-3 space-x-3">
                <a href="https://github.com/akash0526" className="text-indigo-600 dark:text-indigo-400 underline font-bold" target="_blank" rel="noopener">GitHub</a>
                <Link href="/authors/akash-adhikari" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Profile →</Link>
              </div>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-900">
              <div className="w-16 h-16 rounded-full mb-3 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-black text-indigo-700 dark:text-indigo-300 text-xl">AC</div>
              <div className="font-black text-lg">Apex Contributors</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-2">Global Community Writers</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Verified independent authors. Every byline links to a real profile with bio, credentials, and social links.</p>
              <div className="text-xs mt-3">
                <Link href="/studio" className="text-indigo-600 dark:text-indigo-400 underline font-bold">Apply to write →</Link>
              </div>
            </div>
          </div>

          <h2>How we make money</h2>
          <p>
            Apex may use affiliate links, display ads, and sponsored posts – all clearly labeled. 
            See our <Link href="/editorial" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Editorial Policy</Link> and 
            <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-bold underline"> financial disclaimer</Link>. 
            We never accept payment to alter test results.
          </p>

          <h2>Contact</h2>
          <p>
            Email: <a href="mailto:editor@apex-nepal.com" className="font-bold text-indigo-600 dark:text-indigo-400">editor@apex-nepal.com</a><br/>
            Doha, Qatar<br/>
            <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Full contact page →</Link>
          </p>

          <hr className="my-12" />

          <p className="text-sm text-slate-500">
            Mission statement (appears in site footer): <br/>
            <em className="text-slate-700 dark:text-slate-300 font-semibold">“Apex is an open global publishing platform where independent writers share tested, cited stories.”</em>
          </p>
        </div>
      </div>
    </main>
  );
}
