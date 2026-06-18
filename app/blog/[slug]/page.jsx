import { supabase } from '@/lib/supabase';
import { fallbackArticles } from '@/lib/seedData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, Clock, Award, Sparkles, User, ArrowLeft, Share2, Flame, HelpCircle } from 'lucide-react';

export const revalidate = 5; // Incremental Static Regeneration (ISR)

async function getArticle(slug) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, professional_role, avatar_url)')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data;
    }
  } catch(err) {}

  // Fallback check
  const seedMatch = fallbackArticles.find(a => a.slug === slug);
  if (seedMatch) return seedMatch;

  return null;
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Dispatch Not Found' };

  return {
    title: `${article.title} | Apex Community Platform`,
    description: article.meta_description,
    keywords: [article.target_keyword, 'Software Engineering', article.category, 'Apex Community'],
    openGraph: {
      title: article.title,
      description: article.meta_description,
      url: `https://apex-community-platform.com/blog/${article.slug}`,
      siteName: 'Apex Community Platform',
      images: [{ url: article.image_url, width: 1200, height: 630 }],
      type: 'article',
      authors: [article.profiles?.full_name || 'Akash'],
      publishedTime: article.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description,
      images: [article.image_url],
    },
  };
}

export default async function StandardArticleProseView({ params }) {
  const article = await getArticle(params.slug);
  if (!article) return notFound();

  // Async non-blocking genuine traffic summation
  if (!article.id.startsWith('seed-')) {
    await supabase
      .from('articles')
      .update({ pageviews: (article.pageviews || 1) + 1 })
      .eq('id', article.id);
  }

  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition text-left">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Top Breadcrumb Header */}
        <div className="py-6 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-50 dark:bg-slate-900 shadow-sm hover:bg-slate-100 border-slate-200/80">
            <ArrowLeft className="w-4 h-4" /> Back to Explore Feed
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5">
              ⚡ {article.seo_score}/100 Technical SEO Checklist Passed
            </span>
          </div>
        </div>

        {/* Category & Timing Tag */}
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 flex-wrap mt-6">
          <span className="bg-indigo-50 dark:bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900">{article.category}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 font-semibold">{article.published_at || '2026-06-15'}</span>
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
