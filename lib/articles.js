// lib/articles.js
// Centralized data-access helpers so sitemap, blog pages, OG images and the
// homepage all fetch articles the same way (DRY + consistent SEO signals).

import { supabase } from "@/lib/supabase";
import { fallbackArticles } from "@/lib/seedData";

/**
 * Canonical site URL.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (especially once you move to a custom domain)
 * so that canonical URLs, the sitemap, OpenGraph and JSON-LD all stay correct.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://community-blog-six.vercel.app"
).replace(/\/$/, "");

/** All published articles, newest first. Falls back to seed data if Supabase is empty/unreachable. */
export async function getAllPublishedArticles() {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*, profiles(full_name, professional_role, avatar_url)")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    // network / env error — fall through to seed fallback
  }
  return fallbackArticles;
}

/** Lightweight list for sitemap generation. Uses select("*") (not explicit
 *  columns) so it never breaks if a column is missing from the live table —
 *  e.g. the schema currently has no `updated_at` column, which previously
 *  made this query fail and dropped ALL live articles from the sitemap. */
export async function getAllPublishedSlugs() {
  const rows = [];
  try {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published");

    if (data) for (const row of data) if (row && row.slug) rows.push(row);
  } catch (err) {
    // ignore — seed rows added below
  }

  // Always include seed articles so the site is never empty for crawlers.
  for (const a of fallbackArticles) {
    rows.push({
      slug: a.slug,
      created_at: a.created_at,
      updated_at: a.created_at,
      published_at: a.published_at,
    });
  }

  // De-duplicate by NFC-normalized slug (avoids Unicode double-listing).
  const seen = new Set();
  return rows.filter((row) => {
    const key = String(row.slug).normalize("NFC");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Robust single-article lookup that survives Nepali / Devanagari Unicode quirks.
 * Strategy: exact match -> fuzzy normalized match across recent published -> seed fallback.
 */
export async function getArticleBySlug(rawSlug) {
  const decodedSlug = decodeURIComponent(rawSlug || "").normalize("NFC");

  // 1. Exact match (Postgres eq). maybeSingle() avoids throwing on zero rows.
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*, profiles(full_name, professional_role, avatar_url)")
      .eq("slug", decodedSlug)
      .maybeSingle();

    if (!error && data) return data;
  } catch (err) {
    // fall through to fuzzy
  }

  // 2. Fuzzy: compare normalized slugs against published articles
  // (handles NFC vs NFD storage differences and stray encoding artifacts).
  try {
    const { data } = await supabase
      .from("articles")
      .select("*, profiles(full_name, professional_role, avatar_url)")
      .eq("status", "published");

    if (data) {
      const match = data.find(
        (a) => String(a.slug || "").normalize("NFC") === decodedSlug,
      );
      if (match) return match;
    }
  } catch (err) {
    // ignore
  }

  // 3. Seed fallback
  const seedMatch = fallbackArticles.find(
    (a) => decodeURIComponent(a.slug).normalize("NFC") === decodedSlug,
  );
  return seedMatch || null;
}
