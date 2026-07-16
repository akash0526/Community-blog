-- Performance index for paginated article queries.
-- Covers the homepage, API route, and sitemap: filters by status, sorts by created_at DESC.
-- The partial index only includes published rows, keeping it small and fast.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_published_recent
  ON articles (created_at DESC)
  WHERE status = 'published';
