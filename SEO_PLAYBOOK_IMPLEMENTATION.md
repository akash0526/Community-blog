# SEO Playbook — Implementation Report (25 Oct 2026)

What was done with `Apex_Nepal_SEO_Playbook.md`, split into:
**A. Fixed in code** (this branch) · **B. Fixed by Supabase SQL** (file ready for you to run) · **C. Needs you** (things no code can invent) · **D. Extra bugs found while auditing**.

Deploy order does not matter: the code works before *and* after the SQL runs (defensive column handling everywhere — see the self-review corrections at the end; one route briefly broke this rule and was fixed). But for full effect: merge/deploy the branch **and** run `supabase_migrations/20261025_seo_playbook.sql`.

---

## A. Fixed in code ✅

| Playbook | Fix | Where |
|---|---|---|
| §5.1 soft-404 | `generateMetadata` calls `notFound()` **and** `app/blog/[slug]/loading.jsx` was deleted — verified live: with the streaming shell present, `notFound()` alone still returned 200 on Next 16; without it, missing posts return a real **404**. (Don't re-add `loading.jsx` to that segment.) Same `notFound()` fix on author pages. | `app/blog/[slug]/page.jsx`, `app/authors/[slug]/page.tsx` |
| §5.2 author 301s | `/authors/akash` and `/authors/akash-d3682a09` → 308/permanent → `/authors/akash-adhikari` | `next.config.ts` `redirects()` |
| §4 author identity | Author URLs now use the `username` column first (one canonical URL); article queries actually fetch website/twitter/linkedin/location/expertise now (previously selected columns didn't include them, so schema `sameAs` was silently always empty). Author lookup no longer falls back to "first profile with the same first name" — exact match or 404. Zero-post author pages are `noindex` and excluded from the sitemap. | `lib/seoUtils.js` (`authorSlugFor`), `lib/articles.js`, author pages, `app/sitemap.ts` |
| §4/§10 brand entity | Site name is **"Apex Nepal"** everywhere (title template `%s \| Apex Nepal`), `"Apex Community"` removed from schema `alternateName` + web manifest. One config file for all entity facts. | `lib/siteConfig.js` (new), `app/layout.tsx`, `app/manifest.ts` |
| §4 location conflict | `EDITORIAL_BASE = "Nepal"` in one place; footer/llms.txt/author fallbacks/schema default all read Nepal; stray "Doha" copy removed (authors fallback, schema default, dashboard placeholder, disclaimer scope). **Exception:** `/terms` governing law still says Qatar — see C1. | `lib/siteConfig.js`, `app/llms.txt/route.ts`, `app/authors/page.tsx`, `supabase_schema.sql`, `app/disclaimer/page.tsx` |
| §5.6 llms.txt | Fully rewritten and **generated from real data** (hubs + latest 10 posts) — old text described a Doha expat/food-directory site. | `app/llms.txt/route.ts` |
| §5.3/§6.1 SEO titles | `seo_title` is used as the `<title>` (absolute, no brand suffix) while the long H1 stays; long titles without one no longer get " \| Apex Nepal" appended. Studio has an **SEO Title field with a live /60 counter**, and the SEO analyser now scores it. | `lib/seoUtils.js` (`articleMetadataTitle`), `app/blog/[slug]/page.jsx`, `app/studio/page.jsx`, `lib/seoEngine.js` |
| §5.4 fake category URLs | Breadcrumbs (JSON-LD *and* visible) now point to real **`/blog/category/<slug>`** pages (new, with ~150-word intros, post lists, hub links, in sitemap). `/?category=` and `/?q=` crawl paths disallowed in robots.txt. | `app/blog/category/[slug]/page.jsx`, `app/blog/[slug]/*`, `app/robots.ts`, `app/sitemap.ts` |
| §4 too many categories | 6 canonical categories aligned to the 5 hubs + Students, with legacy-value mapping + keyword routing so pre-migration rows still resolve correctly. Studio dropdown only offers the 6; dead default `"Personal Stories"` (not even a listed category) fixed. | `lib/categories.js` |
| §6.4 hub-and-spoke | Hub (pillar) pages now list every published post in their cluster server-side; every article ends with **Keep reading** (same-category siblings) + hub + category links. *(In-text links inside old posts still need content edits — C7.)* | `components/PillarPage.jsx`, `lib/articles.js` (`getRelatedArticles`), `app/blog/[slug]/ArticleContent.jsx` |
| §5.5 structured data | Always `BlogPosting` (removed `NewsArticle` branching); Organization schema gets PNG logo 512×512 (new `public/logo-512.png`, replace with final art anytime), email, country, `founder`; founder's personal GitHub moved from Organization `sameAs` to the Person; `inLanguage` is `"en"` (was `en+ne` with no Nepali content); dead `SearchAction` removed; `reviewedBy` + `citation` emitted when you fill the new columns; `knowsAbout` from expertise. | `app/layout.tsx`, `app/blog/[slug]/page.jsx` |
| §4 meta keywords | Removed site-wide. | `app/layout.tsx` |
| §4 homepage stats "0+" | `CountUp` now server-renders the real number and only animates on the client. | `components/animations/CountUp.tsx` |
| §4 generic H1 | Homepage H1 is now "Tested Tools & Guides for Freelancers, Students & Small Businesses in Nepal" (same visual style). | `components/Hero.tsx` |
| §5.6 IndexNow/Bing | Key file `public/783775…84f.txt`; Studio pings our own `POST /api/indexnow` after a successful publish and the server submits to IndexNow (the API has no CORS — a direct browser call silently fails). Bing verification is env-driven: set `BING_SITE_VERIFICATION` in Vercel (see C5). | `lib/indexnow.js`, `app/api/indexnow/route.ts`, `app/studio/page.jsx`, `app/layout.tsx` |
| §5.6 JS weight | Comments (`DiscussionThread`) lazy-loaded out of the article bundle. | `app/blog/[slug]/ArticleContent.jsx` |
| §6.3/§8 E-E-A-T rendering | "How I tested this" box (from `tested_method`), **Sources** list (from `sources`), "Reviewed by" line (from `reviewer_*`) render automatically when filled. YMYL disclaimer now triggers on the canonical category (the old check used retired names and would have silently stopped firing after the SQL rename). | `app/blog/[slug]/ArticleContent.jsx` |
| §12.2 affiliates | External links with affiliate parameters (`ref=`, `aff=`, `tag=`, `#aff`) automatically get `rel="… sponsored"`; `has_affiliate_links` shows the disclosure box. Privacy page now has the AdSense/third-party-vendor section required for approval. | `ArticleContent.jsx`, `app/privacy/page.tsx` |
| §14 publish checklist | Studio analyser adds: SEO-title ≤60 (scored), in-text internal links ≥3, official sources (NRB/IRD/.gov.np detection), comparison table, Short answer + FAQ, How-I-tested (advisory). 12 new tests; suite is 57/57 green. | `lib/seoEngine.js`, `tests/seoPlaybook.test.js` |

## B. Supabase SQL — `supabase_migrations/20261025_seo_playbook.sql` 🗄️

Run **STEP 0 (read-only audit) first**, eyeball it, take a DB backup, then run the whole file. Every step is idempotent.

| Step | What it does |
|---|---|
| 0 | Audit SELECTs: duplicate Akash profiles + login flags + article counts, category histogram, >60-char titles, batch-publish dates, link poverty, junk avatars |
| 1 | `ADD COLUMN` (if-not-exists): `seo_title`, `tested_method`, `sources jsonb`, `has_affiliate_links`, `reviewer_name`, `reviewer_url` (+ column comments) |
| 2 | **Author merge:** picks the login-backed Akash profile with the most posts as canonical, sets `username='akash-adhikari'`, moves duplicates' articles to it, deletes only non-login duplicates, restores the Guest profile identity (Step 2B is a manual one-liner if your own posts sit on the Guest row — we refuse to guess) |
| 3 | Location default → Nepal; founder row Doha → Nepal |
| 4 | Category consolidation: exact renames + keyword routing of broad buckets into the 6 canonical values (Step 4.3 lists leftovers for manual mapping) |
| 5 | The 6 `seo_title` rewrites from playbook §6.1 verbatim (only where NULL) + a query listing remaining long titles to hand-write |
| 6 | Fixes the `updated_at` trigger so pageviews/claps stop faking `dateModified` (see D1) |
| 7 | Dicebear avatar cleanup, indexes for category/author queries |
| 8 | Verification SELECT — founder profiles = 1 (or +1 login kept), non-canonical categories = 0, etc. |

Quick reference queries you'll reuse monthly (also in the file): titles missing `seo_title`, posts still outside canonical categories, `sources` coverage.

## C. What I need from you 🙋

**To finish the technical fixes (small, one-time):**

1. **Confirm the true base + legal jurisdiction.** I standardized everything on **Nepal** (your footer/About already said Nepal). `/terms` still says *"Qatar courts … Doha"* and `/privacy` contact city was changed to Nepal with a TODO comment. Tell me the correct legal home and I'll make all legal pages consistent — I won't silently rewrite governing law.
2. **Run the SQL:** Step 0 → check output (is every "Akash*" row really you? are any Guest-row articles yours?) → backup → run all → paste me the Step 8 result if anything is non-zero.
3. **Brand social profiles:** create/confirm Facebook, LinkedIn (company), X (is `@apex_nepal` really yours? it's in the Twitter cards), YouTube/Instagram — then paste the URLs and I'll fill `SOCIAL_PROFILES` in `lib/siteConfig.js` (Organization `sameAs` is omitted until then, on purpose).
4. **Author identity pack (§8):** one real photo (hosted on your domain/ImageKit, not i.ibb.co — update `avatar_url`), personal LinkedIn URL, and your real 150+ word bio with proof numbers. The SQL inserts a placeholder bio containing `TODO(owner)` — search for it in Supabase and replace.
5. **AdSense publisher ID** (`pub-XXXXXXXXXXXXXXXX`) when approved → create `public/ads.txt` with exactly:
   `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
   (I deliberately did **not** ship a placeholder ads.txt — an empty/comment-only file declares "no authorized sellers".)
6. **Search tooling (§5.6):** confirm Google Search Console works (verification token is already live); import the site into **Bing Webmaster Tools** and give me the code (or set `BING_SITE_VERIFICATION` in Vercel yourself). **Decide on GA4:** the site is currently cookieless-only (Vercel Analytics) and the privacy page promises exactly that — say the word (plus Measurement ID) and I'll add GA4 *and* rewrite the privacy/consent text together. Untouched until you decide.

**Content work only you can do (§6–§9, §13 — fields and UI are ready):**

7. Per-post upgrades for the 10 batch posts: original screenshots/receipts, fill `tested_method` + `sources` (NRB/IRD/official fee pages) in Supabase, add 3–5 **in-text** internal links in the markdown, fix reused images/alt text. The Studio checklist now nags about all of these.
8. A named expert reviewer (CA/tax consultant) for the tax/PAN post → fill `reviewer_name`/`reviewer_url`.
9. Verify remaining long titles from SQL Step 5's list and write their `seo_title` (Studio field works too).
10. Publishing rhythm + distribution + backlinks (§7.6/§9/§13) — process, not code. Tool #1 (remittance fee calculator) I *can* build — say the word and I'll spec it against §9.1.

## D. Extra bugs found during the audit (fixed)

1. **`dateModified` was fake on every page view.** `increment_pageview`/`increment_claps` UPDATEs fired `trg_articles_updated_at`, so `updated_at`, "Last updated" badges, sitemap `lastModified` and schema `dateModified` crept forward with traffic. Trigger now only fires on content-column changes (SQL Step 6 + `supabase_schema.sql`).
2. **Author `sameAs`/website/linkedin never rendered:** `getArticleBySlug` never selected those columns.
3. **Author page could show the wrong person:** first-name `ilike` fallback returned `data[0]`.
4. **YMYL disclaimer would have died** after the category rename (checked retired names like `Business & Finance`).
5. **Sitemap listed zero-post/guest author pages** (thin "No published stories" URLs).

## Corrections from self-review (second pass, 25 Oct 2026)

The implementation was re-audited file-by-file before merge. One serious, two moderate and six minor mistakes were found in the first pass and fixed (same branch/PR):

1. **(Serious) Founder page could 404.** `generateMetadata` on `/authors/[slug]` called `notFound()` before the page's hardcoded founder fallback could render — so the 301 target `/authors/akash-adhikari` could 404 in the window before the Supabase merge gives a row that exact slug. Fixed: one shared `resolveAuthor()` for metadata + page; fallback applies only to the canonical founder slug (previously any slug containing "akash") and renders `noindex`. Verified locally: founder URL → 200 fallback, unknown author → 404.
2. **(Moderate) Category filter casing.** `storedValuesForCategory()` returned lowercase legacy names, but Postgres `IN` is case-sensitive and rows are stored title-case ("Business & Finance") — pre-migration category queries would silently miss them. Now returns DB-cased values; broad buckets documented as SQL-Step-4-only. Regression test added.
3. **(Moderate) IndexNow from the browser never worked.** JSON `fetch` to `api.indexnow.org` dies on CORS preflight (hidden by the catch). Now submitted server-side via `POST /api/indexnow` with same-host validation.
4. **(Minor) Title threshold math.** Brand-suffix cutoff was 55 chars; with " | Apex Nepal" (+13) the true cutoff is 47 (47+13=60). Fixed + boundary test.
5. **(Minor) Hub pages had no ISR.** `PillarPage` became async (cluster posts), but the 5 hub pages exported no `revalidate`, so the list would freeze at build time. Added `revalidate = 3600`.
6. **(Minor) Authors index ignored `username`** when building profile links (linked the name-derived duplicate URL). Now uses `authorSlugFor()`.
7. **(Minor, SQL) Over-broad bio wipe:** the merge replaced any bio matching `'%Doha%'`; narrowed to the known boilerplate phrasings so a legitimate "tested from Doha" bio survives.
8. **(Minor, SQL) Trigger missed the new fields:** filling only `tested_method`/`sources` (the exact upgrade advised for batch posts) wouldn't bump `dateModified`. Added to the trigger (jsonb compared as text); `seo_title` intentionally excluded.
9. **(Minor) Analyser double-penalty:** "Headline Unfurl Length" scored the raw H1 even when a good SEO title existed. Now measures the effective title.

### Post-merge hotfix (after PR #9 merged)

Vercel's build (with real Supabase, so article pages actually prerender) caught one more first-pass mistake the local checks structurally could not: in `app/blog/[slug]/ArticleContent.jsx`, parallel same-file edits had overwritten each other, leaving identifiers *used but never defined* (`authorProfileHref` — also written `href={{...}}` — `testedMethod`, `sources`, `reviewerName`, `normalizeCategory`, `isAffiliateHref`) plus the original import block. Any article prerender threw `ReferenceError`, blocking deploys (the live deployment was unaffected). Fixed by restoring the imports/helper/definitions and the affiliate/reviewed-by blocks; guarded by `tests/articleContent.test.js`, which server-renders the component and reproduces the original error on the broken file, and by a clean repo-wide ESLint `no-undef` scan.

## Verified before handoff

- `npm test` — 60/60 pass (15 new playbook tests, incl. regression tests for the corrections above).
- `npm run build` — passes; `/blog/category/*` ×6 generated; hub pages on 1h ISR.
- `npm run lint` — no new errors (1 pre-existing error on `main` remains untouched).
- Runtime checks (local, no Supabase configured): `/blog/<missing>` → **404**, `/authors/akash` → **308** → founder page **200** (noindex fallback), unknown author → **404**, `POST /api/indexnow` → 400 foreign host / 202 own host, `/llms.txt` shows Nepal + real hubs, sitemap contains category pages, homepage HTML contains real stat numbers (no `0+`).
