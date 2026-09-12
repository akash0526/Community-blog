-- ============================================================================
-- APEX NEPAL — ARCHIVE OLD QATAR CONTENT (SELECT-FIRST, MANUAL)
-- Date: 2026-09-12
-- Purpose: Hide old off-topic Qatar / legacy categories from public site.
--   Keeps 5 new pillar categories public, archives 13 old categories to draft.
--   Safe mode: SELECT-first verification. UPDATE is COMMENTED-OUT — run manually.
--   No code auto-runs this. You control the deploy via Supabase SQL Editor.
--   See: lib/categories.js (5 new pillars), redirects.csv, next.config.ts
-- Branch: arena/01a09467-community-blog
-- ============================================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor → New Query → Paste this file.
-- 2. Run ONLY the SELECT blocks in Step 1-2 first and review output.
-- 3. Verify counts/slugs. Confirm no new-pillar article is in the archive list.
-- 4. Only AFTER approval, uncomment and run Step 3-4 (backup + archive).
-- 5. Verify with Step 5 SELECTs. Sitemap revalidates in ~1h or via /sitemap.xml.
-- 6. Draft articles are noindex (app/blog/[slug]/page.jsx generateMetadata)
--    and excluded from homepage/category feeds (lib/articles.js).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1 — VERIFICATION: Grouped counts + full lists (READ-ONLY)
-- Run this first. Copy output to your review sheet.
-- ----------------------------------------------------------------------------

-- 1a. Count by category + status (all articles) — grouped overview
SELECT category, status, COUNT(*) AS count
FROM public.articles
GROUP BY category, status
ORDER BY category, status;

-- 1b. Summary: which categories are OLD (13) vs NEW (5 pillars)
-- OLD = to be archived (13)
-- NEW = keep public: 'AI Tools','Freelancing in Nepal','Blogging & Hosting','Digital Payments','Small Business Tools'
SELECT
  CASE
    WHEN category IN ('AI Tools','Freelancing in Nepal','Blogging & Hosting','Digital Payments','Small Business Tools')
    THEN 'KEEP (new pillar)'
    WHEN category IN ('Food & Recipes','Travel & Lifestyle','Personal Stories','Business & Finance','Education & Learning','Health & Wellness','Sports','Entertainment','Opinion & Essays','Philosophy & Culture','Arts & Fiction','News & Current Affairs','Community Updates')
    THEN 'ARCHIVE (old)'
    ELSE 'OTHER (review)'
  END AS bucket,
  category, status, COUNT(*) AS count
FROM public.articles
GROUP BY bucket, category, status
ORDER BY bucket, category, status;

-- 1c. List all slugs for OLD categories (archive candidates) — detailed
SELECT id, slug, title, category, status, created_at, published_at, updated_at
FROM public.articles
WHERE category IN (
  'Food & Recipes',
  'Travel & Lifestyle',
  'Personal Stories',
  'Business & Finance',
  'Education & Learning',
  'Health & Wellness',
  'Sports',
  'Entertainment',
  'Opinion & Essays',
  'Philosophy & Culture',
  'Arts & Fiction',
  'News & Current Affairs',
  'Community Updates'
)
ORDER BY category, created_at DESC;

-- 1d. List all slugs for NEW categories (should stay published) — sanity check
SELECT id, slug, title, category, status, created_at, published_at
FROM public.articles
WHERE category IN (
  'AI Tools',
  'Freelancing in Nepal',
  'Blogging & Hosting',
  'Digital Payments',
  'Small Business Tools'
)
ORDER BY category, created_at DESC;

-- 1e. Catch stray / OTHER categories not in either list (review manually)
SELECT id, slug, title, category, status
FROM public.articles
WHERE category NOT IN (
  'AI Tools','Freelancing in Nepal','Blogging & Hosting','Digital Payments','Small Business Tools',
  'Food & Recipes','Travel & Lifestyle','Personal Stories','Business & Finance','Education & Learning','Health & Wellness','Sports','Entertainment','Opinion & Essays','Philosophy & Culture','Arts & Fiction','News & Current Affairs','Community Updates'
)
ORDER BY category, created_at DESC;

-- ----------------------------------------------------------------------------
-- STEP 2 — GENERATE EXACT REDIRECT MAP (READ-ONLY)
-- Export this, verify, then paste exact rows into redirects.csv.
-- Generic fallback is in next.config.ts query-param redirects.
-- ----------------------------------------------------------------------------
SELECT
  slug,
  category,
  '/blog/' || slug AS old_url,
  CASE
    WHEN category = 'Food & Recipes' THEN '/resources'
    WHEN category = 'Travel & Lifestyle' THEN '/'
    WHEN category = 'Personal Stories' THEN '/about'
    WHEN category = 'Business & Finance' THEN '/'  -- Qatar finance → homepage
    WHEN category = 'Education & Learning' THEN '/digital-payments'  -- Qatar money transfer
    ELSE '/'  -- Everything else → homepage
  END AS new_url,
  '301' AS status,
  category || ' → ' ||
  CASE
    WHEN category = 'Food & Recipes' THEN 'Resources'
    WHEN category = 'Travel & Lifestyle' THEN 'Homepage'
    WHEN category = 'Personal Stories' THEN 'About'
    WHEN category = 'Business & Finance' THEN 'Homepage (Qatar)'
    WHEN category = 'Education & Learning' THEN 'Digital Payments'
    ELSE 'Homepage (archive)'
  END AS reason
