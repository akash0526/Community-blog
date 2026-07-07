-- Apex Trust & Credibility Fix – 2026-07-07
-- Adds author social fields, cleans fake data

-- 1) Extend profiles for E-E-A-T
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS twitter text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS location text DEFAULT 'Doha, Qatar',
  ADD COLUMN IF NOT EXISTS expertise text[];

-- 2) Backfill founding author – Akash Adhikari
UPDATE public.profiles SET
  full_name = 'Akash Adhikari',
  professional_role = 'Founder & Lead Editor',
  bio = 'Full-stack developer (Next.js, Supabase) based in Doha, Qatar. I test remittance apps, publish Qatar expat guides, and build open publishing tools at Apex.',
  avatar_url = 'https://avatars.githubusercontent.com/u/148329502?v=4',
  location = 'Doha, Qatar',
  website = 'https://github.com/akash0526',
  twitter = 'https://x.com/apex_nepal',
  linkedin = 'https://linkedin.com/',
  expertise = ARRAY['Remittance tech','Qatar expat life','Next.js','Supabase'],
  username = 'akash-adhikari'
WHERE email ILIKE '%akash%' OR full_name ILIKE '%akash%' OR id = '00000000-0000-0000-0000-000000000000';

-- 3) Kill dicebear bot avatars site-wide -> ui-avatars fallback handled in app code,
--    but clean DB too:
UPDATE public.profiles
SET avatar_url = 'https://ui-avatars.com/api/?name=' || replace(full_name,' ','+') || '&background=4f46e5&color=fff'
WHERE avatar_url ILIKE '%dicebear%' OR avatar_url ILIKE '%bottts%';

-- 4) Clean article titles – strip "Slug: ..."
UPDATE public.articles
SET title = regexp_replace(title, '\s*Slug:\s*[\w-]+$', '', 'i')
WHERE title ~* 'slug:';

-- 5) Clean meta_description – strip "(123 characters)" / "(१५९ क्यारेक्टर)"
UPDATE public.articles
SET meta_description = regexp_replace(meta_description, '\s*\(\d+\s*(characters|chars|क्यारेक्टर)\)\s*$', '', 'i')
WHERE meta_description ~ '\(\d+\s*(characters|chars|क्यारेक्टर)\)';

-- 6) Reset fake public counters – keep real pageviews but zero out displayed claps if you want a clean start
-- UPDATE public.articles SET claps = 0 WHERE claps < 5;

-- 7) Add last_updated tracking if missing
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());
UPDATE public.articles SET updated_at = COALESCE(updated_at, published_at::timestamptz, created_at) WHERE updated_at IS NULL;

-- 8) Ensure seo_score is not publicly exposed – column can stay for internal editor, UI no longer renders it.

-- Done.
