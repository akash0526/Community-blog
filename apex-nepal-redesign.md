# APEX NEPAL — REDESIGN BRIEF
## "Himalayan Editorial"

---

# ROLE

You are the front-end engineer implementing a finished design. The design is
complete and non-negotiable. Do not improvise, do not offer alternatives, do
not "improve" any value. Implement exactly what is specified. If a value seems
unusual, it is intentional — apply it as written.

# TASK

Redesign https://www.apex-nepal.com/ to the "Himalayan Editorial" system
specified in this document.

Preserve ALL existing content, copy, routes, links, form behavior and
functionality. This is a visual redesign, not a content rewrite and not a
rebuild. If the current site has sections not listed, keep them and apply the
same tokens, typography and spacing rules.

Do not ask clarifying questions. Where the current markup is unknown, make the
minimal structural change needed to hit the spec and note it in your final
report.

---

# NON-NEGOTIABLES

1. `--clay` is the ONLY interactive color. No other color on buttons, links,
   focus rings, or active states.
2. `--saffron` appears ONLY on micro-details (dots, ticks). Never on text.
3. No pure white (`#fff`) or pure black (`#000`) anywhere except white text on
   the clay button. Use `--surface` and `--ink`.
4. Nothing is centered on the page except the newsletter block and the footer
   base row. Hero, features, quote, categories are all left-aligned.
5. No emoji as icons. Every icon is an inline stroke SVG: 1.8 stroke-width,
   round linecap and linejoin, `currentColor`, 15–17px.
6. No purple, blue, or multicolor gradients. Any gradient must be a single-hue
   fade of an existing token, or omitted.
7. No stock photography of Everest, prayer flags, or generic mountain ranges.
   Use specific, authentic images (workspaces, streets, details) with
   `filter: saturate(0.85) contrast(1.04)`.
8. Border radius stays at 4px on cards, tiles, buttons, inputs. This is
   editorial, not bubbly.
9. Dark mode is a real token swap on `[data-theme="dark"]`. Not an override
   layer of `!important` rules.
10. `prefers-reduced-motion: reduce` disables all transforms, transitions and
    animations site-wide.

---

# 1. DESIGN TOKENS

Define as CSS custom properties on `:root` (or the equivalent theme file for
your stack). Every component reads from tokens — no hardcoded values.

## 1.1 Typography

Load in ONE request from Google Fonts. Preconnect to both font hosts first:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Mukta:wght@400;600&display=swap" rel="stylesheet">
```

Tokens:
```
--font-display: "Fraunces", Georgia, serif;
--font-body:    "Inter", system-ui, sans-serif;
--font-deva:    "Mukta", "Inter", sans-serif;
```

Headline rule (applies to h1, h2, h3 and display text):
```
font-family: var(--font-display);
font-weight: 600;
line-height: 1.02;
letter-spacing: -0.022em;
font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 1;
text-wrap: balance;
margin: 0;
```
h3 differs only in `letter-spacing: -0.015em;`.

Body copy:
```
font-family: var(--font-body);
font-size: var(--step-0);
line-height: 1.65;
color: var(--ink);
text-wrap: pretty;
```

Devanagari text must use `var(--font-deva)`. Include at least one Devanagari
wordmark — footer brand is `एपेक्स नेपाल` in Mukta 400, `--ink-faint`.

## 1.2 Type scale

```
--step-4:  clamp(2.75rem, 7vw, 5.25rem);      /* h1 */
--step-3:  clamp(2rem, 4vw, 3rem);            /* h2 */
--step-2:  clamp(1.5rem, 2.4vw, 1.875rem);    /* h3 */
--step-1:  1.3125rem;                          /* lede */
--step-0:  1.0625rem;                          /* body */
--step--1: 0.875rem;                           /* captions */
--step--2: 0.6875rem;                          /* eyebrow labels */
```

## 1.3 Color — light (default)

```
--paper:      #F7F3EC;
--surface:    #FFFDFA;
--sunken:     #EFE9DE;
--hairline:   #E3DACD;
--ink:        #17130F;
--ink-muted:  #6F6A5E;
--ink-faint:  #9A9384;
--clay:       #A8471F;
--clay-hover: #8E3A18;
--clay-tint:  #F3E3D8;
--saffron:    #E8A838;
```

## 1.4 Color — dark

Apply on `[data-theme="dark"]`:
```
--paper:      #131110;
--surface:    #1C1917;
--sunken:     #0E0C0B;
--hairline:   #2E2A26;
--ink:        #F2EDE4;
--ink-muted:  #A39C8F;
--ink-faint:  #6E675C;
--clay:       #E08A5C;
--clay-hover: #EFA07A;
--clay-tint:  #2A1C14;
```

## 1.5 Spacing, shape, motion

```
--gutter:  clamp(1.25rem, 5vw, 3rem);
--section: clamp(4.5rem, 10vw, 8rem);
--maxw:    1180px;
--radius:  4px;
--ease:    cubic-bezier(0.22, 1, 0.36, 1);
--dur:     500ms;
--shadow:  0 1px 2px rgba(23,19,15,0.04),
           0 12px 32px -12px rgba(23,19,15,0.10);
