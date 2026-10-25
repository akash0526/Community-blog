-- ============================================================================
-- APEX NEPAL — SEO PLAYBOOK DATA FIXES  (2026-10-25)
-- Companion to the code changes on branch arena/8ec1a183-community-blog.
-- Implements the Supabase-side items of Apex_Nepal_SEO_Playbook.md:
--   §4/§5.2  merge the 3 "Akash" authors into ONE canonical byline
--   §4       fix Doha/Nepal location conflict in stored data
--   §4/§5.4  merge 12 thin categories into the 6 canonical ones
--   §5.3/§6.1 add seo_title (≤60 chars) separate from the H1 + backfill
--   §6.3/§8  add tested_method, sources, reviewer_*, has_affiliate_links
--   BUGFIX   stop pageview/clap counter writes from faking `updated_at`
--            (every view used to bump dateModified + "Last updated")
--
-- HOW TO RUN (Supabase Dashboard → SQL Editor):
--   1. FIRST run STEP 0 only (highlight it → Run). Eyeball the output.
--      If anything looks wrong (e.g. an "Akash" profile that is a real
--      second person), STOP and check before continuing.
--   2. Then run the WHOLE file. Every step is idempotent — running it
--      twice is safe. Take a backup first (Database → Backups) anyway.
-- ============================================================================


-- ============================================================================
-- STEP 0 — READ-ONLY AUDIT (run this block alone first, review, then proceed)
-- ============================================================================

-- 0.1 Every profile that looks like the founder, with article counts.
--     `has_login` = a real auth.users row exists (never deleted by Step 2).
SELECT p.id, p.full_name, p.username, p.email, p.professional_role,
       p.location, p.avatar_url,
       EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id) AS has_login,
       (SELECT count(*) FROM public.articles a WHERE a.author_id = p.id) AS articles,
       (SELECT count(*) FROM public.articles a WHERE a.author_id = p.id AND a.status = 'published') AS published
FROM public.profiles p
WHERE p.full_name ILIKE 'akash%' OR p.username ILIKE 'akash%' OR p.email ILIKE '%akash%'
ORDER BY published DESC;

-- 0.2 All profiles + published counts (spot zero-post bylines and guests).
SELECT p.id, p.full_name, p.username, p.email,
       (SELECT count(*) FROM public.articles a WHERE a.author_id = p.id AND a.status = 'published') AS published
FROM public.profiles p
ORDER BY published DESC, p.full_name;

-- 0.3 Category histogram (see which legacy values actually exist live).
SELECT category, count(*) AS posts
FROM public.articles
WHERE status = 'published'
GROUP BY category ORDER BY posts DESC;

-- 0.4 Titles that Google truncates (>60 chars) — these need seo_title.
SELECT slug, char_length(title) AS title_len, title
FROM public.articles
WHERE status = 'published' AND char_length(title) > 60
ORDER BY title_len DESC;

-- 0.5 Batch-publishing fingerprint (playbook §4): posts per publish date.
SELECT published_at, count(*) AS posts
FROM public.articles
WHERE status = 'published'
GROUP BY published_at ORDER BY posts DESC, published_at DESC;

-- 0.6 External-link poverty on money posts: rough count of http links in body.
SELECT slug, category,
       (length(content) - length(replace(content, '](http', ''))) / 6 AS approx_links
FROM public.articles
WHERE status = 'published'
ORDER BY approx_links ASC;

-- 0.7 Junk avatars (dicebear bots / imgbb hotlinks) — playbook §8.
SELECT id, full_name, avatar_url FROM public.profiles
WHERE avatar_url ILIKE '%dicebear%' OR avatar_url ILIKE '%i.ibb.co%';


-- ============================================================================
-- STEP 1 — NEW COLUMNS (safe, idempotent). Code already reads these when
-- present and ignores them when absent, so deploy order does not matter.
-- ============================================================================
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS tested_method text,
  ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS has_affiliate_links boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewer_name text,
  ADD COLUMN IF NOT EXISTS reviewer_url text;

COMMENT ON COLUMN public.articles.seo_title IS
  'Short (<=60 chars, keyword-first) <title> for Google. NULL = fall back to title. H1 stays in `title`.';
COMMENT ON COLUMN public.articles.tested_method IS
  '"How I tested this" notes: dates, device, network (NTC/Ncell), amounts, what failed. Rendered on the article page.';
COMMENT ON COLUMN public.articles.sources IS
  'jsonb array of {"label": "...", "url": "https://..."} — official/primary sources rendered as the Sources list + schema citation.';
COMMENT ON COLUMN public.articles.has_affiliate_links IS
  'true = show the affiliate disclosure box at the top of the article.';
COMMENT ON COLUMN public.articles.reviewer_name IS
  'Expert reviewer for YMYL posts (e.g. a CA for tax). Renders "Reviewed by" + schema reviewedBy.';
