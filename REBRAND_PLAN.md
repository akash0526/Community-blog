# Apex Nepal — Rebrand Audit & Plan (Phase 1)

**Date:** 2026-09-12
**Domain:** https://www.apex-nepal.com/ (kept)
**New Brand:** Apex Nepal — *Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools.*
**Audience:** Nepalis in Nepal and abroad — freelancers, students, small business owners. English primary, occasional Nepali phrases.
**Branch:** `feat/rebrand-ai-digital-tools` (forked from `arena/01a09467-community-blog` → backup `backup/pre-rebrand-20260912`)
**Status:** Phase 1 approved 2026-09-12, Phase 2 in progress. No live DB writes — SQL is manual.

---

## 1. Tech Stack Report

| Layer | Detail |
|---|---|
| **Framework** | Next.js 16.2.9 App Router + React 19.2.4 + TypeScript 5, Turbopack |
| **Styling** | Tailwind CSS v4 (+ @tailwindcss/postcss), custom design system in `app/globals.css` (glass, gradient-text, card-hover, etc.), dark/light via `localStorage apex_theme` |
| **Data/CMS** | Supabase (PostgreSQL + Auth + Storage). No Markdown files. Content in `public.articles` table, rendered via `react-markdown + remarkGfm + isomorphic-dompurify`. Fallback `lib/seedData.js` (3 demo posts) + `localStorage apex_articles_v1` drafts. |
| **Auth** | Supabase Auth + demo localStorage (`apex_demo_user`) via `components/AuthModal.jsx` |
| **SEO** | Custom `lib/seoEngine.js` (100-pt audit), `lib/seoUtils.js`, `lib/articles.js` helpers, `app/layout.tsx` global metadata + JSON-LD, per-article `generateMetadata` in `app/blog/[slug]/page.jsx` |
| **Images** | `next/image` with remotePatterns for Unsplash/Supabase/GitHub/ui-avatars |
| **Tests** | Vitest 4.1.9 (`npm run test`), ESLint 9 (`npm run lint`) |
| **Build** | `npm install` → `npm run dev` / `npm run build` / `npm start` |
| **Deploy** | Vercel (SITE_URL via `NEXT_PUBLIC_SITE_URL` || `https://www.apex-nepal.com`) |

### Folder Structure
```
app/
  layout.tsx, page.jsx, globals.css
  sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.svg
  blog/[slug]/page.jsx + ArticleContent.jsx
  authors/[slug]/page.tsx, authors/page.tsx
  studio/page.jsx, dashboard/page.jsx, kanban/page.jsx
  about/contact/editorial/privacy/terms/disclaimer/corrections (static)
  api/articles/route.ts
components/Navbar.jsx, CommunityFeed.jsx, AuthModal.jsx, DiscussionThread.jsx, CookieConsent.jsx
lib/articles.js, categories.js, seedData.js, seoEngine.js, seoUtils.js, supabase.js
public/apex-community-logo.svg, Logo.jpg, icon.svg
supabase_schema.sql, supabase_migrations/*.sql, tests/, next.config.ts
```

### Build / Lint / Test Baseline (2026-09-12)
- `npm install` ✅
- `npm run lint` → 35 problems (8 errors: setState-in-effect, 27 warnings: no-img-element, unused vars) — pre-existing
- `npm run test` → ✅ 24/24 passed (seoEngine 15, seedData 9)
- `npm run build` → ❌ fails offline (next/font/google fetch for Inter/Geist_Mono) — fixed in Phase 2 with system-font fallback

---

## 2. Content Locations & Data Model

- **Source of truth:** `public.articles` (Supabase):
  `id uuid PK, slug text UNIQUE, title, meta_description, category text DEFAULT 'Tech & AI', target_keyword, image_url, content (Markdown), status ('published'|'draft'), seo_score, pageviews, claps, author_id FK → profiles.id, created_at, published_at, updated_at`
- **Authors:** `public.profiles` (id, email, full_name, avatar_url, professional_role, bio)
- **Filtering:** `status='published'` drives homepage, sitemap, article lookup. Archiving = `status='draft'` + robots noindex (manual SQL, not auto).
- **Fallback:** `lib/seedData.js` + localStorage drafts.

