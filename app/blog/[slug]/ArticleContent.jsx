'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Eye, Clock, ArrowLeft, Sparkles, Award, Bookmark, Share2, Heart, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DiscussionThread from '@/components/DiscussionThread';

export default function ArticleContent({ serverArticle, slug }) {
  const [article, setArticle] = useState(serverArticle);
  const [loading, setLoading] = useState(!serverArticle);
  const router = useRouter();

  // Social & Reaction States
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [claps, setClaps] = useState(serverArticle?.claps || 0);
  const [clapping, setClapping] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    const decodedSlug = decodeURIComponent(slug);

    // If the server didn't find it, try localStorage (articles published by demo creators)
    if (!serverArticle) {
      try {
        const stored = JSON.parse(localStorage.getItem('apex_articles_v1') || '[]');
        const localArticle = stored.find(a => decodeURIComponent(a.slug || "") === decodedSlug);
        if (localArticle) {
          setArticle(localArticle);
          if (localArticle.claps) setClaps(localArticle.claps);
        }
      } catch (e) {
        console.warn('Could not read local fallback articles:', e);
      }
    }

    // Check existing reading list bookmarks and creator follows
    try {
      const bms = JSON.parse(localStorage.getItem('apex_bookmarks_v1') || '[]');
      if (bms.some(b => decodeURIComponent(b.slug || "") === decodedSlug)) setBookmarked(true);

      const creatorName = serverArticle?.profiles?.full_name || "Community Storyteller";
      const fols = JSON.parse(localStorage.getItem('apex_following_v1') || '[]');
      if (fols.includes(creatorName)) setFollowing(true);
    } catch(e) {}

    setLoading(false);
  }, [serverArticle, slug]);

  const handleToggleBookmark = () => {
    const decodedSlug = decodeURIComponent(slug);
    try {
      const bms = JSON.parse(localStorage.getItem('apex_bookmarks_v1') || '[]');
      const exists = bms.some(b => decodeURIComponent(b.slug || "") === decodedSlug);
      if (exists) {
        const filtered = bms.filter(b => decodeURIComponent(b.slug || "") !== decodedSlug);
        localStorage.setItem('apex_bookmarks_v1', JSON.stringify(filtered));
        setBookmarked(false);
      } else {
        if (article) {
          bms.unshift(article);
          localStorage.setItem('apex_bookmarks_v1', JSON.stringify(bms));
          setBookmarked(true);
        }
      }
    } catch(e) {}
  };

  const handleToggleFollow = () => {
    const creatorName = article?.profiles?.full_name || "Community Storyteller";
    try {
      const fols = JSON.parse(localStorage.getItem('apex_following_v1') || '[]');
      const exists = fols.includes(creatorName);
      if (exists) {
        const filtered = fols.filter(f => f !== creatorName);
        localStorage.setItem('apex_following_v1', JSON.stringify(filtered));
        setFollowing(false);
      } else {
        fols.push(creatorName);
        localStorage.setItem('apex_following_v1', JSON.stringify(fols));
        setFollowing(true);
      }
    } catch(e) {}
  };

  const handleClap = async () => {
    setClaps(prev => prev + 1);
    setClapping(true);
    setTimeout(() => setClapping(false), 800);

    if (article && !article.id?.startsWith('seed-') && !article.id?.startsWith('post-')) {
      try {
        await supabase.rpc('increment_claps', { article_id: article.id });
      } catch(e) {}
    } else if (article) {
      article.claps = (article.claps || 0) + 1;
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Story Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-3 max-w-md mx-auto leading-relaxed">
            This story doesn&apos;t exist or may have been removed.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
            Want to craft a story on this topic? Head to the Studio and drop your piece live!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-secondary px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Explore Feed
            </Link>
            <Link href="/studio" className="btn btn-primary px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Write Your Story
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isLocalArticle = article.id?.startsWith('post-');

  // Custom Eye-Catching ReactMarkdown Renderers
  const customMarkdownComponents = {
    h1: ({ children }) => <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-12 mb-6 tracking-tight leading-tight">{children}</h1>,
    h2: ({ children }) => (
      <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-16 mb-6 pb-3 border-b-2 border-indigo-500/30 tracking-tight">
        <span className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex-shrink-0 shadow-md"></span>
        <span>{children}</span>
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-10 mb-4 tracking-tight flex items-center gap-2 font-sans">⚡ {children}</h3>,
    p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-normal leading-relaxed mb-7 sm:mb-8 tracking-wide font-sans">{children}</p>,
    blockquote: ({ children }) => (
      <div className="my-10 p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-50 dark:from-indigo-950/50 dark:to-slate-900/40 border-l-4 border-indigo-600 dark:border-indigo-400 text-slate-800 dark:text-slate-200 font-serif italic text-lg sm:text-xl leading-relaxed shadow-sm relative overflow-hidden">
        <span className="absolute -top-4 right-6 text-7xl sm:text-9xl text-indigo-500/10 font-serif font-black pointer-events-none">“</span>
        {children}
      </div>
    ),
    ul: ({ children }) => <ul className="list-none space-y-4 my-8 pl-1 sm:pl-2 text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-normal">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-4 my-8 pl-2 sm:pl-4 text-slate-700 dark:text-slate-300 text-lg sm:text-xl font-bold marker:text-indigo-600 dark:marker:text-indigo-400 font-sans">{children}</ol>,
    li: ({ children }) => (
      <li className="flex items-start gap-3.5 leading-relaxed font-sans">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-3 flex-shrink-0 shadow-sm animate-pulse"></span>
        <span className="flex-1 font-normal text-slate-700 dark:text-slate-300">{children}</span>
      </li>
    ),
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-extrabold underline decoration-indigo-300 dark:decoration-indigo-800 hover:decoration-indigo-600 dark:hover:decoration-indigo-400 transition cursor-pointer">
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <figure className="my-12 text-center">
        <img src={src} alt={alt} className="w-full h-auto max-h-[600px] object-cover rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transition transform hover:scale-[1.01] duration-500" />
        {alt && <figcaption className="text-xs font-extrabold text-slate-400 mt-3 italic">📸 {alt}</figcaption>}
      </figure>
    ),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      if (!inline) {
        return (
          <div className="my-10 rounded-3xl bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-sm shadow-2xl border border-slate-800 overflow-hidden text-left group">
            {/* Master Mac-Style Terminal Window Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-rose-500 hover:opacity-80 transition cursor-pointer"></span>
                <span className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-amber-500 hover:opacity-80 transition cursor-pointer"></span>
                <span className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-emerald-500 hover:opacity-80 transition cursor-pointer"></span>
                <span className="font-extrabold text-slate-400 font-sans ml-3 uppercase tracking-wider text-[11px] bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                  ⚡ {match ? match[1] : 'Code Script'}
                </span>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  navigator.clipboard?.writeText(codeString);
                  e.currentTarget.innerText = "✓ Copied Flawlessly!";
                  setTimeout(() => e.currentTarget.innerText = "📋 Copy Script", 2500);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs shadow-sm"
              >
                <span>📋 Copy Script</span>
              </button>
            </div>
            {/* Terminal Body */}
            <div className="p-7 sm:p-8 overflow-x-auto leading-relaxed">
              <pre className="!my-0 font-mono text-sm sm:text-base text-slate-200 font-normal">
                <code>{children}</code>
              </pre>
            </div>
          </div>
        );
      }

      return (
        <code className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-pink-300 font-mono text-sm sm:text-base font-extrabold border border-indigo-100 dark:border-indigo-900/80 shadow-inner" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-32 pt-8 transition text-left">
      <div className="max-w-4xl mx-auto px-6">

        {/* Top Navigation Deck */}
        <div className="py-6 mb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <Link href="/" className="btn btn-secondary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 bg-slate-50 dark:bg-slate-900 shadow-sm hover:bg-slate-100 border-slate-200/80">
            <ArrowLeft className="w-4 h-4" /> Back to Explore Feed
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>⚡ {article.seo_score}/100 AI Reach Score Verified</span>
            </span>
            {isLocalArticle && (
              <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                📍 Local Draft
              </span>
            )}
          </div>
        </div>

        {/* Premium Eye-Catching Immersive Story Header Deck */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl my-8 relative overflow-hidden border border-slate-800 text-left">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Category Pill & Pacing */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-300 mb-6 flex-wrap">
              <span className="bg-indigo-500/20 text-indigo-300 font-black px-4 py-1.5 rounded-full border border-indigo-500/30 shadow-inner flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{article.category}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-semibold">{article.published_at || 'Just now'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 5 min deep immersion
              </span>
            </div>

            {/* Headline Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight sm:leading-none mb-8 tracking-tight break-words">
              {article.title}
            </h1>

            {/* Summary description subtitle */}
            <p className="text-slate-300 text-base sm:text-xl max-w-3xl leading-relaxed font-normal mb-0 border-l-2 border-indigo-500 pl-4 py-1">
              {article.meta_description}
            </p>
          </div>
        </div>

        {/* Featured Media Showcase */}
        {article.image_url && (
          <div className="my-10 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group flex-shrink-0 bg-slate-900">
            <img src={article.image_url} alt={article.title} className="w-full h-72 sm:h-[520px] object-cover transition transform group-hover:scale-105 duration-700 flex-shrink-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-6 sm:p-8 flex-wrap gap-4">
              <span className="text-white text-xs sm:text-sm font-black tracking-widest uppercase bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-xl">
                ✨ Spectacular Showcase
              </span>
              <span className="text-slate-400 text-xs font-extrabold self-center hidden sm:inline">
                Hover to magnify
              </span>
            </div>
          </div>
        )}

        {/* Community Author Attribution Bio Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-7 px-8 rounded-3xl bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md my-12 transition hover:shadow-xl">
          <div className="flex items-center gap-4 min-w-0">
            <img src={article.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + article.id} alt="Avatar" className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover shadow-xl border-2 border-indigo-500/30 dark:border-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-black text-slate-900 dark:text-white text-lg sm:text-xl truncate flex items-center gap-3 flex-wrap">
                <span>{article.profiles?.full_name || 'Community Storyteller'}</span>
                
                {/* Fast Follow Trigger */}
                <button 
                  type="button"
                  onClick={handleToggleFollow}
                  className={`px-3.5 py-1 rounded-full text-xs font-black transition cursor-pointer border shadow-md flex items-center gap-1 ${following ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500 hover:scale-105 transform shadow-indigo-500/25'}`}
                >
                  {following ? <><Check className="w-3 h-3 stroke-[3]" /> Following</> : "➕ Follow"}
                </button>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">{article.profiles?.professional_role || 'Creator & Thought Leader'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-black text-slate-500 dark:text-slate-400 sm:ml-auto flex-wrap">
            <span className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" /> {(article.pageviews || 1).toLocaleString()} Authentic Hits
            </span>
            <span className="bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-black flex items-center gap-1 shadow-md">
              ⚡ Full SSR
            </span>
          </div>
        </div>

        {/* Sticky Floating Social Reaction Deck */}
        <div className="sticky top-24 z-30 my-8 py-3.5 px-6 rounded-3xl bg-slate-900/95 text-white backdrop-blur-md border border-slate-800 shadow-2xl flex items-center justify-between gap-4 transition flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              type="button"
              onClick={handleClap}
              className={`btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border transition cursor-pointer ${clapping ? 'bg-amber-400 text-slate-950 scale-110 border-amber-500 shadow-xl shadow-amber-400/30 font-extrabold' : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/5'}`}
            >
              <span className="text-base">👏</span>
              <span className="font-mono text-sm">{claps}</span>
              <span className="hidden sm:inline font-bold">Applause</span>
            </button>

            <a 
              href="#discussion-thread"
              className="btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-100 border border-white/5 transition"
            >
              <span className="text-base">💬</span>
              <span className="hidden sm:inline">Join Thread</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button 
              type="button"
              onClick={handleToggleBookmark}
              className={`btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${bookmarked ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/5'}`}
              title={bookmarked ? "Saved to Reading List" : "Bookmark Story"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-white' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? "Saved" : "Bookmark"}</span>
            </button>

            <button 
              type="button"
              onClick={handleShare}
              className="btn px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-100 border border-white/5 transition cursor-pointer relative shadow-sm"
              title="Copy Canonical Link"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Share Link</span>
              {shareToast && (
                <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-slate-950 text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-2xl whitespace-nowrap animate-fadeIn pointer-events-none border border-slate-200">
                  ⚡ Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Master Standardized Premium Custom Markdown Rendered Layout */}
        <article className="max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal text-lg sm:text-xl space-y-6 break-words my-10 font-sans">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={customMarkdownComponents}>
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Interactive Multi-User Comments Stream Deck */}
        <DiscussionThread articleSlug={decodeURIComponent(slug)} />

        {/* Multi-User CTA Box */}
        <div className="mt-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/30 inline-block mb-3">
              ⚡ Open Digital Community
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">Enjoyed this definitive perspective?</h3>
            <p className="text-slate-300 text-sm mb-0">Whether you are writing personal life reflections, philosophy, culinary guides, or tech architectures, our real-time AI Reach Assistant helps you polish your structure and launch to our global audience.</p>
          </div>

          <Link href="/studio" className="btn btn-primary px-8 py-4 rounded-2xl font-black text-sm w-full md:w-auto text-center justify-center shadow-xl shadow-indigo-600/30 transform hover:scale-105 transition flex-shrink-0">
            ✍️ Write Your Story Live &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}
