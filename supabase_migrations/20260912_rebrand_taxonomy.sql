-- ============================================================================
-- APEX NEPAL REBRAND — TAXONOMY MIGRATION (MANUAL — DO NOT AUTO-RUN ON DEPLOY)
-- Date: 2026-09-12
-- Author: Phase 2 rebrand — feat/rebrand-ai-digital-tools
-- Safe mode: SELECT-first verification. No destructive changes until you verify.
-- Branch: feat/rebrand-ai-digital-tools (backup: backup/pre-rebrand-20260912)
-- See: REBRAND_PLAN.md, redirects.csv, lib/categories.js
-- ============================================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor → New Query → Paste this file.
-- 2. Run ONLY the SELECT blocks first (Steps 1-2) and review output.
-- 3. Verify counts, slugs, and categories. Check if any "Food & Recipes" etc. should be kept (maybe already AI-relevant?).
-- 4. Only AFTER you approve, uncomment and run the backup + archive blocks (Steps 3-5).
-- 5. No code in the repo will auto-run this. You control the deploy.
-- 6. Env placeholders: Do NOT invent affiliate IDs here. Handle affiliate via app code env vars (NEXT_PUBLIC_AFFILIATE_*).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1 — VERIFICATION: Show current taxonomy distribution (READ-ONLY)
-- Run this first. Copy output to your review sheet.
-- ----------------------------------------------------------------------------
-- Count by category (all statuses)
SELECT category, status, COUNT(*) AS count
FROM public.articles
GROUP BY category, status
ORDER BY category, status;

-- List all slugs grouped by old off-topic categories (potential archive candidates)
SELECT id, slug, title, category, status, created_at, published_at
FROM public.articles
WHERE category IN ('Food & Recipes', 'Travel & Lifestyle', 'Personal Stories', 'Health & Wellness', 'Sports', 'Entertainment', 'Philosophy & Culture', 'Arts & Fiction')
ORDER BY category, created_at DESC;

-- Full taxonomy overview (what will stay)
SELECT id, slug, title, category, status
FROM public.articles
WHERE category IN ('AI Tools', 'Freelancing in Nepal', 'Blogging & Hosting', 'Digital Payments', 'Small Business Tools', 'Web Development', 'Tech & AI', 'Startups & Growth', 'SEO Strategy')
ORDER BY category, created_at DESC;

-- Check for leaked slugs that should be excluded from sitemap (contains "-slug-")
SELECT id, slug, category
FROM public.articles
WHERE slug ILIKE '%-slug-%';

-- ----------------------------------------------------------------------------
-- STEP 2 — GENERATE EXACT REDIRECT MAP (READ-ONLY)
-- Run this, export CSV, paste into /redirects.csv for exact old → new mapping.
-- Do NOT apply redirects until after Step 1 review.
-- ----------------------------------------------------------------------------
SELECT
  slug,
  category,
  '/blog/' || slug AS old_url,
  CASE
    WHEN category = 'Food & Recipes' THEN '/resources'
    WHEN category = 'Travel & Lifestyle' THEN '/'
    WHEN category = 'Personal Stories' THEN '/about'
    WHEN category = 'Health & Wellness' THEN '/resources'
    WHEN category = 'Sports' THEN '/'
    WHEN category = 'Entertainment' THEN '/'
    WHEN category = 'Philosophy & Culture' THEN '/about'
    WHEN category = 'Arts & Fiction' THEN '/about'
    ELSE '/resources'
  END AS new_url,
  '301' AS status,
  category || ' → ' || CASE
    WHEN category = 'Food & Recipes' THEN 'Resources'
    WHEN category = 'Travel & Lifestyle' THEN 'Homepage'
    ELSE 'Closest relevant'
  END AS reason
FROM public.articles
WHERE category IN ('Food & Recipes', 'Travel & Lifestyle', 'Personal Stories', 'Health & Wellness', 'Sports', 'Entertainment', 'Philosophy & Culture', 'Arts & Fiction')
ORDER BY category, created_at;