---

## 3. Existing Routes, Categories & Posts

### Routes
| Route | Indexable | Notes |
|---|---|---|
| `/` | yes | SSR paginated feed, hero, featured |
| `/blog/[slug]` | yes | SSR + JSON-LD Article/Breadcrumb/Person, revalidate 60, increment_pageview |
| `/about`, `/contact`, `/authors`, `/authors/[slug]`, `/editorial`, `/privacy`, `/terms`, `/disclaimer`, `/corrections` | yes | static trust pages |
| `/dashboard`, `/studio`, `/kanban` | no | auth gated, not in sitemap |
| `/api/articles` | no | pagination JSON |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image` | — | dynamic/static SEO |

### SEO Defaults (pre-rebrand)
- `siteName: Apex`, `tagline: Open stories from around the world`
- Description: "Apex is an open global publishing platform where independent writers share tested, cited stories. Personal essays, tech guides, Qatar expat resources, and cultural reporting – by real authors."
- Keywords: apex, global blog, qatar expat, doha, nepal community, etc.
- JSON-LD: WebSite (SearchAction) + Organization (Doha, Qatar, 2025-11-01, founder Akash Adhikari)
- `robots: index true`, `verification.google: 3UGsGsV...`, `themeColor #4f46e5`

### Current Category Taxonomy (17)
```
Personal Stories, News & Current Affairs, Community Updates, Education & Learning,
Health & Wellness, Business & Finance, Food & Recipes, Sports, Entertainment,
Opinion & Essays, Philosophy & Culture, Travel & Lifestyle, Arts & Fiction,
Web Development, Tech & AI, Startups & Growth, SEO Strategy
```

### Existing Posts Grouped by Category
Live DB not accessible in audit sandbox (no SUPABASE_ANON_KEY). Fallback seed (3 posts):
- `Web Development` — why-connection-pooling-is-mandatory... (keep → Blogging & Hosting)
- `Tech & AI` — mastering-postgresql-rls... (keep → AI Tools)
- `Startups & Growth` — high-fidelity-static-site-generation... (keep → Small Business Tools)

All other categories (Food & Recipes, Travel & Lifestyle, Personal Stories, Health & Wellness, Sports, Entertainment, etc.) — existence unverified live. Will be handled via manual SQL SELECT-first script (see §5). No auto-archive on deploy.

---

## 4. New Taxonomy & Site Map (Post-Rebrand)

### New Categories (5, replaces 17) — `lib/categories.js`
```
AI Tools — 🤖 AI Tools
Freelancing in Nepal — 💼 Freelancing in Nepal
Blogging & Hosting — 🌐 Blogging & Hosting
Digital Payments — 💳 Digital Payments
Small Business Tools — 🏪 Small Business Tools
```
`AI for Students` merged into `AI Tools` per approval (not a separate pillar/nav/sitemap). Can split later after 5+ student posts.

### Site Map
```
 / (hero, 5-pillar grid, featured, feed)
 ├─ /ai-tools                 PILLAR 1
 ├─ /freelancing-in-nepal     PILLAR 2
 ├─ /blogging-hosting         PILLAR 3
 ├─ /digital-payments         PILLAR 4
 ├─ /small-business-tools     PILLAR 5
 ├─ /resources                affiliate tools table + disclosure
 ├─ /about (rebranded), /contact, /editorial, /privacy, /terms, /disclaimer, /corrections
 ├─ /blog/[slug] (6 categories now 5)
 ├─ /authors, /authors/[slug]
 ├─ /studio, /dashboard, /kanban (noindex)
```
**Header Nav:** `[Apex Nepal]  AI Tools | Freelancing | Blogging & Hosting | Payments | Business  [Resources] [Write]`
**Footer:** Categories (5) + Platform (About/Contact/Editorial/Corrections/Write) + Legal (Privacy/Terms/Disclaimer + affiliate disclosure + editor@apex-nepal.com). Location: Kathmandu • Global.

