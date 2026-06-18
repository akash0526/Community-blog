import { Sparkles } from 'lucide-react';

export default function BlogArticleLoading() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition text-left">
      <div className="max-w-4xl mx-auto px-6">
        {/* Skeleton Breadcrumb */}
        <div className="py-6 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 animate-pulse">
          <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Skeleton Category + Date */}
        <div className="flex items-center gap-3 mb-6 flex-wrap mt-6 animate-pulse">
          <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-4 w-2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>

        {/* Skeleton Title */}
        <div className="space-y-4 mb-10 animate-pulse">
          <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>

        {/* Skeleton Author Bar */}
        <div className="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-12 bg-slate-50/80 dark:bg-slate-900/60 px-8 rounded-3xl animate-pulse">
          <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Skeleton Hero Image */}
        <div className="w-full h-[380px] rounded-3xl mb-14 bg-slate-200 dark:bg-slate-800 animate-pulse" />

        {/* Skeleton Content */}
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-black animate-pulse">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Loading dispatch...</span>
        </div>
      </div>
    </main>
  );
}