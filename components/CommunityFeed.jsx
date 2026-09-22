"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconClose, IconSearch, IconSpinner } from "./Icon";
import { cleanExcerpt } from "@/lib/seoUtils";

const LOAD_MORE_SIZE = 12;

function cleanTitle(title) {
  if (!title) return "";
  return String(title).replace(/\s*Slug:.*$/i, "").trim();
}

function avatarUrl(art) {
  const raw = art.profiles?.avatar_url || "";
  if (!raw || raw.includes("dicebear") || raw.includes("bottts")) {
    const name = encodeURIComponent(art.profiles?.full_name || "Apex");
    return `https://ui-avatars.com/api/?name=${name}&background=A8471F&color=fff&size=64`;
  }
  return raw;
}

// Read once during state initialization (never inside an effect) so URL
// filters apply before first paint with no render cascade.
function readUrlFilters() {
  if (typeof window === "undefined") return { q: "", category: "All" };
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      q: (params.get("q") || "").slice(0, 100),
      category: params.get("category") || "All",
    };
  } catch {
    return { q: "", category: "All" };
  }
}

function readLocalPublished(initialArticles) {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem("apex_articles_v1") || "[]");
    const existing = new Set((initialArticles || []).map((a) => a.slug));
    return (stored || []).filter(
      (l) => l.status === "published" && !existing.has(l.slug)
    );
  } catch {
    return [];
  }
}

export default function CommunityFeed({ initialArticles = [], hasMore: initialHasMore = false, initialOffset = 0 }) {
  const [searchQuery, setSearchQuery] = useState(() => readUrlFilters().q);
  const [selectedCategory, setSelectedCategory] = useState(() => readUrlFilters().category);
  const [localArticles] = useState(() => readLocalPublished(initialArticles));

  // Pagination state
  const [serverArticles, setServerArticles] = useState(initialArticles);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtering, setFiltering] = useState(() => {
    const { q, category } = readUrlFilters();
    return Boolean(q.trim() || (category && category !== "All"));
  });

  // Server-side search/filter: whenever q/category changes, query the API so
  // results cover the whole archive (not just rows already in the browser).
  // Also mirrors the state into the URL so filtered views are shareable.
  // All state updates happen inside the debounced async callback — never
  // synchronously in the effect body.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      else params.delete("q");
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      else params.delete("category");
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
      window.history.replaceState(null, "", next);
    } catch {}

    const isDefault = selectedCategory === "All" && !searchQuery.trim();
    const t = setTimeout(async () => {
      if (isDefault) {
        // Back to the default view: restore the server-rendered first page.
        setServerArticles(initialArticles);
        setOffset(initialOffset);
        setHasMore(initialHasMore);
        setFiltering(false);
        return;
      }
      try {
        const apiParams = new URLSearchParams();
        apiParams.set("limit", String(LOAD_MORE_SIZE));
        apiParams.set("offset", "0");
        if (searchQuery.trim()) apiParams.set("q", searchQuery.trim());
        if (selectedCategory !== "All") apiParams.set("category", selectedCategory);
        const res = await fetch(`/api/articles?${apiParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setServerArticles(data.articles || []);
          setOffset((data.articles || []).length);
          setHasMore(Boolean(data.hasMore));
        }
      } catch {
        // Keep previous results on network failure.
      } finally {
        setFiltering(false);
      }
    }, isDefault ? 0 : 350);
    return () => clearTimeout(t);
  }, [searchQuery, selectedCategory, initialArticles, initialOffset, initialHasMore]);

  const articles = useMemo(
    () => [...localArticles, ...serverArticles],
    [localArticles, serverArticles]
  );

  const categories = useMemo(() => {
    const set = new Set(["All"]);
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
        art.target_keyword?.toLowerCase().includes(q) ||
        art.profiles?.full_name?.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const apiParams = new URLSearchParams();
      apiParams.set("limit", String(LOAD_MORE_SIZE));
      apiParams.set("offset", String(offset));
      if (searchQuery.trim()) apiParams.set("q", searchQuery.trim());
      if (selectedCategory !== "All") apiParams.set("category", selectedCategory);
      const res = await fetch(`/api/articles?${apiParams.toString()}`);
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
  }, [loadingMore, hasMore, offset, searchQuery, selectedCategory]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setFiltering(true);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setFiltering(true);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setFiltering(false);
  };

  return (
    <div id="feed" className="scroll-mt-24">
      {/* Filter bar */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[var(--hairline)] pb-5 lg:flex-row lg:items-center">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter stories by category"
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={active}
                className={`pill${active ? " pill--active" : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <IconSearch className="icon pointer-events-none absolute left-3 top-[0.6875rem]" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search stories"
            className="field !pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-[0.4375rem] cursor-pointer p-1 text-[var(--ink-faint)] transition-colors hover:text-[var(--clay)]"
            >
              <IconClose className="icon icon--15" />
            </button>
          )}
        </div>
      </div>

      {filtering ? (
        <div className="cards !mt-0" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="card__media skeleton !rounded-none !border-0" />
              <div className="card__body">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card !p-10">
          <h3 className="mb-2">No stories found</h3>
          <p className="mb-4 text-[0.9375rem] text-[var(--ink-muted)]">
            Try a different category or search term.
          </p>
          <button onClick={handleReset} className="link cursor-pointer">
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="cards !mt-0">
            {filtered.map((art) => (
              <article className="card" key={art.id}>
                <Link
                  href={`/blog/${art.slug}`}
                  className="flex flex-1 flex-col"
                  aria-label={cleanTitle(art.title)}
                >
                  <div className="card__media">
                    <Image
                      src={art.image_url || "/opengraph-image"}
                      alt={cleanTitle(art.title) || "Story thumbnail"}
                      fill
                      quality={60}
                      sizes="(max-width: 860px) 90vw, calc((min(100vw, 1180px) - 136px) / 3)"
                      loading="lazy"
                    />
                  </div>
                  <div className="card__body">
                    <span className="card__tag">{art.category || "Community"}</span>
                    <h3>{cleanTitle(art.title)}</h3>
                    <p>{cleanExcerpt(art.meta_description)}</p>
                    <div className="card__foot">
                      <span>
                        {art.published_at
                          ? new Date(art.published_at).toLocaleDateString("en-GB", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                        {art.updated_at && art.updated_at !== art.created_at && (
                          <>
                            {" · "}Updated{" "}
                            {new Date(art.updated_at).toLocaleDateString("en-GB", {
                              month: "short",
                              day: "numeric",
                            })}
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        <Image
                          src={avatarUrl(art)}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full object-cover"
                        />
                        {art.profiles?.full_name || "Apex Editorial"}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="btn btn--ghost"
              >
                {loadingMore ? (
                  <>
                    <IconSpinner />
                    Loading…
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
