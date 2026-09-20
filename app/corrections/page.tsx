import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corrections – Apex",
  description: "Public corrections log for Apex. Transparency builds trust.",
  alternates: { canonical: "/corrections" },
};

const corrections: Array<{date:string, article:string, slug:string, what:string}> = [
  // Example entry – remove/replace with real ones
  // {date: "2026-07-07", article: "How to Send Money Home from Qatar…", slug: "how-to-send-money-home-from-qatar-the-5-cheapest-apps-tested-in-2026", what: "Removed fake AI Reach Score badges site-wide. Updated author byline to real profile. Added QCB license citations."}
];

export default function CorrectionsPage(){
  return (
    <div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <h1 className="text-4xl font-black mb-4">Corrections</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-10">We publish every substantive fix. Verified errors are corrected within 24 hours. &nbsp; <Link href="/editorial" className="underline text-indigo-600 dark:text-indigo-400 font-bold">Editorial Policy</Link></p>

        {corrections.length === 0 ? (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-slate-50 dark:bg-slate-900">
            <p className="font-bold mb-2">No corrections logged yet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This log launched in July 2026 as part of our Trust &amp; Credibility rebuild. Future corrections will appear here with date, article, and exactly what changed.</p>
            <p className="text-sm mt-4">Found an error? <a href="mailto:editor@apex-nepal.com" className="text-indigo-600 dark:text-indigo-400 font-bold underline">editor@apex-nepal.com</a></p>
          </div>
        ) : (
          <ul className="space-y-6">
            {corrections.map((c,i)=>(
              <li key={i} className="border-l-4 border-amber-500 pl-5 py-2">
                <div className="text-xs font-black text-slate-500">{c.date}</div>
                <div className="font-bold"><Link href={`/blog/${c.slug}`} className="text-indigo-600 dark:text-indigo-400 underline">{c.article}</Link></div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{c.what}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 text-sm text-slate-500">
          <p>Correction policy: substantive factual errors get an inline correction note in the article + an entry here. Typos / grammar fixes are not logged.</p>
        </div>
      </div>
    </div>
  );
}
