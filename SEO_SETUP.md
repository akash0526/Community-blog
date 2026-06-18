# 🚀 SEO & Search Engine Indexing — Deployment Guide

This guide walks you through **publishing the code changes** and then **getting Google, Bing, and other engines to actually index your site**.

---

## Part 1 — Ship the Code (5 minutes)

### Option A: I made these changes locally in this workspace

The changes are already written. Push them to GitHub:

```bash
cd Community-blog
git add -A
git commit -m "feat(seo): add sitemap, robots, OG image, JSON-LD, canonical URLs, robust slug lookup"
git push origin main
```

Vercel will auto-deploy. Wait ~60s for the build to finish (it compiles cleanly).

### Option B: Copy files into your local clone manually

If you prefer, the new/changed files are:

| Status | File | Purpose |
|--------|------|---------|
| 🆕 New | `app/sitemap.ts` | Dynamic XML sitemap (lists every article) |
| 🆕 New | `app/robots.ts` | robots.txt (tells crawlers what to crawl + sitemap URL) |
| 🆕 New | `app/manifest.ts` | PWA web manifest |
| 🆕 New | `app/icon.svg` | Favicon / site icon |
| 🆕 New | `app/opengraph-image.tsx` | Branded 1200×630 social share image |
| 🆕 New | `lib/articles.js` | Centralized data helpers + robust Unicode slug lookup |
| 🆕 New | `.env.example` | Documents required env vars |
| ✏️ Edited | `app/layout.tsx` | Full metadata, canonical, OG, Twitter, JSON-LD |
| ✏️ Edited | `app/blog/[slug]/page.jsx` | Per-article metadata + Article JSON-LD + slug fix |
| ✏️ Edited | `app/page.jsx` | Uses centralized article helper |

---

## Part 2 — Set Environment Variables (CRITICAL)

In Vercel: **Project → Settings → Environment Variables**, add:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SITE_URL` | `https://community-blog-six.vercel.app` | All |

> ⚠️ Your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` **must** already be set in Vercel, otherwise the production build can't fetch articles and the sitemap will only show seed content. (Your live site IS returning real articles, so these look set — just double-check.)

Redeploy after adding `NEXT_PUBLIC_SITE_URL`.

---

## Part 3 — Verify It Works

After deploy, check these URLs in your browser:

| URL | Should show |
|-----|-------------|
| `https://community-blog-six.vercel.app/robots.txt` | Allow rules + sitemap link (was 404 before) |
| `https://community-blog-six.vercel.app/sitemap.xml` | List of all your `<loc>` URLs (was 404 before) |
| `https://community-blog-six.vercel.app/opengraph-image` | A branded purple social card image |
| `https://community-blog-six.vercel.app/manifest.webmanifest` | JSON manifest |

Also **view page source** (Ctrl+U) on your homepage and any blog post — you should now see:
- `<title>`, `<meta name="description">`, `<meta property="og:...">`, `<link rel="canonical">`
- `<script type="application/ld+json">` blocks (Article + Organization + WebSite schema)

---

## Part 4 — Tell Google to Index You (15 minutes)

### Step 1: Google Search Console
1. Go to **https://search.google.com/search-console**
2. Sign in → **Add property** → choose **URL prefix** → enter `https://community-blog-six.vercel.app`
3. **Verify ownership**: choose the **HTML tag** method → copy the `content` value →
   open `app/layout.tsx`, uncomment the `verification` block, paste it:
   ```ts
   verification: {
     google: "PASTE-YOUR-CODE-HERE",
   },
   ```
   Redeploy, then click **Verify** in Search Console.

### Step 2: Submit your sitemap
- In Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**
- Status should turn ✅ "Success" within a few minutes.

### Step 3: Request indexing of key pages
- **URL Inspection** tool → paste your homepage URL → **Request Indexing**
- Repeat for your most important blog posts

### Step 4 (optional but recommended): Bing Webmaster Tools
- Go to **https://www.bing.com/webmasters**
- Import directly from Google Search Console (one click), or add the `msvalidate.01` meta tag the same way.
- Submit `sitemap.xml` there too.

### Step 5 (optional): IndexNow for instant Bing/Yandex indexing
After you publish a new article, you can ping engines instantly:
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "community-blog-six.vercel.app",
    "key": "YOUR_KEY",
    "urlList": ["https://community-blog-six.vercel.app/blog/your-new-slug"]
  }'
```

---

## Part 5 — Get Your First Visitors (ongoing)

Search indexing takes **days to weeks**. To get visitors *now* while you wait:

1. **Reddit / Hacker News / dev.to** — share genuinely useful articles (don't spam).
2. **Social** — your new OG image will make Twitter/LinkedIn/Facebook link previews look great.
3. **Backlinks** — the single biggest ranking factor. Get mentioned from other sites.
4. **Publish regularly** — Google ranks active sites higher. Aim for 1–2 posts/week.
5. **Write for search intent** — use your built-in SEO score tool in `/studio`; target specific questions people Google.
6. **Internal linking** — link between your own articles (helps Google crawl + keeps visitors on site).

---

## What Was Fixed (Technical Summary)

| Problem | Before | After |
|---------|--------|-------|
| Sitemap | ❌ 404 | ✅ Dynamic XML with every article |
| robots.txt | ❌ 404 | ✅ Allows crawling, points to sitemap |
| Nepali/Unicode article 404s | ❌ Lookup failed | ✅ NFC-normalized fuzzy lookup |
| Canonical URLs | ❌ Missing | ✅ On every page |
| OpenGraph / Twitter cards | ❌ Weak | ✅ Branded image + per-article |
| Structured data | ❌ None | ✅ Article, Organization, WebSite JSON-LD |
| metadataBase | ❌ Missing | ✅ Set (prevents relative-URL warnings) |
| Site metadata | ❌ Generic | ✅ Keywords, authors, robots directives |

**Note:** The pre-existing test failures in `tests/seoEngine.test.js` (17 tests) are unrelated to these changes — I did not modify `lib/seoEngine.js`. The production build passes cleanly.
