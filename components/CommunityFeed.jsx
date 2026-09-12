"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { storyCategoryValues } from "@/lib/categories";
import ClientDate from "@/components/ClientDate";

const LOAD_MORE_SIZE = 12;

function cleanTitle(title) {
  if (!title) return "";
  return String(title).replace(/\s*Slug:.*$/i, "").trim();
}

function avatarUrl(art) {
  const raw = art.profiles?.avatar_url || "";
  if (!raw || raw.includes("dicebear") || raw.includes("bottts")) {
    const name = encodeURIComponent(art.profiles?.full_name || "Apex");
    return `https://ui-avatars.com/api/?name=${name}&background=4f46e5&color=fff&size=64`;
  }
  return raw;
}

export default function CommunityFeed({ initialArticles = [], hasMore: initialHasMore = false, initialOffset = 0 }) {
  const [mounted, setMounted] = useState(false);
  const [localArticles, setLocalArticles] = useState([]);

  // Mounted pattern: stable placeholder on server, hydrate with client value after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
      const existing = new Set(initialArticles.map((a) => a.slug));
      const locals = (stored || []).filter(
        (l) => l.status === "published" && !existing.has(l.slug) && storyCategoryValues.includes(l.category)
      );
      setLocalArticles(locals);
    } catch {
      setLocalArticles([]);
    }
  }, [mounted, initialArticles]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination state
  const [serverArticles, setServerArticles] = useState(initialArticles);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const articles = useMemo(
    () => [...localArticles, ...serverArticles],
    [localArticles, serverArticles]
  );

  const categories = useMemo(() => {
    const set = new Set(["All", ...storyCategoryValues]);
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((art) => {
      const catMatch = selectedCategory === "All" || art.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const searchMatch =
        !q ||
        art.title?.toLowerCase().includes(q) ||
        art.meta_description?.toLowerCase().includes(q) ||
        art.profiles?.full_name?.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/articles?limit=${LOAD_MORE_SIZE}&offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setServerArticles((prev) => [...prev, ...data.articles]);
          setOffset((prev) => prev + data.articles.length);
          setHasMore(data.hasMore);
        } else {
          setHasMore(false);
        }
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, offset]);

  return (
    <div id="feed" className="scroll-mt-24">
      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 12).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20"
                    : "glass text-slate-700 dark:text-slate-300 hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-200 transition">
              ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="font-black text-lg mb-2">No stories found</p>
          <p className="text-sm text-slate-500 mb-4">Try a different category or search term.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-indigo-600 dark:text-indigo-400 font-bold text-sm underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          {/* Staggered card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {filtered.map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full group card-hover"
              >
                {/* Card image with zoom on hover */}
                <div className="h-48 relative bg-slate-100 dark:bg-slate-800 img-zoom">
                  <Image
                    src={art.image_url || "/icon.svg"}
                    alt={cleanTitle(art.title) || "Story thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover img-zoom-target"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 z-10">
                    {art.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[11px] text-slate-500 mb-2 font-semibold" suppressHydrationWarning>
                    {mounted ? (
                      <>
                        {art.published_at ? (
                          <ClientDate
                            date={art.published_at}
                            options={{ month: "short", day: "numeric", year: "numeric" }}
                            placeholder="—"
                            fallback="Recently"
                          />
                        ) : (
                          "Recently"
                        )}
                        {art.updated_at && art.updated_at !== art.created_at && (
                          <>
                            {" "}
                            • Updated{" "}
                            <ClientDate
                              date={art.updated_at}
                              options={{ month: "short", day: "numeric" }}
                              placeholder=""
                              fallback=""
                            />
                          </>
                        )}
                      </>
                    ) : (
                      // Stable placeholder on server / initial hydration
                      <span>—</span>
                    )}
                  </div>
                  <h3 className="font-black text-[18px] leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 transition-colors duration-300">
                    {cleanTitle(art.title)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {art.meta_description}
                  </p>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    <Image
                      src={avatarUrl(art)}
                      alt={art.profiles?.full_name || "Author"}
                      width={28}
                      height={28}
                      className="rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {art.profiles?.full_name || "Apex Editorial"}
                    </span>
                    <span className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More with gradient border */}
          {hasMore && !searchQuery && selectedCategory === "All" && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="gradient-border btn btn-secondary px-8 py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-white dark:bg-slate-900"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more stories"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
