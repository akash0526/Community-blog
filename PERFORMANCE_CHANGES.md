# 🎨 Modern Design Upgrade + Performance Optimization

## Design Changes (100% CSS-only — zero JS cost)

### `globals.css` — New Design System
- **`.gradient-text`** — Animated gradient on headings (indigo → purple)
- **`.card-hover`** — Lift + glow shadow on hover (`transform` only — GPU composited)
- **`.gradient-border`** — Animated gradient border via `::before` pseudo-element
- **`.glass`** — Glassmorphism (backdrop-blur + semi-transparent bg)
- **`.badge-glow`** — Soft pulsing glow on badges
- **`.fade-up`** — Entrance animation (translateY + opacity)
- **`.stagger`** — Staggered children entrance (12 delay slots)
- **`.skeleton`** — Shimmer loading placeholder
- **`.img-zoom`** — Image zoom on hover (transform: scale)
- **`.arrow-bounce`** — Bouncing arrow animation
- **`.link-underline`** — Animated gradient underline on hover
- **`.gradient-line`** — Gradient separator line
- **Modern `:focus-visible`** rings for accessibility
- **Updated `.btn-primary`** — Gradient background (indigo → purple) with glow shadow
- **New CSS variables** — `--gradient-start`, `--gradient-end`, `--glow-color`, `--glass-bg`, `--glass-border`

### `app/page.jsx` — Hero + Featured
- Hero card → **glassmorphic** with subtle gradient orbs behind
- Hero heading → **gradient animated text**
- CTA buttons → **gradient** primary + improved secondary
- "Explore stories" → **bouncing arrow**
- Footer links → **animated gradient underlines**
- Featured card → **gradient animated border** + `card-hover` lift
- Featured image → **zoom on hover**
- Category badge → **glassmorphic**
- Avatar border → **indigo ring**
- "Read →" → **slides right on hover**

### `components/CommunityFeed.jsx` — Card Grid
- Category pills → **glassmorphic** inactive + **gradient** active with glow
- Cards → **`card-hover`** lift + glow on hover
- Card images → **zoom on hover**
- Category badges → **glassmorphic**
- Card grid → **staggered fade-in** entrance
- Avatars → **indigo ring**
- "Read →" → **slides right on hover**
- Search input → **improved focus ring**
- "Load more" → **gradient animated border**
- Empty state → **glassmorphic**

### `components/CookieConsent.jsx` — Cookie Banner
- Banner → **glassmorphic**
- Cookie emoji → added "🍪"
- Accept button → **gradient primary**
- Decline button → **secondary style**
- Entrance → **fade-up animation**

### `app/layout.tsx` — Footer
- Footer top → **gradient separator line** instead of solid border
- Footer links → **animated gradient underlines** on hover
- Footer divider → **gradient line** between content and copyright

---

## Performance Changes (from previous optimization)

### `next.config.ts`
- Image remote patterns for Unsplash, Supabase, GitHub, etc.
- Strip console.log in production

### `package.json`
- Browserslist → removes ~14 KiB of legacy polyfills

### `app/layout.tsx`
- Preconnect hints for external origins
- Lazy-loaded CookieConsent via `LazyCookieConsent`

### `components/LazyCookieConsent.jsx` (NEW)
- Dynamic import wrapper for ssr: false

### `lib/articles.js`
- `getPaginatedArticles()` — slim column selection, no body
- `getPublishedArticleCount()` — for hasMore pagination
- Optimized `getAllPublishedSlugs()` — slim columns

### `app/page.jsx`
- `next/image` with `priority` for featured (LCP fix)
- Paginated data fetching (12 per page)

### `components/CommunityFeed.jsx`
- `next/image` for card images + avatars
- "Load more" pagination via API

### `app/api/articles/route.ts` (NEW)
- Pagination API endpoint

### `components/DiscussionThread.jsx`
- `next/image` for avatars

### `app/blog/[slug]/ArticleContent.jsx`
- `next/image` for feature image + avatars

### `supabase_migrations/20260716_perf_index.sql` (NEW)
- Partial index on `articles(created_at DESC) WHERE status = 'published'`

---

## Post-Deploy Step

Run in **Supabase Dashboard → SQL Editor**:
```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_articles_published_recent
  ON articles (created_at DESC)
  WHERE status = 'published';
```
