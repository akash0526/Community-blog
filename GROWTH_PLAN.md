# Apex Nepal — Traffic Growth Plan

**Goal:** go from ~0 organic traffic to a defensible 10k–20k organic sessions/month
within 6 months, with an owned audience (email/RSS) that does not depend on Google.

**Date:** 26 September 2026 · **Site:** https://www.apex-nepal.com ·
**Repo:** `akash0526/Community-blog` · **Stack:** Next.js 16 App Router + Supabase + Vercel

This is a plan, not a code change. Nothing in the repo was modified. Each item lists
**why it moves traffic**, the **files to touch**, and **effort**. Do them in order —
the list is sorted by (traffic impact ÷ effort), not by how interesting they are.

---

## The honest starting position

What I verified in the repo and on the live site:

| Signal | State | Growth consequence |
|---|---|---|
| Technical SEO base | ✅ Good — `app/sitemap.ts`, `app/robots.ts`, canonicals, Article + Person + Organization + BreadcrumbList JSON-LD, RSS at `/feed.xml`, `llms.txt`, AI crawlers explicitly allowed | Nothing is blocking you. The base is better than most Nepali blogs. |
| Analytics | ❌ **None installed** (`app/privacy/page.tsx` says so honestly) | You cannot see which page earns a click, so every decision below would be a guess. **Blocking issue.** |
| Content volume | ⚠️ 11 posts, nearly all published in one burst on 21 Sept 2026 | Google has almost nothing to rank and no publishing rhythm to trust. |
| Content quality | ✅ Genuinely strong — "Send money to Nepal: Wise vs IME", "What a blog costs in NPR", "First $100 on Upwork from Nepal" are real, high-intent, low-competition queries | This is the asset. The plan is mostly *more of this, plus distribution*. |
| Internal linking | ❌ No related-posts module on `app/blog/[slug]/` (202 + 294 lines, zero related links) | Every article is a dead end. Kills pages/session, crawl depth and topical clustering. |
| Category URLs | ❌ Filtering is `?category=` query-string only; no indexable `/category/...` pages | ~10 potential ranking hub pages don't exist. |
| Taxonomy | ❌ `lib/categories.js` defines 10 categories; live posts use different ones ("Personal Stories", "Startups & Growth", "Education & Learning"). An agentic-AI explainer is filed under *Personal Stories*; the Upwork guide under *Startups & Growth*. | Confuses users, breaks clustering, makes category pages useless before they exist. |
| Newsletter | ❌ `components/NewsletterForm.jsx` writes emails to **localStorage** and tells the user to email you instead | The single highest-value growth asset (owned audience) is a no-op. |
| Social share images | ⚠️ Most posts fall back to the generic `/opengraph-image`; several hotlink `imgs.search.brave.com` proxy URLs and Wikimedia | Low CTR on Facebook/LinkedIn — where Nepali traffic actually comes from — plus guaranteed link rot. |
| Homepage counters | ⚠️ Stat block renders `0+ / 0+ / 0 / 0%` without JS/scroll (visible in the server HTML) | Crawlers and slow clients see a site that claims zero of everything. |
| Off-site footprint | ❌ No inbound links, no social profiles, no citations (this matches your audit) | Nothing for Google to weigh, nothing to bootstrap discovery. |

**Diagnosis in one line:** the site is technically fine and editorially good, but it has
*no measurement, no distribution, no internal link graph, and no publishing cadence*.
Those four, in that order, are the growth plan.

---

## Phase 0 — Instrumentation (Week 1, ~4 hours) — do this before anything else

You cannot grow what you cannot see. Everything after this phase depends on it.

| # | Task | Files / where | Effort |
|---|---|---|---|
| 0.1 | **Google Search Console** — verify `www.apex-nepal.com` (DNS TXT via GoDaddy). Submit `/sitemap.xml`. Check *Pages → Not indexed* weekly. | GoDaddy DNS | 30 min |
| 0.2 | **Bing Webmaster Tools** — import from GSC in one click. Bing feeds ChatGPT search. | — | 10 min |
| 0.3 | ✅ **DONE (26 Sep 2026)** — **Privacy-first analytics**: Vercel Web Analytics + Speed Insights mounted in `app/layout.tsx`; cookieless, first-party, outside the consent gate. `app/privacy/page.tsx` updated to describe exactly what is collected. **Remaining: enable Analytics + Speed Insights in the Vercel dashboard (Project → Analytics → Enable) and redeploy — no data is collected until you do.** | `app/layout.tsx`, `app/privacy/page.tsx` | done |
| 0.4 | **Outbound click tracking** on resource/affiliate links | `app/resources/page.jsx`, `lib/resources.js` | 1 h |
| 0.5 | **IndexNow ping** on publish — instant Bing/Yandex indexing | new `app/api/indexnow/route.ts`, called from the publish action in `app/studio/` | 1 h |
| 0.6 | **Confirm host canonicalisation** — the apex domain 301s to `www`; make sure `NEXT_PUBLIC_SITE_URL` is set to `https://www.apex-nepal.com` in Vercel so sitemap + canonicals never split signals | Vercel env | 10 min |