### SEO After Rebrand
- Title: `Apex Nepal — Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools.`
- Description: `Practical AI, freelancing, blogging, hosting & payment guides for Nepalis in Nepal & abroad. Tested tools, Nepali context, no fluff.`
- Keywords: apex nepal, ai tools nepal, freelancing nepal, blogging nepal, hostinger nepal, digital payments nepal, small business tools nepal, chatgpt nepal, etc.
- Locale: en (with `ne` alt where relevant), OpenGraph 1200×630 rebranded, manifest `Apex Nepal`, categories `["education","business","productivity"]`

---

## 5. Migration Plan (Keep / Rewrite / Archive / Redirect)

### Safety Guardrails
- No `DELETE`. Off-topic → `status='draft'` + noindex, manual SQL only. Backup: `backup/pre-rebrand-20260912` branch + `CREATE TABLE articles_backup_20260912 AS SELECT * FROM articles;` + CSV export before any UPDATE.
- Work branch `feat/rebrand-ai-digital-tools`. No invented affiliate IDs or earnings.
- All pillar/supporting stubs `status='draft'` + TODO markers.
- Env placeholders: `AFFILIATE_LINK_HOSTINGER`, `AFFILIATE_LINK_GRAMMARLY`, `#TODO-affiliate` + `NEXT_PUBLIC_AFFILIATE_*` env vars.
- font fallback: system stack so `npm run build` passes offline.

### Keep & Update (Global Rebrand)
- `app/layout.tsx`: siteName `Apex`→`Apex Nepal`, tagline/description/keywords, footer `Doha, Qatar`→`Kathmandu • Global`, org JSON-LD, header/footer copy
- `components/Navbar.jsx`: nav links to 5 categories + Resources, logo text `Apex`→`Apex Nepal`, mobile menu
- `app/page.jsx`: hero `Open stories...` → `Earn more with AI & digital tools`, subcopy for freelancers/students/SMBs, CTAs `Explore stories`→`Explore AI tools`, add 5-category pill nav
- `app/about/page.tsx`: rewrite to Nepal niche story
- `app/manifest.ts`, `app/opengraph-image.tsx`: rebrand copy
- `next.config.ts`: 301 redirects (see below)
- `app/sitemap.ts`, `app/robots.ts`: add pillars + /resources, keep AI bot allows

### Rewrite
- 3 fallback seeds rewritten to new pillars (e.g., Connection Pooling → Hostinger review for Nepal, PG RLS → AI tools stack, Core Web Vitals → SMB checklist)

### Archive (Manual SQL Only, NOT auto on deploy)
Off-topic candidates (verify live DB first):
```
Food & Recipes, Travel & Lifestyle, Personal Stories → candidates
+ Health & Wellness, Sports, Entertainment, Philosophy & Culture, Arts & Fiction → review
```
SQL file `supabase/migrations/20260912_rebrand_taxonomy.sql` includes SELECT-first verification comment at top and commented UPDATE.

### Redirect Map (301, in next.config.ts + redirects.csv)
| Old | New | Reason |
|---|---|---|
| `/blog/<food-recipe-slug>` | `/resources` | closest tools |
| `/blog/<travel-slug>` | `/` | no close match → homepage (avoid soft-404) |
| `/blog/<personal-story-slug>` | `/about` | author story → about |
| `/?category=Food%20%26%20Recipes` | `/resources` | filter param |
| `/?category=Travel%20%26%20Lifestyle` | `/` | filter param |
| `/?category=Personal%20Stories` | `/about` | filter param |
| any `*-slug-*` leaked slug | 404 noindex | CMS leak cleanup (already filtered in sitemap) |

Exact slugs generated via SQL select after verification; `redirects.csv` lists mapping, `next.config.ts` implements.

---

## 6. Topic-Cluster Structure (Pillar + 3–5 Stubs per Category)

Pillar template: `title: Pillar: <Category> — Ultimate Guide for Nepal (2026)`, `slug: /<kebab>`, meta 120-155 chars, outline [Why Nepal, Top tools, Setup, NPR pricing, FAQs], links to supporting stubs, affiliateDisclosure true.