```

Dark mode overrides `--shadow` to:
```
0 1px 2px rgba(0,0,0,0.30), 0 12px 32px -12px rgba(0,0,0,0.50);
```

---

# 2. GLOBAL RULES

## 2.1 Base

```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: var(--step-0)/1.65 var(--font-body);
  -webkit-font-smoothing: antialiased;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
p { margin: 0; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
```

Wrapper:
```css
.wrap { max-width: var(--maxw); margin-inline: auto; padding-inline: var(--gutter); }
```
Every `<section>` gets `padding-block: var(--section);`.

## 2.2 Film grain (mandatory)

Add to `body::after`:
```css
content: "";
position: fixed; inset: 0; z-index: 9999; pointer-events: none;
opacity: 0.035;
mix-blend-mode: multiply;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
```
Dark mode: `mix-blend-mode: screen; opacity: 0.055;`

## 2.3 Focus

```css
:focus-visible {
  outline: 2px solid var(--clay);
  outline-offset: 2px;
  border-radius: 2px;
}
```
Never remove or suppress focus rings.

## 2.4 Skip link

First element in `<body>`:
```html
<a class="skip" href="#main">Skip to content</a>
```
```css
.skip { position: absolute; left: -9999px; }
.skip:focus {
  left: 1rem; top: 1rem; z-index: 9999;
  background: var(--surface); padding: .75rem 1rem;
  border-radius: var(--radius); border: 1px solid var(--clay);
}
```

## 2.5 Inline link style

`.link`:
```css
color: var(--clay);
font-weight: 500;
background-image: linear-gradient(var(--clay), var(--clay));
background-size: 0% 1.5px;
background-repeat: no-repeat;
background-position: 0 100%;
padding-bottom: 1px;
transition: background-size 320ms var(--ease);
```
Hover: `background-size: 100% 1.5px;`

## 2.6 Scroll reveal

Elements marked `.reveal`:
```css
opacity: 0; transform: translateY(14px);
transition: opacity 700ms var(--ease), transform 700ms var(--ease);
```
Add class `.in` on viewport entry via IntersectionObserver
(threshold: 0.12, rootMargin: "0px 0px -60px 0px"). Stagger by 60ms per index.

Under `prefers-reduced-motion: reduce`, `.reveal` is fully visible immediately
and all transitions are disabled.

---

# 3. BUTTONS

Base `.btn`:
```css
display: inline-flex; align-items: center; gap: 0.5rem;
padding: 0.8125rem 1.375rem;
border-radius: var(--radius);
font-family: var(--font-body);
font-size: 0.9375rem;
font-weight: 600;
letter-spacing: -0.005em;
border: 1px solid transparent;
cursor: pointer;
transition: transform 220ms var(--ease), background 220ms var(--ease),
            border-color 220ms var(--ease), color 220ms var(--ease);
```
Active: `transform: translateY(1px) scale(0.99);`

Icons inside buttons: 15px × 15px, `transition: transform 260ms var(--ease)`,
translate `+3px` on parent hover.

`.btn--primary`:
```css
background: var(--clay); color: #fff;
```
Hover: `background: var(--clay-hover);`
Dark mode: `color: #17130F;`

`.btn--ghost`:
```css
background: transparent;
border-color: var(--hairline);
color: var(--ink);
```
Hover: `border-color: var(--clay); color: var(--clay);`

---

# 4. HEADER (sticky)

Structure:
```html
<header class="header" id="header">
  <div class="wrap header__in">
    <a class="brand" href="/">Apex<span class="dot"></span>Nepal</a>
    <nav class="nav" aria-label="Main">
      <a href="/resources">Resources</a>
      <a href="/guides">Guides</a>
      <a href="/tools">Tools</a>
      <a href="/about">About</a>
    </nav>
    <div class="header__actions">
      <button class="icon-btn" id="themeBtn" aria-label="Toggle dark mode">…</button>
      <a class="btn btn--primary" href="/submit">Submit a resource …arrow</a>
    </div>
  </div>
</header>
```

Styles:
```css
.header {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color 300ms var(--ease);
}
.header.is-stuck { border-bottom-color: var(--hairline); }

.header__in {
  display: flex; align-items: center; justify-content: space-between;
  gap: 2rem; height: 68px;
}
```

Brand:
```css
.brand {
  font-family: var(--font-display);
  font-size: 1.1875rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variation-settings: "opsz" 24;
  display: flex; align-items: baseline; gap: 0.5rem;
}
.brand .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--clay); align-self: center; flex: none;
}
```

Nav:
```css
.nav { display: flex; gap: 1.75rem; font-size: 0.9375rem; font-weight: 500; }
.nav a {
  color: var(--ink-muted);
  position: relative;
  padding-block: 0.25rem;
  transition: color 200ms var(--ease);
}
.nav a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0;
  height: 1.5px; background: var(--clay);
  transform: scaleX(0); transform-origin: left;
  transition: transform 280ms var(--ease);
}
.nav a:hover { color: var(--ink); }
.nav a:hover::after { transform: scaleX(1); }
```

Icon button:
```css
.icon-btn {
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 1px solid var(--hairline); border-radius: var(--radius);
  background: transparent; cursor: pointer;
  transition: border-color 200ms var(--ease), color 200ms var(--ease);
}
.icon-btn:hover { border-color: var(--clay); color: var(--clay); }
.icon-btn svg { width: 16px; height: 16px; }
```

Header actions container:
```css
.header__actions { display: flex; align-items: center; gap: 0.75rem; }
```

JS — sticky hairline:
```js
const header = document.getElementById('header');
addEventListener('scroll', () =>
  header.classList.toggle('is-stuck', scrollY > 8), { passive: true }
);
```

Responsive:
```css
@media (max-width: 820px) { .nav { display: none; } }
```

---

# 5. HERO — asymmetric, NOT centered

```html
<section class="hero">
  <div class="wrap hero__grid">
    <div>…left column…</div>
    <div class="hero__visual">…right column…</div>
  </div>
</section>
```

Grid:
```css
.hero { padding-block: clamp(3.5rem, 8vw, 6.5rem) var(--section); }
.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
```

## Left column — in this exact order

**1. Eyebrow** (see §14.1):
```html
<p class="eyebrow"><span class="num">01</span> Curated for Nepal</p>
```

**2. `<h1>`** at `var(--step-4)`. One word in italic clay:
```html
Everything you need to build <em>from here</em>.
```
```css
.hero h1 { margin-bottom: 1.75rem; }
.hero h1 em {
  font-style: italic;
  color: var(--clay);
  font-variation-settings: "opsz" 144, "SOFT" 40, "WONK" 1;
}
```

**3. Lede** paragraph, class `.lede`:
```css
.lede {
  font-size: var(--step-1);
  color: var(--ink-muted);
  line-height: 1.55;
  max-width: 46ch;
}
```
Text: "A hand-checked directory of the tools, payment rails, guides and
communities that actually work for freelancers, founders and creators based in
Nepal."

**4. CTA row:**
```css
.hero__cta {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
  margin-top: 2.25rem;
}
```
- `.btn.btn--primary` "Browse resources" + right-arrow SVG.
- `.btn.btn--ghost` "Read the guides".

**5. Stats row:**
```css
.hero__stats {
  display: flex; flex-wrap: wrap; gap: 2.25rem;
  margin-top: 3rem; padding-top: 1.75rem;
  border-top: 1px solid var(--hairline);
}
.stat__n {
  font-family: var(--font-display);
  font-size: 1.75rem; font-weight: 600;
  letter-spacing: -0.03em; line-height: 1;
  font-variation-settings: "opsz" 40;
  color: var(--ink);
}
.stat__l {
  font-size: 0.75rem; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--ink-faint);
  margin-top: 0.375rem;
}
```
Three items: `140+ / Resources`, `9 / Categories`, `Weekly / Updated`.

## Right column — `.hero__visual`

```css
.hero__visual { position: relative; isolation: isolate; }
```

Contains, in order:

**a.** `<div class="hero__block">` — decorative background:
```css
.hero__block {
  position: absolute; inset: 8% -4% 12% 6%; z-index: -1;
  background: var(--clay-tint); border-radius: var(--radius);
}
```
`aria-hidden="true"`.

**b.** `<div class="hero__img">`:
```css
.hero__img {
  border-radius: var(--radius); overflow: hidden;
  box-shadow: var(--shadow); border: 1px solid var(--hairline);
  transform: rotate(-1.6deg);
}
.hero__img img {
  aspect-ratio: 4/5; object-fit: cover; width: 100%;
  filter: saturate(0.85) contrast(1.04);
}
```
Specific, non-postcard image. No Everest.

**c.** `<div class="hero__chip">`:
```css
.hero__chip {
  position: absolute; left: -1.5rem; bottom: 2.5rem; z-index: 2;
  background: var(--surface); border: 1px solid var(--hairline);
  border-radius: var(--radius); padding: 0.75rem 1rem;
  box-shadow: var(--shadow); transform: rotate(1.2deg);
  display: flex; align-items: center; gap: 0.625rem;
  font-size: 0.8125rem; font-weight: 500;
}
```
Content: a status dot + "4 added this week".

```css
.pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: #3E8E5A; flex: none;
  box-shadow: 0 0 0 0 rgba(62,142,90,.5);
  animation: pulse 2.4s infinite;
}
@keyframes pulse {
  70%  { box-shadow: 0 0 0 8px rgba(62,142,90,0); }
  100% { box-shadow: 0 0 0 0 rgba(62,142,90,0); }
}
```

## Responsive — below 900px

```css
@media (max-width: 900px) {
  .hero__grid { grid-template-columns: 1fr; gap: 3rem; }
  .hero__visual { max-width: 420px; }
  .hero__chip { left: -0.75rem; }
}
```

---

# 6. TICKER

Directly after the hero. Full-bleed. `aria-hidden="true"`.

```css
.ticker {
  border-block: 1px solid var(--hairline);
  background: var(--sunken);
  overflow: hidden;
  padding-block: 0.875rem;
  position: relative;
}
.ticker::before, .ticker::after {
  content: ""; position: absolute; top: 0; bottom: 0;
  width: 80px; z-index: 2; pointer-events: none;
}
.ticker::before { left: 0; background: linear-gradient(90deg, var(--sunken), transparent); }
.ticker::after  { right: 0; background: linear-gradient(270deg, var(--sunken), transparent); }

.ticker__track {
  display: flex; gap: 2.5rem; width: max-content;
  animation: slide 42s linear infinite;
}
.ticker:hover .ticker__track { animation-play-state: paused; }
@keyframes slide { to { transform: translateX(-50%); } }

.ticker__item {
  display: flex; align-items: center; gap: 0.75rem;
  flex: none; white-space: nowrap;
  font-size: 0.8125rem; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--ink-muted);
}
.ticker__item::after {
  content: ""; width: 4px; height: 4px; border-radius: 50%;
  background: var(--saffron); opacity: 0.7;
}
```

Content: Payments · AI Tools · Freelancing · Legal & Tax · Hosting · Design ·
Communities · Learning. Duplicate the set once so the loop is seamless.

Under `prefers-reduced-motion: reduce`, the animation is disabled.

---

# 7. CATEGORIES — bento grid

Eyebrow: `02 — Explore`. `<h2>` "Start where you are." (max-width: 16ch).
Lede below with `margin-top: 1.125rem`.

```css
.bento {
  display: grid; gap: 1rem;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(150px, auto);
  margin-top: 3rem;
}
.tile {
  grid-column: span 2;
  position: relative; overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: transform 300ms var(--ease),
              border-color 300ms var(--ease),
              box-shadow 300ms var(--ease);
}
.tile:hover {
  transform: translateY(-3px);
  border-color: var(--clay);
  box-shadow: var(--shadow);
}
.tile--wide { grid-column: span 4; }
.tile--tall { grid-row: span 2; }

.tile__icon {
  width: 34px; height: 34px; border-radius: var(--radius);
  background: var(--clay-tint); color: var(--clay);
  display: grid; place-items: center;
  margin-bottom: 1.25rem; flex: none;
}
.tile__icon svg { width: 17px; height: 17px; }

.tile h3 { font-size: 1.1875rem; margin-bottom: 0.375rem; }
.tile p  { font-size: 0.875rem; color: var(--ink-muted); line-height: 1.5; }

.tile__count {
  font-family: var(--font-display);
  font-size: 2.25rem; font-weight: 600;
  letter-spacing: -0.04em; line-height: 1;
  color: var(--clay);
  font-variation-settings: "opsz" 60;
}
```

Corner brackets come from §14.3.

Content (5 tiles, first is wide):
1. `tile--wide` — icon: card/rect — "Getting paid" — "Payment gateways,
   remittance routes and payout options that actually clear for Nepali
   freelancers and businesses." — count `18`.
2. `tile` — icon: sparkle — "AI tools" — "What's worth the subscription." — `31`.
3. `tile` — icon: briefcase — "Freelancing" — "Platforms, contracts, rates." — `24`.
4. `tile` — icon: scales — "Legal & tax" — "Registration, PAN, filing." — `12`.
5. `tile` — icon: users — "Communities" — "Where people actually reply." — `15`.

Below 860px:
```css
.bento { grid-template-columns: repeat(2, 1fr); }
.tile, .tile--wide { grid-column: span 1; }
.tile--tall { grid-row: span 1; }
```

---

# 8. MOTIF DIVIDER

Directly after the categories section, inside a `.wrap`:

```html
<div class="wrap"><div class="motif" aria-hidden="true"></div></div>
```

```css
.motif {
  height: 14px;
  opacity: 0.20;
  background-repeat: repeat-x;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='14' viewBox='0 0 32 14'%3E%3Cpath d='M16 1l6 6-6 6-6-6z' fill='none' stroke='%23A8471F' stroke-width='1'/%3E%3Cpath d='M0 7l5-4M0 7l5 4M32 7l-5-4M32 7l-5 4' stroke='%23A8471F' stroke-width='1'/%3E%3C/svg%3E");
}
```

Use this exact motif. Do not add others.

---

# 9. FEATURED CARDS

Header row: eyebrow `03 — Featured`, `<h2>` "Picked this week." on the left;
a `.link` "See all 140 resources →" on the right. Row is:
```css
display: flex; flex-wrap: wrap; justify-content: space-between;
align-items: flex-end; gap: 1.5rem;
```

```css
.cards {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem; margin-top: 3rem;
}
.card {
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex; flex-direction: column;
  position: relative;
  transition: transform 300ms var(--ease),
              border-color 300ms var(--ease),
              box-shadow 300ms var(--ease);
}
.card:hover {
  transform: translateY(-3px);
  border-color: var(--clay);
  box-shadow: var(--shadow);
}
.card__media {
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--sunken);
  border-bottom: 1px solid var(--hairline);
}
.card__media img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 600ms var(--ease);
}
.card:hover .card__media img { transform: scale(1.035); }

.card__body {
  padding: 1.375rem;
  display: flex; flex-direction: column; gap: 0.75rem; flex: 1;
}
.card__tag {
  align-self: flex-start;
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--clay); background: var(--clay-tint);
  padding: 0.25rem 0.5rem; border-radius: 2px;
}
.card h3 { font-size: 1.0625rem; line-height: 1.3; letter-spacing: -0.01em; }
.card p  { font-size: 0.875rem; color: var(--ink-muted); line-height: 1.55; }
.card__foot {
  margin-top: auto; padding-top: 0.875rem;
  border-top: 1px solid var(--hairline);
  display: flex; align-items: center; justify-content: space-between;
  font-size: 0.8125rem; color: var(--ink-faint);
}
```

Three cards. Use existing featured content if available; otherwise the current
site's top three listings. Every image: `loading="lazy"` with explicit `width`
and `height` attributes.

Below 860px: `.cards { grid-template-columns: 1fr; }`

---

# 10. EDITORIAL QUOTE

Section background: `var(--sunken)`. Borders `1px solid var(--hairline)` on
top and bottom.

```css
.quote {
  display: grid; grid-template-columns: 1fr 1.3fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
.quote__img {
  border-radius: var(--radius); overflow: hidden;
  border: 1px solid var(--hairline);
}
.quote__img img {
  aspect-ratio: 3/4; object-fit: cover;
  filter: saturate(0.8);
}
blockquote {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--step-3);
  line-height: 1.18;
  letter-spacing: -0.028em;
  font-weight: 400;
  font-style: italic;
  font-variation-settings: "opsz" 96, "SOFT" 20, "WONK" 1;
}
blockquote .mark { color: var(--clay); font-style: normal; }
```

Eyebrow: `04 — Why this exists`.

Quote text:
> Most advice for builders assumes you're in San Francisco. This assumes
> you're in Kathmandu — and that everything should still work.

Wrap the opening and closing quotation marks in `<span class="mark">`.

Supporting line below, `--ink-muted`, `font-size: 0.9375rem`,
`margin-top: 1.75rem`:
> Every entry is checked against one question: does this actually function
> from Nepal, today?

Below 860px: single column; `.quote__img { max-width: 320px; }`

---

# 11. NEWSLETTER

Full-bleed `background: var(--clay); color: #fff;` (dark mode text: `#17130F`).
Reuse the same grain SVG from §2.2 as a `::after` overlay at
`opacity: 0.07`.
`padding-block: clamp(3.5rem, 8vw, 6rem);`

Content is centered here — the only centered block on the page.

```css
.news__in {
  position: relative; z-index: 2;
  max-width: 660px; margin-inline: auto; text-align: center;
}
```

Order:

**1.** Eyebrow `05 — Newsletter`, centered, `.num` in white, dot color
unchanged.

**2.** `<h2>` "One email. Every Thursday." — `margin-bottom: 1rem`.
`font-variation-settings: "opsz" 144, "SOFT" 40, "WONK" 1`.

**3.** Paragraph: "New resources, a short note on what changed, and nothing
else."
```css
font-size: var(--step-1); opacity: 0.82; margin-bottom: 2rem; line-height: 1.5;
```

**4.** Form:
```css
.news__form {
  display: flex; gap: 0.625rem; flex-wrap: wrap; justify-content: center;
}
.news__form input {
  flex: 1 1 280px; max-width: 340px;
  padding: 0.8125rem 1rem;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.12);
  color: #fff;
  transition: border-color 200ms var(--ease), background 200ms var(--ease);
}
.news__form input::placeholder { color: rgba(255,255,255,0.6); }
.news__form input:focus {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.7);
  outline: none;
}
```
Dark mode invert: `color: #17130F; border-color: rgba(23,19,15,0.3);
background: rgba(255,255,255,0.35);` and placeholder `rgba(23,19,15,0.6)`.

Button: `.btn.news__btn` with `background: #fff; color: var(--clay);`
Hover: `background: rgba(255,255,255,0.88);`

**5.** Note: `font-size: 0.8125rem; opacity: 0.7; margin-top: 1rem;`
> No spam. Unsubscribe any time.

Attach a `preventDefault` submit handler that resets the form. Preserve any
existing form endpoint if one is already wired up.

---

# 12. FOOTER

`padding-block: 4rem 2.5rem; background: var(--paper);`

```css
.footer__grid {
  display: grid; grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 3rem; padding-bottom: 3rem;
}
.footer h4 {
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-faint); margin: 0 0 1.125rem;
}
.footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.625rem; }
.footer li a {
  font-size: 0.9375rem; color: var(--ink-muted);
  transition: color 200ms var(--ease);
}
.footer li a:hover { color: var(--clay); }
.footer__brand p {
  font-size: 0.9375rem; color: var(--ink-muted);
  max-width: 34ch; margin-top: 0.875rem; line-height: 1.6;
}
.deva {
  font-family: var(--font-deva);
  font-size: 0.9375rem; color: var(--ink-faint);
  display: block; margin-top: 0.875rem;
}
.footer__base {
  border-top: 1px solid var(--hairline);
  padding-top: 1.75rem;
  display: flex; flex-wrap: wrap; gap: 1rem;
  justify-content: space-between;
  font-size: 0.8125rem; color: var(--ink-faint);
}
```

**Column 1** (`.footer__brand`): wordmark, tagline "A curated resource hub for
people building from Nepal.", Devanagari
`<span class="deva" lang="ne">एपेक्स नेपाल</span>`.

**Columns 2–4:**
- Browse: All resources, Guides, Tools.
- About: Our method, Submit a resource, Contact.
- Elsewhere: X / Twitter, LinkedIn, RSS.

**Base row:** "© 2026 Apex Nepal" left, "Made in Kathmandu" right.

Below 860px:
```css
.footer__grid { grid-template-columns: 1fr 1fr; gap: 2.25rem; }
.footer__brand { grid-column: 1 / -1; }
```

---

# 13. INTERACTION & MOTION

- Global easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Global durations: 500ms for entrance, 200–320ms for micro-interactions,
  600ms for image scale.
- Card and tile hover: `translateY(-3px)`, `border-color` → clay, shadow,
  image `scale(1.035)`.
- Button `:active`: `translateY(1px) scale(0.99)`.
- All motion wrapped in a `prefers-reduced-motion: reduce` block that sets
  `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms
  !important` on `*`, and disables the ticker animation.

---

# 14. SIGNATURE DETAILS (all mandatory)

## 14.1 Numbered eyebrows

Every section opens with:
```html
<p class="eyebrow"><span class="num">NN</span> Label</p>
```
```css
.eyebrow {
  display: flex; align-items: center; gap: 0.625rem;
  font-size: 0.6875rem; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-muted); margin-bottom: 1.25rem;
}
.eyebrow::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%;
  background: var(--saffron); flex: none;
}
.eyebrow .num { color: var(--clay); font-variant-numeric: tabular-nums; }
```
Numbering: hero `01`, categories `02`, featured `03`, quote `04`,
newsletter `05`.

## 14.2 Grain overlay

Defined in §2.2. Applied site-wide, always visible.

## 14.3 Card and tile corner brackets

Add to `.tile` and `.card`:
```css
.tile::before, .tile::after,
.card::before, .card::after {
  content: ""; position: absolute; width: 9px; height: 9px;
  border: 1px solid var(--clay);
  opacity: 0;
  transition: opacity 300ms var(--ease);
}
.tile::before, .card::before {
  top: 8px; left: 8px; border-right: 0; border-bottom: 0;
}
.tile::after, .card::after {
  bottom: 8px; right: 8px; border-left: 0; border-top: 0;
}
.tile:hover::before, .tile:hover::after,
.card:hover::before, .card:hover::after { opacity: 0.55; }
```

`.card` and `.tile` need `position: relative;`.

## 14.4 Motif divider

Defined in §8. One motif only, used once per page.

---

# 15. RESPONSIVE BREAKPOINTS

Only two breakpoints. Everything else is fluid via clamp().

**At `max-width: 900px`:**
- `.hero__grid` → single column, gap 3rem.
- `.hero__visual { max-width: 420px; }`
- `.hero__chip { left: -0.75rem; }`

**At `max-width: 860px`:**
- `.bento` → 2 columns, all tiles span 1.
- `.cards` → 1 column.
- `.quote` → single column, `.quote__img { max-width: 320px; }`
- `.footer__grid` → 1fr 1fr, brand spans both.

**At `max-width: 820px`:**
- `.nav { display: none; }`

Test at 360, 768, 1280, 1920. In dark mode. With `prefers-reduced-motion:
reduce` forced on.

---

# 16. ACCESSIBILITY

- Semantic landmarks: `<header>`, `<nav aria-label="Main">`, `<main id="main">`,
  `<section>`, `<article>` for cards, `<footer>`.
- One `<h1>` per page.
- Skip link as the first focusable element.
- Visible focus ring on every interactive element (`:focus-visible`).
- `aria-hidden="true"` on decorative SVGs and on the ticker band.
- `aria-label="Toggle dark mode"` on the theme button.
- Every `<img>` has a real `alt` (or empty `alt` if purely decorative).
- Theme toggle swaps the icon path between moon and sun.

Verify WCAG AA contrast. Required checks:
- `--ink` on `--paper`
- `--ink-muted` on `--paper`
- `--ink-faint` on `--surface`
- white on `--clay` (#A8471F)

Report the computed ratio for each in your final notes. If any fails, adjust
the token value (not the text size) and re-check.

---

# 17. PERFORMANCE

- Fonts: one request, `display=swap`, preconnect to both font hosts.
- Images: explicit `width` and `height` on every `<img>`. `loading="lazy"` on
  everything except the hero image.
- No new JS libraries. All interactions are vanilla — IntersectionObserver, a
  passive scroll listener, and a localStorage read/write.
- The grain overlay must be a single fixed element, not per-section.

---

# 18. THEME TOGGLE — implementation

```js
const root = document.documentElement;
const btn  = document.getElementById('themeBtn');
const icon = document.getElementById('themeIcon');

const sun  = 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4';
const moon = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';

function apply(theme){
  root.setAttribute('data-theme', theme);
  icon.setAttribute('d', theme === 'dark' ? sun : moon);
  try { localStorage.setItem('theme', theme); } catch(e){}
}

const saved = (() => {
  try { return localStorage.getItem('theme'); } catch(e){ return null; }
})();
apply(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

btn.addEventListener('click', () =>
  apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);
```

Add a small inline script in `<head>`, BEFORE the stylesheet, that reads
`localStorage.theme` and sets `data-theme` on `<html>` to prevent a flash of
the wrong theme.

---

# 19. SCROLL REVEAL — implementation

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('in'), i * 60);
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

Sticky header hairline (already in §4):
```js
const header = document.getElementById('header');
addEventListener('scroll', () =>
  header.classList.toggle('is-stuck', scrollY > 8), { passive: true }
);
```

---

# 20. DELIVERABLE

1. The updated code (HTML, CSS, JS) or a diff against the current site.
2. A short change log: which sections were rebuilt, which were kept as-is.
3. A list of assumptions you made where the existing markup was unclear.
4. The computed WCAG contrast ratios for the four pairs listed in §16.
5. A confirmation note covering: film grain applied, motif applied, corner
   brackets applied, dark mode works, reduced-motion works, no emoji icons.

Do not summarize the design back to me. Just build it.