COMMENT ON COLUMN public.articles.reviewer_url IS
  'Reviewer profile URL (their site/LinkedIn or /authors/<slug>).';


-- ============================================================================
-- STEP 2 — AUTHOR MERGE: one person, one byline (/authors/akash-adhikari)
-- Safety rules:
--   * Canonical = login-backed "Akash" profile with the most articles
--     (falls back to most-articles overall, with a NOTICE).
--   * Articles from every other "Akash*" profile are reassigned to it.
--   * A profile backed by auth.users is NEVER deleted (login safety);
--     non-login duplicates are deleted only AFTER their articles move.
--   * The shared Guest profile (0000…) is never deleted. The 20260707
--     migration renamed it to "Akash Adhikari" — if it still carries
--     that identity it is restored to Guest here (its articles stay!).
--     => If Step 0.1 shows articles living on the Guest row that you
--        know are YOURS (not community submissions), move them with the
--        one-liner in STEP 2B after reviewing. We do NOT guess this.
-- ============================================================================
DO $$
DECLARE
  v_canonical uuid;
  v_guest uuid := '00000000-0000-0000-0000-000000000000'::uuid;
  r record;
  v_moved int := 0;
BEGIN
  -- Pick the canonical founder profile.
  SELECT p.id INTO v_canonical
  FROM public.profiles p
  WHERE (p.full_name ILIKE 'akash%' OR p.username ILIKE 'akash%')
    AND p.id <> v_guest
  ORDER BY EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id) DESC,
           (SELECT count(*) FROM public.articles a WHERE a.author_id = p.id) DESC
  LIMIT 1;

  IF v_canonical IS NULL THEN
    RAISE NOTICE 'STEP 2 SKIPPED: no Akash profile found. Check Step 0.1 output.';
    RETURN;
  END IF;
  RAISE NOTICE 'Canonical founder profile: %', v_canonical;

  -- Free the username first if a duplicate/guest currently holds it.
  UPDATE public.profiles SET username = NULL
  WHERE username = 'akash-adhikari' AND id <> v_canonical;

  -- Restore the hijacked Guest identity (does not move its articles).
  UPDATE public.profiles SET
    full_name = 'Community Storyteller',
    professional_role = 'Guest Contributor',
    username = NULL
  WHERE id = v_guest AND full_name ILIKE 'akash%';

  -- Normalize the canonical profile (only fills blanks/placeholders;
  -- replace the TODO bio with your real 150+ word bio afterwards).
  UPDATE public.profiles SET
    full_name = 'Akash Adhikari',
    username = 'akash-adhikari',
    professional_role = COALESCE(NULLIF(professional_role, ''), 'Founder & Lead Editor'),
    location = 'Nepal',
    linkedin = CASE WHEN linkedin ~ '^https?://(www\.)?linkedin\.com/?$' THEN NULL ELSE linkedin END,
    bio = CASE
      -- Narrow match on the known boilerplates only: '%Doha%' alone would
      -- also wipe a legitimate bio that mentions testing from Doha.
      WHEN bio IS NULL OR bio = ''
        OR bio ILIKE '%based in Doha%' OR bio ILIKE 'Full-stack developer in Doha%'
        OR bio ILIKE '%Qatar expat guides%' OR bio ILIKE '%Qatar expat life%'
      THEN 'Founder and lead editor of Apex Nepal. Full-stack developer (Next.js, Supabase) from Nepal. I personally test remittance services, payment wallets, hosting and AI tools from Nepali networks (NTC/Ncell) and publish the receipts, fees and failures. TODO(owner): add proof numbers here, e.g. "received freelance income via Payoneer since 2023", plus your city.'
      ELSE bio END,
    expertise = COALESCE(expertise, ARRAY['Remittance & payments','Freelancing','AI tools','Next.js','Supabase'])
  WHERE id = v_canonical;

  -- Reassign articles from duplicates, then retire the duplicates.
  FOR r IN
    SELECT p.id, p.full_name,
           EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id) AS has_login
    FROM public.profiles p
    WHERE p.id <> v_canonical AND p.id <> v_guest
      AND (p.full_name ILIKE 'akash%' OR p.username ILIKE 'akash%')
  LOOP
    UPDATE public.articles SET author_id = v_canonical WHERE author_id = r.id;
    GET DIAGNOSTICS v_moved = ROW_COUNT;
    RAISE NOTICE 'Moved % articles from % (%) to canonical.', v_moved, r.full_name, r.id;

    IF r.has_login THEN
      -- Never delete a login. Just unclaim the byline URL space.
      UPDATE public.profiles SET username = NULL WHERE id = r.id;
      RAISE NOTICE 'Kept login-backed duplicate % — delete the extra AUTH USER manually in Dashboard → Authentication if it is really you twice, then delete this profile row.', r.id;
    ELSE
      DELETE FROM public.profiles WHERE id = r.id;
      RAISE NOTICE 'Deleted non-login duplicate profile %.', r.id;
    END IF;
  END LOOP;
