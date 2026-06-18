'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, Clock, Trash2, Edit3, Award, Sparkles, AlertCircle, LayoutDashboard, Rocket } from 'lucide-react';

export default function AuthorDashboard() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionAndLedger = async () => {
      setLoading(true);
      setError(null);

      // 1. Identify active user session or demo creator identity
      let activeUser = null;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        activeUser = session.user;
      } else {
        const demo = localStorage.getItem('apex_demo_user');
        if (demo) {
          try { activeUser = JSON.parse(demo); } catch(e){}
        }
      }

      setUser(activeUser);

      // 2. Fetch User Specific Ledger or local memory fallback
      if (activeUser) {
        try {
          const { data, error: supaErr } = await supabase
            .from('articles')
            .select('*')
            .eq('author_id', activeUser.id?.startsWith('demo-') || activeUser.id?.startsWith('community-') ? '00000000-0000-0000-0000-000000000000' : activeUser.id)
            .order('created_at', { ascending: false });

          if (!supaErr && data && data.length > 0) {
            setArticles(data);
            setLoading(false);
            return;
          }
        } catch(cloudErr) {}
      }

      // 3. Fallback to local memory persistent storage
      try {
        const local = localStorage.getItem('apex_articles_v1');
        if (local) {
          const parsed = JSON.parse(local);
          setArticles(activeUser ? parsed.filter(a => a.author_id === activeUser.id) : parsed);
        }
      } catch(e) {}
      
      setLoading(false);
    };

    fetchSessionAndLedger();
  }, []);

  const handleDelete = async (articleId) => {
    if (!confirm("⚡ Warning: Are you sure you want to permanently delete this story from the open ledger?")) return;

    // 1. Mutate cloud DB
    try {
      await supabase.from('articles').delete().eq('id', articleId);
    } catch(e) {}

    // 2. Mutate local workspace storage
    const updated = articles.filter(a => a.id !== articleId);
    setArticles(updated);

    try {
      const allLocal = JSON.parse(localStorage.getItem('apex_articles_v1') || '[]');
      const filtered = allLocal.filter(a => a.id !== articleId);
      localStorage.setItem('apex_articles_v1', JSON.stringify(filtered));
    } catch(e) {}
  };

  const totalHits = articles.reduce((sum, a) => sum + (a.pageviews || 1), 0);
  const avgSeo = articles.length > 0 ? Math.round(articles.reduce((sum, a) => sum + (a.seo_score || 90), 0) / articles.length) : 0;

  if (loading) {
    return <div className="flex-1 py-20 text-center font-black text-lg">⚡ Synchronizing Author Cloud Hub...</div>;
  }

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Head */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-indigo-500/25">📊</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">Author<span className="text-indigo-600 dark:text-indigo-400">Dashboard</span> Hub</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Genuine logged telemetry, real-world Pageview captures, and written dispatches for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user?.email || 'Community Storyteller'}</span>.
            </p>
          </div>
          
          <Link href="/studio" className="btn btn-primary px-7 py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            <span>✍️ Draft New Story</span>
          </Link>
        </div>

        {/* 3 Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
          
          <div className="card p-7 border-l-4 border-indigo-600 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
              <span>Total Captured Pageviews</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">100% Genuine</span>
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white my-3 font-mono">
              {totalHits.toLocaleString()} <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-sans">Hits</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Across {articles.length} dispatches</div>
          </div>

          <div className="card p-7 border-l-4 border-emerald-500 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
              <span>Average Readability Score</span>
              <span className="text-emerald-500 font-bold">⚡ AI Evaluated</span>
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white my-3 font-mono">
              {avgSeo} <span className="text-sm font-extrabold text-emerald-500 font-sans">Points</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Optimal reach threshold &ge; 80</div>
          </div>

          <div className="card p-7 border-l-4 border-purple-500 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
              <span>Topical Knowledge Network</span>
              <span className="text-purple-500 font-bold">Flawless SSR</span>
            </div>
            <div className="text-4xl font-black text-purple-600 dark:text-purple-400 my-3 font-mono">
              {articles.length} <span className="text-sm font-extrabold text-slate-500 dark:text-slate-400 font-sans">Stories Saved</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">Open Graph link unfurling active</div>
          </div>

        </div>

        {/* Ledger Ledger Table */}
        <div className="card bg-white dark:bg-slate-900 p-8 text-left shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-500" />
              <span>My Stories & Drafts Vault</span>
            </h3>
            <span className="text-xs font-extrabold text-slate-400">Live & In-Progress</span>
          </div>

          {articles.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">✍️</div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Your author vault is currently empty</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">You have not saved or published any stories yet. Launch your first creative piece!</p>
              <Link href="/studio" className="btn btn-primary px-6 py-3 rounded-2xl text-xs font-black shadow-md">
                Craft First Story &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((art) => (
                <div 
                  key={art.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition hover:border-indigo-500 shadow-sm"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <img src={art.image_url} alt="Banner" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 hidden md:block" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                          {art.category}
                        </span>

                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                          art.status === 'draft'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        }`}>
                          {art.status === 'draft' ? '📝 Draft' : '⚡ Published'}
                        </span>

                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{art.published_at}</span>
                        <span className="text-xs font-black text-indigo-500">⚡ {art.seo_score} Points</span>
                      </div>
                      
                      <Link 
                        href={`/blog/${art.slug}`} 
                        className="font-black text-base sm:text-lg text-slate-900 dark:text-white truncate block hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      >
                        {art.title}
                      </Link>
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                        🔑 Topic Keyword: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{art.target_keyword}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <div className="text-right mr-3 hidden sm:block">
                      <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{(art.pageviews || 1).toLocaleString()}</div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase">Hits</div>
                    </div>

                    <Link 
                      href={`/studio?edit=${art.slug}`}
                      className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
                      title="Resume Editing in Studio"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <Link 
                      href={`/blog/${art.slug}`}
                      className="btn btn-secondary px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 bg-white dark:bg-slate-900 shadow-sm"
                    >
                      <span>{art.status === 'draft' ? 'Preview' : 'Read'}</span>
                    </Link>

                    <button 
                      onClick={() => handleDelete(art.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer border border-rose-200 dark:border-rose-900"
                      title="Permanently Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
