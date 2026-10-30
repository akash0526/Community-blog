# UI refresh — modern, simple, fast

This pass rebuilds the front end around one calm design system and removes the
motion stack that was making the site *feel* slower than it is. Nothing about
the data layer or SEO output changed.

---

## 1. What it looks like now

| | Before | After |
| --- | --- | --- |
| Surfaces | Glassmorphism: translucent panels, `backdrop-filter: blur(24px)`, gradient rings, noise overlays | One flat surface colour + 1px hairline border, 14px radius, one soft shadow on hover |
| Accent | Purple → blue → pink gradients on every headline and button | One violet accent (`--accent`) used for links, active nav, tags and primary buttons |
| Background | Fixed mesh gradient + grid + film grain over the whole page | Plain paper colour, with a single static accent wash behind the hero |
| Hero | Animated orbs, three floating glass cards, parallax fade-out of the LCP headline | Typographic hero: badge, headline, one line of context, two actions, three real numbers, one image |
| Type | 900-weight headings, gradient text | Space Grotesk 600 with tighter tracking; emphasis is a colour, never a gradient |
| Theme | Dark-first | Follows the system, light and dark are symmetrical (same tokens, swapped values) |

Every route inherits the new tokens — including the legal pages, author pages,
category hubs and the article template.

## 2. What it feels like

- **Navigation is instant and visible.** The full-screen page curtain
  (`PageLoader`) and the 400 ms cross-fade (`PageTransition`) are gone. A 2px
  progress line appears only if a route is still pending after 120 ms
  (`components/NavigationProgress.tsx`), so prefetched pages change with no
  overlay at all.
- **Native scrolling.** Lenis was removed. Wheel/touch scrolling is the
  browser's own (best frame pacing, no double easing), and `scroll-margin-top`
  keeps anchor targets clear of the sticky header.
- **Filtering is local and immediate.** The homepage feed used to fire a
  debounced `/api/articles` request on every keystroke (skeleton → network →
  URL rewrite). It now filters the rows already in the browser and keeps the
  URL shareable; the network is used only for "load more". The archive adds
  `/` to focus search, a live result count, and `?q=` deep links.
- **No layout jank.** The theme toggle reserves its slot before hydration,
  mobile menus lock the page behind them, modals trap scroll and Escape,
  cards reserve their image aspect ratio.
- **Reduced motion is respected in CSS** (§20 of `globals.css`) rather than by
  a JS animation library.

## 3. Performance work

- Removed **`framer-motion`** (≈40 kB gzip) and **`@studio-freight/lenis`**
  from `package.json`, plus the nine `components/animations/*` wrappers, the
  parallax hero, the magnetic button and the page loader/transition/progress
  components they powered. Nothing in the shipped bundle imports either
  library any more.
- No `backdrop-filter` anywhere: every blurred layer used to force a repaint
  of the blurred region on each scroll frame.
- Scroll reveal is one `IntersectionObserver` + one rAF-throttled passive
  scroll listener (`components/SiteEffects.jsx`); DOM mutations only inspect
  the nodes that were actually added.
- The homepage hero and story cards are server components — the first
  interactive islands are the theme toggle, the auth modal and the feed
  filters.
- Images: AVIF/WebP, explicit `sizes`, `quality` 60–70 for card thumbnails,
  lazy by default and `priority` only for the two above-the-fold images.

## 4. Bugs fixed along the way

- A stray `=` character rendered in the middle of the homepage ("kits" grid).
- The homepage "kits" block was dead weight duplicating the category tiles;
  removed.
- `app/error.jsx` rendered its own `<html>`/`<body>` inside the root layout
  (invalid document nesting). It is now a normal error boundary.
- Light theme was partly broken: several cards used `text-slate-400` on a
  near-white surface and `border-white/10` hairlines. All of these pages now
  read from tokens.
- Demo mode 404'd on every seeded story (`getArticleBySlug` queried an
  unconfigured Supabase project and never fell back). Seeded stories now open,
  and related posts resolve locally instead of timing out.
- Auth modal had no Escape handler, no backdrop dismiss, no scroll lock and
  no dialog semantics; all four are in place.
- The newsletter and mobile menus no longer rely on hover-only affordances.

## 5. Conventions to keep

- **Tokens only.** Components never hardcode a colour; add a token in
  `globals.css` §1 if something new is needed. Light and dark must both be
  checked.
- **Layers matter.** Element defaults live in `@layer base` and component
  classes in `@layer components`, so Tailwind utilities always win. New
  component CSS belongs in the `components` layer.
- **`glass` / `glass-strong` / `gradient-text` still exist** as utilities, but
  now resolve to a plain surface and the accent colour. This is intentional:
  it keeps older pages on-brand without a risky sweep.
- **Do not add `loading.tsx` to `app/blog/[slug]/`.** A Suspense shell flushes
  HTTP 200 before the article lookup completes, which soft-404s missing
  stories (see the comment in that page). Use the navigation progress line for
  feedback on dynamic routes instead.
- **Motion budget:** transitions ≤ 250 ms, transforms/opacity only, no
  infinite ambient animation except the ticker (paused on hover) and the live
  dot.