**Success check (end of week 1):** GSC shows the sitemap read and ≥ 20 URLs discovered.

---

## Phase 1 — Unlock the traffic you've already earned (Weeks 1–3)

These are one-time code changes with compounding returns. They roughly double the
value of the 11 articles you already have.

### 1.1 Related posts + "next read" on every article — **highest-ROI code change**
Add a 3-card related block (same category → same tag → newest fallback) plus one
inline contextual link mid-article.
*Files:* `app/blog/[slug]/ArticleContent.jsx`, `lib/articles.js` (`getRelatedArticles(slug, category, limit)`).
*Impact:* pages/session up ~40–70%, crawl depth, topical clustering. **Effort: 3 h.**

### 1.2 Real category landing pages
Turn `?category=` into static, indexable `/topics/[slug]` pages — H1, 100-word intro,
the matching resource block from `lib/resources.js`, article list, `CollectionPage` +
`ItemList` JSON-LD, added to `app/sitemap.ts`. Keep `?category=` working as a 301.
*Impact:* ~8–10 new hub pages that can rank for "AI tools Nepal", "freelancing Nepal",
"web hosting Nepal" — head terms single articles will never win. **Effort: 4 h.**

### 1.3 Fix the taxonomy first (blocker for 1.2)
Collapse live categories onto the six pillars the homepage already advertises
(AI Tools, Freelancing, Hosting, Payments, Small Business, Students) + "Nepal Tech News".
Re-file the mislabelled posts (agentic AI → AI Tools; Upwork → Freelancing;
PAN/invoicing → Payments & Finance).
*Files:* `lib/categories.js`, Supabase `articles.category`, `/studio` dropdown. **Effort: 2 h.**

### 1.4 Per-article OG images
Generate them from the title with `ImageResponse` at `app/blog/[slug]/opengraph-image.tsx`
(same trick as the root one). Kills the generic fallback and the rotting
`imgs.search.brave.com` hotlinks in one move.
*Impact:* Facebook/LinkedIn CTR — your #1 near-term traffic channel. **Effort: 2 h.**

### 1.5 FAQ + HowTo + ItemList schema
- `FAQPage` on any article with a Q&A section (fees, limits, "is X legal in Nepal")
- `ItemList` on `/resources` and each pillar page
- `Product`/`Review`-style comparison tables in the vs. posts
*Impact:* rich results and — bigger for you — **AI answer citations**. Your `llms.txt`
+ open AI-crawler policy already positions you for ChatGPT/Perplexity traffic; schema
and clean tables are what actually get you quoted. **Effort: 3 h.**

### 1.6 Server-render the homepage counters
Render real numbers in HTML and animate *from* them, instead of showing `0+ / 0%` to
crawlers and no-JS visitors. *Files:* `app/page.jsx`, `components/SiteEffects.jsx`. **Effort: 1 h.**

### 1.7 Make the newsletter real
Wire `components/NewsletterForm.jsx` to a Supabase `subscribers` table (or Buttondown /
Resend Audiences) with double opt-in. Add the form to the end of every article, not
just the homepage.
*Why it's growth, not retention:* email is the only channel where a returning reader
costs you nothing. Every week you ship without this, you throw away the audience you
paid for in distribution. **Effort: 3 h.**

---

## Phase 2 — Content engine (Weeks 2–12, ongoing)

**Cadence: 2 posts/week, every week, forever.** Consistency beats volume bursts.
11 → ~35 posts by Christmas; that's the point at which Nepal-niche sites typically
start compounding.

### The strategy: own "X in Nepal, in NPR, in 2026"
You are not competing with global sites. You are competing with nothing — these queries
have thin, outdated, or purely global answers. Every post must contain at least one of:
a **rupee price**, a **local rail** (eSewa/Khalti/Fonepay/IME/NTC/Ncell/WorldLink), or a
**Nepali legal/tax fact** (NRB, IRD, FY 2083/84). That's your moat and your differentiator
from the other twelve "Apex Nepal" businesses.

