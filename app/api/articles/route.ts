import { NextRequest, NextResponse } from "next/server";
import { getPaginatedArticles, getPublishedArticleCount } from "@/lib/articles";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12", 10), 1), 50);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  const [articles, total] = await Promise.all([
    getPaginatedArticles(limit, offset),
    getPublishedArticleCount(),
  ]);

  return NextResponse.json({
    articles,
    hasMore: offset + articles.length < total,
    total,
  });
}