| Pillar | Supporting Stubs (draft slugs) |
|---|---|
| `/ai-tools` | best-ai-writing-tools-nepal-grammarly-chatgpt, chatgpt-prompts-freelancers-nepal, ai-image-tools-canva-nepal, ai-productivity-stack-notion-nepal, is-ai-allowed-university-nepal (→ merged student content) |
| `/freelancing-in-nepal` | how-to-start-freelancing-nepal-upwork-fiverr, freelancing-profile-bio-examples-nepal, how-to-get-first-client-nepal-no-experience, freelancing-taxes-nepal-pan, best-freelancing-niches-nepal-2026 |
| `/blogging-hosting` | hostinger-review-nepal-blogging (AFFILIATE_LINK_HOSTINGER), how-to-start-blog-nepal-2026, cheap-domain-hosting-nepal-pay-with-esewa, wordpress-vs-static-hosting-nepal, blog-seo-checklist-nepal |
| `/digital-payments` | payoneer-vs-wise-nepal-freelancers, how-to-receive-paypal-nepal-alternatives, esewa-khalti-for-bloggers-setup, payoneer-fees-nepal-npr-withdrawal, best-payment-gateway-small-business-nepal — TODO: verify NPR fees/withdrawal limits |
| `/small-business-tools` | free-pos-billing-tools-nepal-retail, canva-for-business-nepal-marketing (AFFILIATE_LINK_CANVA), whatsapp-business-catalog-nepal, google-business-profile-nepal-setup, accounting-tools-nepal-bahi-khata |

Each stub: title, meta, outline H2s, internal links (→ pillar + 1–2 siblings), placeholder affiliate link with `rel="sponsored nofollow"`, `<AffiliateDisclosure />`.

---

## 7. Resources Page & Affiliate Disclosure

- `/resources` (Phase 3): hero "Tools we actually use & recommend — tested for Nepal", disclosure box top, table grouped by category: Tool | Best for | Why for Nepal | Pricing (NPR hint) | Link
  Placeholders: Hostinger/Grammarly/Canva (priority, env only), plus TODO rows for Payoneer, Wise, Notion, Daraz (marked `#TODO-affiliate`)
- Reusable `components/AffiliateDisclosure.jsx` (Phase 3): amber border box with "Some links are affiliate links..." + link to `/disclaimer`.

Env: `NEXT_PUBLIC_AFFILIATE_HOSTINGER_ID`, `NEXT_PUBLIC_AFFILIATE_GRAMMARLY_ID`, `NEXT_PUBLIC_AFFILIATE_CANVA_ID` (others TODO).

---

## 8. SEO & QA Checklist

- [ ] titles/meta/OG/JSON-LD updated (layout + per-article + 5 pillars)
- [ ] sitemap adds 5 pillars + /resources
- [ ] robots keeps AI bot allows, disallows /api /studio /dashboard /*?affiliate
- [ ] canonicals via SITE_URL + path
- [ ] redirects in next.config.ts + redirects.csv
- [ ] Affiliate disclosure component
- [ ] Performance: Lighthouse, mobile responsive, accessible (contrast, alt, focus-visible)
- [ ] No fake claims: TODO markers on stubs

---

## 9. Affiliate Programs to Apply For (Phase 4 report)
Hostinger, Grammarly, Canva Pro, Payoneer, Wise, Notion, Daraz Affiliate, eSewa/Khalti partner inquiry, Cloudflare.

---

## 10. Approvals & Assumptions (2026-09-12)

- Affiliate: Hostinger/Grammarly/Canva env placeholders only; Payoneer/Wise/Notion/Daraz TODO rows
- Payments: eSewa/Khalti/Payoneer/Wise generic placeholders + TODO verify NPR fees
- Language: English primary, occasional Nepali phrases; TODO Devanagari in Phase 5
- AI for Students merged into AI Tools (no separate pillar/nav/sitemap)
- Live posts: cannot share CSV — SQL manual, SELECT-first verification query at top of migration file
- Font fallback: system stack required for offline build
- Backup branch `backup/pre-rebrand-20260912` must exist & be pushed before edits (done)

---

**Next:** Phase 2 implementation (rebrand header/footer/hero/about/categories/SEO/redirects/font fallback) on `feat/rebrand-ai-digital-tools`, then `git diff --stat` + `npm run build/lint/test` + hero/nav screenshot description for review before Phase 3.