FROM public.articles
WHERE category IN (
  'Food & Recipes',
  'Travel & Lifestyle',
  'Personal Stories',
  'Business & Finance',
  'Education & Learning',
  'Health & Wellness',
  'Sports',
  'Entertainment',
  'Opinion & Essays',
  'Philosophy & Culture',
  'Arts & Fiction',
  'News & Current Affairs',
  'Community Updates'
)
ORDER BY category, created_at DESC;

-- Query-param redirect coverage check (what next.config.ts handles):
-- SELECT category, COUNT(*) FROM public.articles
-- WHERE category IN ('Food & Recipes','Travel & Lifestyle','Personal Stories','Business & Finance','Education & Learning')
-- GROUP BY category;

-- ----------------------------------------------------------------------------
-- STEP 3 — BACKUP (UNCOMMENT ONLY AFTER STEP 1-2 VERIFICATION)
-- Creates timestamped backup. Does NOT modify live data.
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS public.articles_backup_20260912 AS
-- SELECT * FROM public.articles;

-- Verify backup counts match live
-- SELECT COUNT(*) AS backup_count FROM public.articles_backup_20260912;
-- SELECT COUNT(*) AS live_count FROM public.articles;
-- SELECT category, status, COUNT(*) FROM public.articles_backup_20260912 GROUP BY category, status ORDER BY category;

-- ----------------------------------------------------------------------------
-- STEP 4 — ARCHIVE OLD CONTENT (COMMENTED-OUT — UNCOMMENT ONLY AFTER APPROVAL)
-- Sets status='draft' + updated_at=NOW() so posts become noindex & excluded
-- from sitemap/homepage. Does NOT DELETE. Reversible via backup.
-- NOTE: Do NOT auto-run on deploy — manual verification required.
-- ----------------------------------------------------------------------------
-- -- Archive all 13 old categories in one statement
-- UPDATE public.articles
-- SET status = 'draft', updated_at = NOW()
-- WHERE category IN (
--   'Food & Recipes',
--   'Travel & Lifestyle',
--   'Personal Stories',
--   'Business & Finance',
--   'Education & Learning',
--   'Health & Wellness',
--   'Sports',
--   'Entertainment',
--   'Opinion & Essays',
--   'Philosophy & Culture',
--   'Arts & Fiction',
--   'News & Current Affairs',
--   'Community Updates'
-- )
-- AND status = 'published';

-- -- Alternative: per-category archives (same effect, easier to audit per line)
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Food & Recipes' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Travel & Lifestyle' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Personal Stories' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Business & Finance' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Education & Learning' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Health & Wellness' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Sports' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Entertainment' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Opinion & Essays' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Philosophy & Culture' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Arts & Fiction' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='News & Current Affairs' AND status='published';
-- -- UPDATE public.articles SET status='draft', updated_at=NOW() WHERE category='Community Updates' AND status='published';

-- ----------------------------------------------------------------------------
-- STEP 5 — POST-MIGRATION VERIFICATION (AFTER ARCHIVE — UNCOMMENT TO RUN)
-- ----------------------------------------------------------------------------
-- SELECT category, status, COUNT(*) FROM public.articles GROUP BY category, status ORDER BY category, status;
-- SELECT slug, category, status, updated_at FROM public.articles WHERE status='draft' ORDER BY updated_at DESC LIMIT 30;
-- SELECT COUNT(*) AS published_new_pillars FROM public.articles WHERE status='published' AND category IN ('AI Tools','Freelancing in Nepal','Blogging & Hosting','Digital Payments','Small Business Tools');
-- SELECT COUNT(*) AS published_old_remaining FROM public.articles WHERE status='published' AND category IN ('Food & Recipes','Travel & Lifestyle','Personal Stories','Business & Finance','Education & Learning','Health & Wellness','Sports','Entertainment','Opinion & Essays','Philosophy & Culture','Arts & Fiction','News & Current Affairs','Community Updates');

-- ----------------------------------------------------------------------------
-- STEP 6 — ROLLBACK (IF NEEDED — COMMENTED-OUT)
-- ----------------------------------------------------------------------------
-- -- Restore single category:
-- -- UPDATE public.articles SET status='published' WHERE id IN (SELECT id FROM public.articles_backup_20260912 WHERE category='Food & Recipes' AND status='published');
--
-- -- Full restore (careful — overwrites new posts after backup!):
-- -- INSERT INTO public.articles SELECT * FROM public.articles_backup_20260912 ON CONFLICT (id) DO NOTHING;
-- -- UPDATE public.articles SET status = b.status, updated_at = b.updated_at FROM public.articles_backup_20260912 b WHERE public.articles.id = b.id AND b.category IN ('Food & Recipes','Travel & Lifestyle','Personal Stories','Business & Finance','Education & Learning','Health & Wellness','Sports','Entertainment','Opinion & Essays','Philosophy & Culture','Arts & Fiction','News & Current Affairs','Community Updates');

-- End of migration. Robots noindex is handled in app/blog/[slug]/page.jsx generateMetadata when status='draft'.
