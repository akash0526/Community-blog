'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Eye, Clock, ArrowLeft, Sparkles } from 'lucide-react';

export default function ArticleContent({ serverArticle, slug }) {
  const [article, setArticle] = useState(serverArticle);
  const [loading, setLoading] = useState(!serverArticle);
  const router = useRouter();

  useEffect(() => {
    // If the server already found the article, nothing more to do
    if (serverArticle) {
      setLoading(false);
      return;
    }

    // Server didn't find it — try localStorage (articles published by demo users)
    try {
      const stored = JSON.parse(localStorage.getItem('apex_articles_v1') || '[]');
      const localArticle = stored.find(a => a.slug === slug);
      if (localArticle) {
        setArticle(localArticle);
      }
    } catch (e) {
      console.warn('Could not read local articles:', e);
    }

    setLoading(false);
  }, [serverArticle, slug]);

  if (loading) {
    return (
      <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8">
        <div className="max-w-4xl mx-auto px-6 text-center py-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
            <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
            <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8">
        <div className="max-w-2xl mx-auto px-6 text-center py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 mb-6">
            <span className="text-4xl">📄</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Dispatch Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-3 max-w-md mx-auto leading-relaxed">
            This article doesn&apos;t exist or may have been removed.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Want to write on this topic? Head to the Studio and publish your own dispatch!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-secondary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Explore Feed
            </Link>
            <Link href="/studio" className="btn btn-primary px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Write Your Dispatch
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isLocalArticle = article.id?.startsWith('post-');

  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition text-left">
      <div className="max-w-4xl mx-auto px-6">

        {/* Top Breadcrumb Header */}
        <div className="py-6 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <Link href="/" className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-50 dark:bg-slate-900 shadow-sm hover:bg-slate-100 border-slate-200/80">
            <ArrowLeft className="w-4 h-4" /> Back to Explore Feed
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5">
              ⚡ {article.seo_score}/100 Technical SEO Checklist Passed
            </span>
            {isLocalArticle && (
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                📍 Local Draft
              </span>
            )}
          </div>
        </div>

        {/* Category & Timing Tag */}
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 flex-wrap mt-6">
          <span className="bg-indigo-50 dark:bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900">{article.category}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 font-semibold">{article.published_at || 'Just now'}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-10 tracking-tight">
          {article.title}
        </h1>

        {/* Community Author Attribution Bio Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-12 bg-slate-50/80 dark:bg-slate-900/60 px-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <img src={article.profiles?.avatar_url || 'https://avatars.githubusercontent.com/akash0526'} alt="Avatar" className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-700 flex-shrink-0" />
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base">{article.profiles?.full_name || 'Akash'}</div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{article.profiles?.professional_role || 'Software Architect'}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black text-slate-500 dark:text-slate-400 sm:ml-auto">
            <span className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-500" /> {(article.pageviews || 1).toLocaleString()} Genuine Hits
            </span>
            <span className="bg-emerald-500 text-slate-950 px-3.5 py-2 rounded-xl font-black flex items-center gap-1 shadow-md">
              ⚡ Verified SSR
            </span>
          </div>
        </div>

        {/* Featured Media */}
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full h-[380px] sm:h-[480px] object-cover rounded-3xl mb-14 shadow-2xl border border-slate-200 dark:border-slate-800" />
        )}

        {/* Master Standardized Markdown Rendered Layout */}
        <article className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-lg sm:text-xl space-y-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Multi-User CTA Box */}
        <div className="mt-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-10 sm:p-14 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/30 inline-block mb-3">
              ⚡ Open Developer Platform
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">Enjoyed this technical deep dive?</h3>
            <p className="text-slate-300 text-sm mb-0">Write your own technical architecture guides, verify your structure using our 100-point technical checklist, and publish to our global community ledger instantly.</p>
          </div>

          <Link href="/studio" className="btn btn-primary px-8 py-4 rounded-2xl font-black text-sm whitespace-nowrap shadow-xl shadow-indigo-600/30 transform hover:scale-105 transition">
            ✍️ Write Your Dispatch &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}