END $$;

-- STEP 2B (OPTIONAL, manual — only if Step 0.1 showed YOUR articles sitting
-- on the Guest row 0000… after it was renamed "Akash Adhikari" in 2026):
-- UPDATE public.articles SET author_id = (SELECT id FROM public.profiles WHERE username = 'akash-adhikari')
-- WHERE author_id = '00000000-0000-0000-0000-000000000000'::uuid
--   AND slug IN ('paste', 'your', 'verified', 'slugs', 'here');


-- ============================================================================
-- STEP 3 — LOCATION CONSISTENCY (playbook §4): Nepal everywhere.
-- (Code now reads EDITORIAL_BASE from lib/siteConfig.js; /terms governing
--  law is a legal decision and is deliberately NOT changed here.)
-- ============================================================================
ALTER TABLE public.profiles ALTER COLUMN location SET DEFAULT 'Nepal';

UPDATE public.profiles SET location = 'Nepal'
WHERE username = 'akash-adhikari' AND location = 'Doha, Qatar';


-- ============================================================================
-- STEP 4 — CATEGORY CONSOLIDATION: 12 thin buckets -> 6 canonical
-- (must stay in sync with lib/categories.js). Broad buckets are routed by
-- title/keyword; run STEP 0.3 again afterwards and eyeball STEP 4.3.
-- ============================================================================

-- 4.1 Exact renames.
UPDATE public.articles SET category = 'Payments & Finance'
WHERE lower(category) IN ('business & finance','finance','money','payments & finance (nepal)');

UPDATE public.articles SET category = 'AI Tools & Automation'
WHERE lower(category) IN ('tech & ai','ai tools');

UPDATE public.articles SET category = 'Web Hosting & Domains'
WHERE lower(category) IN ('web hosting','hosting');

UPDATE public.articles SET category = 'Small Business Workflows'
WHERE lower(category) = 'small business';

UPDATE public.articles SET category = 'Student Resources'
WHERE lower(category) = 'students';

UPDATE public.articles SET category = 'Freelancing & Remote Work'
WHERE lower(category) = 'freelancing';

-- 4.2 Broad legacy buckets routed by topic keywords (order matters).
UPDATE public.articles SET category = CASE
  WHEN (title || ' ' || target_keyword) ~* '(esewa|khalti|payoneer|wise|remit|send money|receive.*usd|payment|wallet|\mpan\M|tax|invoice|\mime\M|dollar card)'
    THEN 'Payments & Finance'
  WHEN (title || ' ' || target_keyword) ~* '(hosting|domain|\.com\.np|wordpress|blog.*cost|cost.*blog)'
    THEN 'Web Hosting & Domains'
  WHEN (title || ' ' || target_keyword) ~* '(upwork|fiverr|freelanc|remote job|remote work|first client)'
    THEN 'Freelancing & Remote Work'
  WHEN (title || ' ' || target_keyword) ~* '(\mai\M|chatgpt|gemini|deepseek|claude|photopea|canva|automation)'
    THEN 'AI Tools & Automation'
  WHEN (title || ' ' || target_keyword) ~* '(scholarship|student|study abroad|learn.*cod|coding|ielts|pte|exam)'
    THEN 'Student Resources'
  WHEN (title || ' ' || target_keyword) ~* '(pasal|shop|business|billing|sell online)'
    THEN 'Small Business Workflows'
  ELSE category
END
WHERE lower(category) IN (
  'tool reviews & comparisons','guides & tutorials','community contributions',
  'personal stories','opinion & essays','news & current affairs',
  'nepal tech news','stories','guide'
);

-- 4.3 Review anything still outside the canonical six, then map by hand:
-- SELECT slug, category, title FROM public.articles
-- WHERE category NOT IN ('Payments & Finance','Freelancing & Remote Work',
--   'AI Tools & Automation','Web Hosting & Domains','Small Business Workflows',
--   'Student Resources');


-- ============================================================================
-- STEP 5 — SEO TITLES (playbook §6.1 verbatim rewrites; H1s untouched).
-- Only fills rows where seo_title is still NULL so your edits survive.
-- ============================================================================
UPDATE public.articles SET seo_title = 'Freelancer Tax in Nepal: PAN, Invoices & Filing (2083/84)'
WHERE seo_title IS NULL AND title ILIKE 'After Your First International Payment%';

UPDATE public.articles SET seo_title = 'Send Money to Nepal 2026: Wise vs IME vs Bank (Real Fees)'
WHERE seo_title IS NULL AND title ILIKE 'How to Send Money to Nepal%';