### Cluster roadmap (each cluster = 1 pillar page + 6–10 supporting posts, all interlinked)

| Cluster | Pillar (exists) | Next 6 posts to write | Intent |
|---|---|---|---|
| **Payments** (best commercial intent) | `/digital-payments` | How to get a dollar card in Nepal · Payoneer vs Wise for Nepali freelancers · Fonepay QR for a small shop · NRB rules on receiving foreign currency · eSewa merchant fees 2026 · Getting paid from Fiverr into a Nepali bank | Transactional |
| **Freelancing** | `/freelancing-in-nepal` | Upwork Connects budget on NPR income · Fiverr vs Upwork from Nepal · Nepali freelancer tax filing step-by-step · Portfolio site for NPR 0 · Time zones for US/EU clients · Red-flag clients | Info → transactional |
| **Students** (highest volume) | `/resources#students` | Free CS50 certificate from Nepal · GitHub Student Pack with a Nepali college email · Best free AI study tools on an NTC pack · IOE/CSIT/BCA resources · Loksewa IT prep, free · Free laptops/refurb buying guide | Informational, huge volume |
| **Hosting & blogging** | `/blogging-hosting` | Free `.com.np` domain: full application walkthrough (**link magnet — nobody has a good one**) · Nepali hosting vs Hostinger speed test · Cloudflare setup for a Nepali site · Making AdSense work from Nepal · Getting paid by AdSense in NPR | Commercial |
| **Small business** | `/small-business-tools` | Google Business Profile for a Nepali shop · Free billing app that works offline · Selling on Facebook/TikTok Shop from Nepal · Free IRD-compliant invoice template | Local commercial |
| **AI tools** | `/ai-tools` | Which AI tools work without a VPN in Nepal (**monthly-updated, becomes your signature page**) · Paying for ChatGPT Plus from Nepal · Free alternatives to paid AI · Nepali-language AI: what actually works | Trending, high share rate |

### Two evergreen "traffic machines" worth building once
1. **`/ai-tools/works-in-nepal`** — a filterable table: tool · works without VPN? · accepts Nepali card? · free tier · last tested date. Update monthly. This is the page people bookmark, share in Facebook groups, and link to.
2. **Live NPR price tracker** for hosting/domains/AI subscriptions, driven from `lib/resources.js` with a `lastVerified` date per row. It also fixes the trust gap from your audit: *"tested from Nepal" becomes a dated, checkable claim instead of a slogan.*

### Refresh loop
Every article gets a visible **"Last updated"** and a real refresh every 90 days
(prices, limits, screenshots). Log changes on `/corrections`. Refreshing a ranking post
is usually 3–5× cheaper per visitor than writing a new one.

---

## Phase 3 — Distribution (start Week 2, never stop)

**In Nepal, SEO is the long game; Facebook groups and Reddit are this month's traffic.**
Expect Phase 3 to out-deliver Phase 2 for the first 3 months.

