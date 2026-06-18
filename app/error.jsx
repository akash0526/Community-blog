'use client';

import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 mb-8">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Critical Error
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
            The application encountered a critical error. 
            Our team has been notified automatically.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="btn btn-primary px-7 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="btn btn-secondary px-7 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {error?.message && (
            <details className="mt-12 text-left">
              <summary className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300">
                Error Details
              </summary>
              <pre className="mt-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto border border-slate-200 dark:border-slate-800">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}