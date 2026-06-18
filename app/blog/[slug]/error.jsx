'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function BlogArticleError({ error, reset }) {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition">
      <div className="max-w-2xl mx-auto px-6 text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
          Something went wrong
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
          We encountered an error while loading this dispatch. 
          It might be a temporary network issue or the article may need attention.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="btn btn-primary px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="btn btn-secondary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Feed
          </Link>
        </div>

        {error?.message && (
          <details className="mt-10 text-left max-w-md mx-auto">
            <summary className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
              Technical Details
            </summary>
            <pre className="mt-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto border border-slate-200 dark:border-slate-800">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}