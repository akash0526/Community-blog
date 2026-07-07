"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { storyCategoryValues } from "@/lib/categories";

function cleanTitle(title){
  if(!title) return "";
  // strip “Slug: ...” leak that was appearing in titles
  return String(title).replace(/\s*Slug:.*$/i, '').trim();
}

function avatarUrl(art){
  const raw = art.profiles?.avatar_url || "";
  if(!raw || raw.includes('dicebear') || raw.includes('bottts')){
    const name = encodeURIComponent(art.profiles?.full_name || 'Apex');
    return `https://ui-avatars.com/api/?name=${name}&background=4f46e5&color=fff&size=128`;
  }
  return raw;
}

export default function CommunityFeed({ initialArticles = [] }) {
  const [localArticles, setLocalArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
      const existing = new Set(initialArticles.map(a => a.slug));
      const uniqueLocal = (stored || []).filter(
        l => l.status === "published" && !existing.has(l.slug)
      );
      setLocalArticles(uniqueLocal);
    } catch {}
  }, [initialArticles]);

  const articles = useMemo(() => [...localArticles, ...initialArticles], [localArticles, initialArticles]);

  const categories = useMemo(() => {
    const set = new Set(["All", ...storyCategoryValues]);
    articles.forEach(a => { if(a.category) set.add(a.category) });
    return Array.from(set);
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter(art => {
      const catMatch = selectedCategory === "All" || art.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const searchMatch = !q ||
        art.title?.toLowerCase().includes(q) ||
        art.meta_description?.toLowerCase().includes(q) ||
        art.profiles?.full_name?.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div id="feed" className="scroll-mt-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-wrap gap-2">
          {categories.slice(0,12).map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={()=>setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${active 
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            placeholder="Search stories…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
          {searchQuery && (
            <button onClick={()=>setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-400 text-sm">✕</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="font-black text-lg mb-2">No stories found</p>
          <p className="text-sm text-slate-500 mb-4">Try a different category or search term.</p>
          <button onClick={()=>{setSearchQuery(""); setSelectedCategory("All")}} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm underline">Reset filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(art => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col h-full group"
            >
              <div className="h-48 bg-slate-100 dark:bg-slate-800 bg-cover bg-center relative" style={{backgroundImage: `url('${art.image_url}')`}}>
                <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/90 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {art.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-[11px] text-slate-500 mb-2 font-semibold">
                  {art.published_at ? new Date(art.published_at).toLocaleDateString('en-GB', { month:'short', day:'numeric', year:'numeric'}) : 'Recently'}
                  {art.updated_at && art.updated_at !== art.created_at && (
                    <> • Updated {new Date(art.updated_at).toLocaleDateString('en-GB', {month:'short', day:'numeric'})}</>
                  )}
                </div>
                <h3 className="font-black text-[18px] leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                  {cleanTitle(art.title)}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                  {art.meta_description}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <img src={avatarUrl(art)} alt={art.profiles?.full_name || 'Author'} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {art.profiles?.full_name || 'Apex Editorial'}
                  </span>
                  <span className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400">Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
