import { NextRequest, NextResponse } from "next/server";
import { getPaginatedArticles, getPublishedArticleCount } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12", 10), 1), 50);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);
  // Server-side search + category so filtering covers the whole archive,
  // not just the rows already loaded in the browser.
  const q = (searchParams.get("q") || "").slice(0, 100);
  const category = (searchParams.get("category") || "").slice(0, 60);

  const [articles, total] = await Promise.all([
    getPaginatedArticles(limit, offset, { q, category }),
    getPublishedArticleCount({ q, category }),
  ]);

  return NextResponse.json({
    articles,
    hasMore: offset + articles.length < total,
    total,
  });
}