-- Category-filter redirect verification (query-string based, handled in next.config.ts)
-- These are generic and already implemented; exact slugs above are preferred for SEO.

-- ----------------------------------------------------------------------------
-- STEP 3 — BACKUP (UNCOMMENT ONLY AFTER STEP 1-2 VERIFICATION)
-- Creates a timestamped backup table. Safe to run; does NOT modify live data.
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS public.articles_backup_20260912 AS
-- SELECT * FROM public.articles;

-- Verify backup
-- SELECT COUNT(*) AS backup_count FROM public.articles_backup_20260912;
-- SELECT COUNT(*) AS live_count FROM public.articles;

-- ----------------------------------------------------------------------------
-- STEP 4 — ARCHIVE OFF-TOPIC CONTENT (UNCOMMENT ONLY AFTER YOU APPROVE)
-- Sets status='draft' + updated_at=now() so posts become noindex & excluded from sitemap.
-- Does NOT DELETE. Can be reversed via backup.
-- NOTE: Per Phase 1 approval, DO NOT AUTO-ARCHIVE ON DEPLOY — run manually after you verify!
-- ----------------------------------------------------------------------------
-- -- Archive Food & Recipes → /resources
-- UPDATE public.articles
-- SET status = 'draft', updated_at = NOW()
-- WHERE category = 'Food & Recipes'
-- AND status = 'published';
--
-- -- Archive Travel & Lifestyle → /
-- UPDATE public.articles
-- SET status = 'draft', updated_at = NOW()
-- WHERE category = 'Travel & Lifestyle'
-- AND status = 'published';
--
-- -- Archive Personal Stories → /about
-- UPDATE public.articles
-- SET status = 'draft', updated_at = NOW()
-- WHERE category = 'Personal Stories'
-- AND status = 'published';

-- Optional: archive remaining legacy categories ONLY if you confirm they are off-topic.
-- Commented by default — review each category in Step 1 first.
-- UPDATE public.articles SET status = 'draft', updated_at = NOW() WHERE category = 'Health & Wellness' AND status = 'published';
-- UPDATE public.articles SET status = 'draft', updated_at = NOW() WHERE category = 'Sports' AND status = 'published';
-- UPDATE public.articles SET status = 'draft', updated_at = NOW() WHERE category = 'Entertainment' AND status = 'published';
-- UPDATE public.articles SET status = 'draft', updated_at = NOW() WHERE category = 'Philosophy & Culture' AND status = 'published';
-- UPDATE public.articles SET status = 'draft', updated_at = NOW() WHERE category = 'Arts & Fiction' AND status = 'published';

-- ----------------------------------------------------------------------------
-- STEP 5 — ROLLBACK (IF NEEDED)
-- Restore from backup if you archived by mistake.
-- ----------------------------------------------------------------------------
-- -- Restore all from backup (careful — will revert any new posts after backup!):
-- -- INSERT INTO public.articles SELECT * FROM public.articles_backup_20260912 ON CONFLICT (id) DO NOTHING;
--
-- -- Or restore just archived categories:
-- -- UPDATE public.articles SET status = 'published' WHERE id IN (SELECT id FROM public.articles_backup_20260912 WHERE category IN ('Food & Recipes','Travel & Lifestyle','Personal Stories') AND status='published');

-- ----------------------------------------------------------------------------
-- STEP 6 — POST-MIGRATION VERIFICATION (AFTER ARCHIVE)
-- ----------------------------------------------------------------------------
-- SELECT category, status, COUNT(*) FROM public.articles GROUP BY category, status ORDER BY category;
-- SELECT slug, category, status FROM public.articles WHERE status = 'draft' ORDER BY updated_at DESC LIMIT 20;

-- End of migration. Remember: revalidate sitemap after archive by visiting /sitemap.xml or waiting 1 hour (revalidate 3600).
