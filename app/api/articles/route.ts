import { NextRequest, NextResponse } from "next/server";
import { getPaginatedArticles, getPublishedArticleCount, ALLOWED_CATEGORIES } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12", 10), 1), 50);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  // Homepage API — only 5 new pillars, regardless of status.
  // lib/articles already filters by ALLOWED_CATEGORIES; extra filter is defensive (catches stale cache/local).
  const [articlesRaw, total] = await Promise.all([
    getPaginatedArticles(limit, offset),
    getPublishedArticleCount(),
  ]);
  const articles = articlesRaw.filter((a: { category?: string }) => ALLOWED_CATEGORIES.includes(a.category || ""));

  return NextResponse.json({
    articles,
    hasMore: offset + articles.length < total,
    total,
  });
}
