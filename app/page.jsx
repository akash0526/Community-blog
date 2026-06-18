import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { fallbackArticles } from '@/lib/seedData';
import { Eye, Clock, Sparkles, Flame, Search, Award } from 'lucide-react';

export const revalidate = 10; // Incremental Static Regeneration (ISR) every 10 seconds

export default async function HomepageExplore() {
  // Try fetching canonical live dispatches from Supabase Cloud
  let articles = [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name, professional_role, avatar_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      articles = data;
    } else {
      articles = fallbackArticles;
    }
  } catch(err) {
    articles = fallbackArticles;
  }

  // Identify featured leader piece
  const featuredLeader = articles[0] || fallbackArticles[0];
  const regularLedger = articles.slice(1);

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Universal Introductory Hero Deck */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl mb-12 relative overflow-hidden border border-slate-800 text-left">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE MULTI-USER COMMUNITY LEDGER
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/30">
                ⚡ 2026 Definitive Edition
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
              Write Extreme SEO Articles. <br />
              <span className="bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                Rank on Google Instantly.
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl leading-relaxed font-normal">
              Welcome to the open developer ecosystem. Draft your engineering architecture guides, verify your structure using our Real-Time 100-Point Technical SEO Checklist, and drop live to our global audience with robust server-rendered metadata.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/studio" className="btn btn-primary px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-indigo-600/30 flex items-center gap-2 transform hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
                <span>✍️ Write Your Dispatch Live</span>
              </Link>
              <a href="#community-feed" className="btn btn-secondary text-white bg-white/5 border-slate-700 hover:border-slate-500 px-7 py-4 rounded-2xl font-extrabold text-base">
                Explore Feed &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Featured Leader Card */}
        <div id="community-feed" className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Flame className="w-7 h-7 text-amber-500 fill-amber-500/20" />
              <span>Top Featured Spotlight Dispatch</span>
            </h2>
            <span className="bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-slate-800">
              Verified Technical Dominance
            </span>
          </div>

          <Link 
            href={`/blog/${featuredLeader.slug}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition hover:shadow-indigo-500/10 group flex flex-col lg:flex-row text-left"
          >
            {/* Featured Media */}
            <div className="lg:w-1/2 h-72 lg:h-auto bg-cover bg-center relative overflow-hidden flex-shrink-0" style={{ backgroundImage: `url('${featuredLeader.image_url}')` }}>
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                {featuredLeader.category}
              </div>
              <div className="absolute bottom-4 left-4 bg-slate-950/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-slate-800">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>⚡ {featuredLeader.seo_score}/100 Verified Technical SEO Score</span>
              </div>
            </div>

            {/* Featured Prose */}
            <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{featuredLeader.published_at}</span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {featuredLeader.pageviews.toLocaleString()} Pageview Hits
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {featuredLeader.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 text-base line-clamp-3 mb-8 leading-relaxed font-normal">
                  {featuredLeader.meta_description}
                </p>
              </div>

              {/* Author Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={featuredLeader.profiles?.avatar_url || 'https://avatars.githubusercontent.com/akash0526'} alt="Author" className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{featuredLeader.profiles?.full_name || 'Akash'}</div>
                    <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{featuredLeader.profiles?.professional_role || 'Software Architect'}</div>
                  </div>
                </div>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition flex items-center gap-1">
                  Read Deep Dive &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Categories Bar & Active Ledger Grid */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {["All Feed", "Tech & AI", "Startups & Growth", "SEO Strategy"].map((cat, idx) => (
              <button 
                key={cat}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                  idx === 0 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-black scale-105' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-80">
            <span className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search active dispatches, exact keywords..." 
              className="input pl-11 text-xs sm:text-sm font-bold rounded-2xl py-3.5 bg-white dark:bg-slate-900 dark:text-white dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Regular Community Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {regularLedger.map((art) => (
            <Link 
              key={art.id} 
              href={`/blog/${art.slug}`}
              className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition group flex flex-col justify-between h-full"
            >
              {/* Media Card */}
              <div className="h-56 bg-cover bg-center relative overflow-hidden flex-shrink-0" style={{ backgroundImage: `url('${art.image_url}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                  {art.category}
                </div>
                
                <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1 shadow-md" title="Technical SEO Score Checklist Passed">
                  ⚡ {art.seo_score} SEO Score
                </div>
              </div>

              {/* Prose Card */}
              <div className="p-7 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.published_at}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {art.pageviews.toLocaleString()} hits
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {art.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-8 leading-relaxed font-normal">
                    {art.meta_description}
                  </p>
                </div>

                {/* Attribution Foot */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img src={art.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Dev'} alt="Author" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {art.profiles?.full_name || 'Community Dev'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition flex items-center gap-1 whitespace-nowrap">
                    Read Dispatch &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
