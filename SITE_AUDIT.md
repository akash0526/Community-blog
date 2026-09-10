# Apex Site Audit — September 2026

Full review of [apex-nepal.com](https://www.apex-nepal.com/) covering copy,
SEO, performance, trust/E-E-A-T, and UX. Everything in **Part 1 is already
fixed in this branch** (verified: `next build` ✅, `next lint` 0 errors ✅,
24/24 tests ✅). Parts 2–3 need your action in Supabase / Search Console /
content, plus bigger feature suggestions.

---

## Part 1 — Fixed in this branch (35 files)

### Copy & honesty
- **Hero typo:** “open Open bloging platform” → “open global blogging platform.”
- **“Editor's pick”** (always just the newest post) → “Latest / Fresh off the press.”
- **Privacy Policy** falsely claimed GA4/Plausible analytics, EEA-only banner,
  and a footer “Cookie settings” link that didn't exist. Rewritten to match
  reality (no third-party trackers installed).
- **Editorial Policy** claimed comments are “pre-moderated” — they post
  instantly. Now says so, with a report-abuse address.
- **Cookie banner** claimed “analytics cookies” — now honest (“Got it /
  Essential only”), plus a working footer **Cookie settings** button.
- **Dashboard** claimed “100% Genuine” pageviews (bots are counted) and
  “Fully Indexable & Public” (drafts aren't). Reworded; `undefined` SEO
  scores now show “–”.
- **About page** listed contributor countries (PH/UK/US…) the site can't prove
  yet → softened to founding community + open call.
- **Corrections page** still said “launched today — July 7” in September →
  timeless wording.
- **Signup/login copy** was developer jargon (“Welcome Back, Architect”,
  “keyword authority pipelines”, “Log In Live”) on a general-interest blog →
  rewritten in plain language. Broken demo avatar URL fixed.

### SEO & discoverability
- **Twitter card image** was the relative path `opengraph-image` (resolves to
  a 404 on every page except `/`) → absolute URL.
- **`/blog` returned 404** (linked nowhere, but users/engines try it) → new
  **archive page** listing all stories, in sitemap + nav + footer.
- **Sitemap** stamped `new Date()` on static pages (fake freshness, wasted
  crawl budget) and omitted all author pages → fixed dates + author URLs.
- **New:** `/feed.xml` (RSS), `/llms.txt` (AI-crawler guidance),
  `/apple-icon.png` (iOS icon), branded global 404 page.
- **Google's Sitelinks SearchBox** (`?q=`) and breadcrumb category links
  (`?category=`) pointed at URLs the site ignored → the feed now reads and
  writes both, so filtered views are shareable and crawlable.
- **Studio/Dashboard/Kanban** relied on `robots.txt` Disallow (which does
  *not* de-index) → explicit `noindex` layouts.
- **Author JSON-LD** stamped the founder's GitHub on *every* author (including
  guests) → per-author links; placeholder `linkedin.com/`-style URLs hidden.
- Author pages now render the author's **real website/X/LinkedIn** instead of
  hardcoded placeholders; contact page X link points at the real handle.

### Product bugs
- **Avatars broken:** author photos load from `i.ibb.co`, which wasn't in
  `next/image` remotePatterns → added (verify on the live deploy).
- **6 of 17 categories were unfilterable** (filter bar sliced to 12 — incl.
  Travel & Lifestyle, Tech & AI) → all shown.
- **Search only searched loaded rows** and Load More vanished when filtering →
  server-side search (`q` + `category` in `/api/articles`) with debounced
  refetch and working pagination in every view.
- **Reading time** was hardcoded “5–8 min” on every story → computed from
  word count. Nepali stories get `lang="ne"` for screen readers.
- **Internal links** in articles forced new tabs → only external links do.
- **Pageview counting blocked rendering** (awaited Supabase RPC on every
  article read) → fire-and-forget.
- **Bookmarks stored entire article bodies** in localStorage (~5 MB quota) →
  slim cards.
- **Comments:** “Markdown Supported” label was false (plain text) → “Be kind ·
  No spam”; added 2,000-char limit + 30-second spam throttle.
- **Theme flashed** on every load → pre-paint script + OS-preference default.
- **Fonts:** Inter/Geist downloaded but never applied (Tailwind v4 `@theme`
  wiring missing) → wired.
- Header nav had one link (“Stories”); mobile menu linked the internal Kanban
  → desktop + mobile menus rebuilt (All stories, Authors, About, Contact).
- Footer: dynamic year, Authors/RSS links, cookie settings; skip-to-content
  link; aria labels on icon buttons; `/studio` navigation no longer hard
  reloads; “AI Score” (it's a rule checklist, not AI) renamed to SEO Score.
- **Repo hygiene:** deleted stray `apex-community-logo.svg.svg`; base
  `supabase_schema.sql` now matches live DB (profile social columns,
  `articles.updated_at` + auto-update trigger); dashboard can actually edit
  website/X/LinkedIn/location (fields the article pages already tried to
  read); image fallbacks use the branded OG card instead of a stretched icon.
- **Lint:** 8 errors → **0 errors**; build + types + tests all green.

---

## Part 2 — Your action items (Supabase / content / Search Console)

1. **Verify sitemap freshness.** Your live sitemap is missing the two newest
   stories (Jul 21 + Jul 23 Prestige articles). After deploying this branch,
   open `/sitemap.xml`, confirm they appear, then **resubmit it in Google
   Search Console** and request indexing for the two URLs.
2. **Rehost hotlinked images.** Covers/avatars currently load from
   `imgs.search.brave.com` (a search proxy — will rot), `onlinekhabar.com`,
   and `news24online.com`. That's a copyright + broken-image risk. Download →
   upload to your Supabase `article_images` bucket → update `image_url`:
   ```sql
   SELECT slug, image_url FROM articles
   WHERE image_url LIKE '%brave.com%' OR image_url LIKE '%onlinekhabar%'
      OR image_url LIKE '%news24online%';
   ```
3. **Fix the guest avatar incident.** One author avatar is a Brave-proxied
   university directory photo. Replace with a consented photo or ui-avatars.
4. **Move your own avatar off `i.ibb.co`** (free image hosts expire) to
   Supabase storage or your GitHub avatar; same query pattern as #2 on
   `profiles.avatar_url`.
5. **Clean the founder LinkedIn placeholder** in the DB
   (`https://linkedin.com/` → real profile or NULL) and confirm
   `https://x.com/apex_nepal` exists; create it if not.
6. **Guest posts are attributed to you.** The trust-fix migration overwrote
   the `00000000-…` guest profile with your name, so every guest/demo story
   shows “Akash” as author. Either restore a neutral “Community Storyteller”
   guest profile or require real login to publish (see #8).
7. **Add the new profile columns to any *other* environments** (only if you
   run a second Supabase project — live already has them via migration).
8. **Decide: open vs. gated publishing.** Today anyone — including the
   one-click demo login — can publish instantly to production with zero
   ownership checks (`/studio?edit=<anyone's-slug>` edits anyone's story).
   If Apex stays “anyone can publish,” add: edit-ownership check, a spam word
   filter, and image size/MIME validation. If not, gate `/studio` behind real
   auth and remove demo login in production (`if (process.env.NODE_ENV ===
   "production")` hide the button).
9. **Replace the `mailto:` contact form** with a real backend (Resend,
   Formspree, or a Supabase table + RLS) — `mailto:` POST fails silently for
   most visitors. Confirm `press@`/`legal@` inboxes actually exist.
10. **Set up Search Console + Bing Webmaster** (Google token is already in),
    check the non-www → www redirect, and add Vercel Analytics or Plausible —
    then you can re-enable the analytics wording in Privacy/Cookies honestly.

---

## Part 3 — Suggested upgrades (biggest impact first)

1. **Related stories + author box links** on article pages (“More in
   {Category}”, “More by {author}”) — biggest engagement/SEO win available.
2. **Table of contents + reading progress** on long guides (the 66-restaurant
   directory desperately needs jump links; add a map embed + `ItemList`/
   `Restaurant` schema while you're there).
3. **Language badges + `hreflang`-style pairing** for EN/NE duplicates (the
   remittance guide exists twice with no cross-linking; add a “Read in
   नेपाली / English” toggle).
4. **Newsletter signup** (Buttondown/ConvertKit or Supabase table) in the
   article footer — community blogs live or die by email.
5. **Compress uploads client-side** (5–10 MB phone photos are your slowest
   asset) and validate MIME/size; serve via Supabase image transforms.
6. **Security headers** in `next.config.ts` (`X-Content-Type-Options`,
   `Referrer-Policy`, `Permissions-Policy`, framing rules).
7. **Topic pages** (`/topics/[slug]`) for SEO instead of filter-only
   categories; add `prev/next` story navigation.
8. **Client-side pageview beacon with bot filtering** instead of
   server-render counting, so stats become trustworthy.
9. **Error monitoring** (Sentry) + uptime checks — you're currently blind to
   production failures.
10. **Comment identity:** require login or email verification to curb
    impersonation (anyone can post as “Akash” today); add `rel="ugc"` if
    comments ever render links.

---

*Generated from a full code + live-site review, Sep 10 2026. All Part 1
changes are in this branch and deploy-safe.*