UPDATE public.articles SET seo_title = 'Scholarships for Nepali Students 2026-27: Free Toolkit'
WHERE seo_title IS NULL AND title ILIKE 'How to Apply for Scholarships Abroad From Nepal%';

UPDATE public.articles SET seo_title = '7 Free AI Tools for Nepali Students (Tested on NTC)'
WHERE seo_title IS NULL AND title ILIKE 'The Free AI Stack for Nepali Students%';

UPDATE public.articles SET seo_title = 'Upwork from Nepal: How to Earn Your First $100 (2026)'
WHERE seo_title IS NULL AND title ILIKE 'Your First $100 on Upwork from Nepal%';

UPDATE public.articles SET seo_title = 'eSewa vs Khalti for Freelancers: Limits & Fees 2026'
WHERE seo_title IS NULL AND title ILIKE 'eSewa vs Khalti for Freelancers%';

-- Remaining long titles need a human-written short title — list them:
-- SELECT slug, char_length(title) AS len, title FROM public.articles
-- WHERE status='published' AND seo_title IS NULL AND char_length(title) > 55
-- ORDER BY len DESC;
-- Template for each: UPDATE public.articles SET seo_title = '<=60 chars, keyword first' WHERE slug = '...';


-- ============================================================================
-- STEP 6 — HONEST dateModified (playbook §5.5/§6.5).
-- BUG: trg_articles_updated_at fired on EVERY update, including the
-- pageview/clap counter writes — so "Last updated" and sitemap
-- lastModified crept forward on every read. Now only content edits count.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_articles_updated_at()
RETURNS trigger AS $$
BEGIN
  -- Content-bearing columns only. tested_method/sources count (filling
  -- them IS the playbook's post upgrade, so dateModified should move);
  -- seo_title deliberately does NOT (a title-tag tweak is not a content
  -- update). sources is compared as text (jsonb has no record-compare).
  IF (NEW.title, NEW.content, NEW.meta_description, NEW.category,
      NEW.image_url, NEW.slug, NEW.status, NEW.target_keyword,
      NEW.tested_method, NEW.sources::text)
     IS DISTINCT FROM
     (OLD.title, OLD.content, OLD.meta_description, OLD.category,
      OLD.image_url, OLD.slug, OLD.status, OLD.target_keyword,
      OLD.tested_method, OLD.sources::text)
  THEN
    NEW.updated_at = timezone('utc'::text, now());
  ELSE
    NEW.updated_at = OLD.updated_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE PROCEDURE public.set_articles_updated_at();

-- OPTIONAL repair (review first!): rows whose updated_at was inflated by
-- pageviews can't be perfectly reconstructed. Conservative reset — only
-- rows "updated" in the last 24h with no plausible edit — is left to you:
-- SELECT slug, published_at, created_at, updated_at, pageviews
-- FROM public.articles WHERE updated_at > created_at + interval '1 day'
-- ORDER BY updated_at DESC;
-- UPDATE public.articles SET updated_at = COALESCE(published_at::timestamptz, created_at)
-- WHERE slug IN ('verified', 'slugs', 'only');


-- ============================================================================
-- STEP 7 — SMALL CLEANUPS + INDEXES
-- ============================================================================
-- Bot avatars (idempotent repeat of trust-fix cleanup for any new rows).
UPDATE public.profiles
SET avatar_url = 'https://ui-avatars.com/api/?name=' || replace(full_name, ' ', '+') || '&background=A8471F&color=fff'
WHERE avatar_url ILIKE '%dicebear%' OR avatar_url ILIKE '%bottts%';

-- Category-page / related-posts queries filter by category.
CREATE INDEX IF NOT EXISTS idx_articles_category_published
  ON public.articles (category, published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_author
  ON public.articles (author_id);


-- ============================================================================
-- STEP 8 — VERIFICATION (run last; all should look clean)
-- ============================================================================
SELECT 'founder profiles' AS check_, count(*) AS result
FROM public.profiles WHERE full_name ILIKE 'akash%' OR username ILIKE 'akash%'
UNION ALL
SELECT 'canonical author published posts',
       (SELECT count(*) FROM public.articles a
        JOIN public.profiles p ON p.id = a.author_id
        WHERE p.username = 'akash-adhikari' AND a.status = 'published')
UNION ALL
SELECT 'non-canonical categories',
       (SELECT count(*) FROM public.articles WHERE category NOT IN
        ('Payments & Finance','Freelancing & Remote Work','AI Tools & Automation',
         'Web Hosting & Domains','Small Business Workflows','Student Resources'))
UNION ALL
SELECT 'long titles still missing seo_title',
       (SELECT count(*) FROM public.articles
        WHERE status = 'published' AND seo_title IS NULL AND char_length(title) > 55)
UNION ALL
SELECT 'posts with sources filled',
       (SELECT count(*) FROM public.articles WHERE jsonb_array_length(sources) > 0);