### 3.1 Communities — where your readers already are
- **Facebook:** IT Entrepreneurs for Nepal (~15k), Online Workers in Nepal (~17k), CSIT Association of Nepal (~13k), ITSNP, Frontenders Community Nepal, WordPress Nepal, Python Users Group Nepal, Nepali Freelancers groups ([list](https://ictbyte.com/nepal/these-are-must-join-facebook-groups-if-you-are-tech-person-from-nepal/), [developer groups index](https://github.com/developers-nepal/groups))
- **Reddit:** r/technepal, r/Nepal, r/freelancednepal, r/NepalStock (for the payments/fees posts)
- **Discord:** ITSNP, Freelanced Nepal, Developers Circle Nepal
- **LinkedIn:** your own feed — carousel version of each guide

**The rule that decides whether this works:** post the *answer*, not the link. Write the
150-word version natively in the group, then "full fee table and sources here →".
Link-drops get removed and burn the domain; genuinely useful answers get pinned.
Budget 30 min/day, 1 post per group per week maximum.

### 3.2 Backlinks (target: 10–15 real links in 90 days)
- **Nepali tech media guest posts:** TechLekh (accepts submissions), ICTFrame (`news@ictframe.com`), TechPana, NepaliICT, GadgetByte, Nepalitelecom. Pitch data, not opinion — "we tested 17 AI tools on NTC/Ncell, here's what fails."
- **Free directories/citations:** Google Business Profile, Nepali startup directories, GitHub topic lists (`awesome-nepal`), Product Hunt for the resource directory.
- **Be a source:** original data (speed tests, fee comparisons, screenshots of real transfers) is the only thing Nepali blogs and journalists will link to.
- **Your own `/write-for-us`:** actively recruit 3–5 contributors from the Facebook groups. Contributors bring their own audience and their own backlinks — and they directly answer your audit's "self-reported, unverified" problem.

### 3.3 Repurposing (one article → five assets)
YouTube Short / TikTok (huge in Nepal, TechPana proves it) · LinkedIn carousel ·
X thread · Quora answers on "how to receive money in Nepal" style questions (these rank
in Google for years) · the Thursday email.

### 3.4 AI search — your quiet advantage
You already allow GPTBot, ClaudeBot, PerplexityBot and ship `llms.txt`. Add: clear
question-style H2s, a one-paragraph direct answer under each, dated fee tables, and
explicit source citations. Nepal-specific queries have so little competition that being
the cited source in ChatGPT is realistic within months.

---

## Phase 4 — Brand disambiguation (Weeks 4–8, from your audit)

Your audit's "brand confusion" finding is also a *traffic* problem: you can never own
the query "Apex Nepal" (trekking, college, hospital, bank). Don't try.

- **Own "Apex Nepal tech" / "Apex tools Nepal"** — use the qualifier consistently in
  `<title>` templates, OG titles, and every social bio.
- **Add `Organization` + `WebSite` `alternateName`** ("Apex Nepal Tech Resources"),
  `foundingDate`, `sameAs` → GitHub/LinkedIn/X/Facebook, and `knowsAbout` in `app/layout.tsx`.
- **Claim matching handles** on X, Facebook page, LinkedIn page, YouTube, GitHub org
  — one consistent handle (e.g. `@apexnepaltech`). `sameAs` without live profiles does nothing.
- **Publish a public WHOIS-consistent identity**: owner name, launch date, location on
  `/about` (already partly there) and unhide registrant details at GoDaddy if you're
  comfortable. New + anonymous is the combination that reads as risky.
- Long term, if budget allows, a memorable non-conflicting domain with a 301 is worth
  more than fighting twelve namesakes forever.

---

## 90-day schedule

| Weeks | Ship | Target |
|---|---|---|
| **1** | Phase 0 in full + taxonomy fix (1.3) | GSC + analytics live; sitemap read |
| **2** | Related posts (1.1), OG images (1.4), newsletter wired (1.7); start Facebook/Reddit posting | First 100 real sessions; first 10 subscribers |
| **3–4** | Category pages (1.2), schema (1.5), counters (1.6); 4 new posts (Payments + Students clusters) | 15 posts indexed; 300 sessions/mo |
| **5–8** | 8 posts; launch `/ai-tools/works-in-nepal`; 3 guest-post pitches; recruit 2 contributors | 25 posts; 1–2k sessions/mo; 5 backlinks |
| **9–12** | 8 posts; NPR price tracker; refresh the 5 oldest posts; Product Hunt / directory push | 33 posts; 3–5k sessions/mo; 10+ backlinks; 150 subscribers |

**Months 4–6:** hold 2 posts/week, double down on whichever cluster GSC shows winning,
and start the refresh loop. 10k+ sessions/month is realistic by month 6 *if* the cadence
never breaks.

---

## What to measure (weekly, 15 minutes)

1. GSC: impressions, clicks, average position, **pages indexed vs submitted**
2. Top 10 queries — write the next post about query #11–20 (proven demand, zero effort to find)
3. Sessions by channel — is Facebook still beating Google? (it will be, until ~month 3)
4. Email subscribers — the only number that survives an algorithm update
5. Referring domains — target +3/month

## Anti-goals

- ❌ Buying links or PBNs — fatal for a brand-new domain with a confusable name
- ❌ AI-generated bulk posts — your entire differentiator is *"tested from Nepal"*
- ❌ Chasing global keywords ("best AI tools 2026") — you will lose to million-dollar sites
- ❌ Redesigns before Phase 0–1 ship — the design is already good; the plumbing isn't

---

## First three things to do on Monday

1. Verify Search Console + install analytics (**45 minutes** — unblocks everything)
2. Ship related posts + per-article OG images (**one evening**)
3. Post the "Send money to Nepal" guide as a native answer in r/technepal and two
   Facebook groups, with the link at the end (**30 minutes, first real traffic**)
