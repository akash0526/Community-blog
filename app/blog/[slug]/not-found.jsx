import Link from 'next/link';
import { FileQuestion, ArrowLeft, Sparkles } from 'lucide-react';

export default function BlogArticleNotFound() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition">
      <div className="max-w-2xl mx-auto px-6 text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 mb-6">
          <FileQuestion className="w-10 h-10 text-amber-500" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
          Dispatch Not Found
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-base mb-3 max-w-md mx-auto leading-relaxed">
          This article doesn&apos;t exist or may have been removed by the author.
        </p>

        <p className="text-slate-400 dark:text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Want to be the first to write on this topic? Head to the Studio and publish your own dispatch!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn btn-secondary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Feed
          </Link>

          <Link
            href="/studio"
            className="btn btn-primary px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Write Your Dispatch
          </Link>
        </div>
      </div>
    </main>
  );
}