# Apex Nepal — SEO Audit & Growth Playbook

**How to get your blog posts ranking and turn the traffic into income**

- **Website:** https://www.apex-nepal.com
- **Audit date:** 25 October 2026
- **Scope:** technical SEO, on-page SEO, content SEO, E-E-A-T, off-page SEO / links, brand & entity SEO, AI search (AI Overviews / ChatGPT / Perplexity), distribution and monetization

*How to use this document: read Section 1 (summary) first. Then do Section 13 (90-day plan) one week at a time. The other sections explain the reason for each task and how to do it.*

## Contents

1. Summary: where you stand and the 10 most important fixes
2. The money reality: why your keyword choice matters more than anything
3. What your site already does well (don't break these)
4. Audit findings: every problem I found, ranked
5. Technical SEO: fixes for your Next.js site
6. On-page SEO: how to write each post so it ranks
7. Content SEO: keyword research, topic clusters and what to write next
8. E-E-A-T: proving to Google that real experts write your posts
9. Off-page SEO: getting backlinks from Nepal and abroad
10. Brand / entity SEO: the 'Apex Nepal' name problem
11. AI search SEO: getting cited by Google AI Overviews, ChatGPT and Perplexity
12. Monetization: AdSense, affiliates and sponsorships
13. 90-day action plan
14. Checklist to use before you publish any post
15. Tools (mostly free) and sources

---

## 1. Summary

I crawled your homepage, sitemap (37 URLs), all 14 blog posts, author pages, robots.txt, RSS and llms.txt, then compared them with Google's latest guidance (the October 2026 helpful-content and AI-content documentation updates and the 2026 core updates).

**Overall verdict:** Your technical foundation is **better than most Nepali blogs**. You already have HTTPS, canonical tags, a sitemap, Article/Breadcrumb/Person schema, FAQs, tables of contents and AVIF images. Technical SEO is **not** what holds you back. Your rankings depend on four things:

1. **Trust and author identity (E-E-A-T)** are confusing. The same person appears as 3 different authors, the founder page says 'No published stories', and the site says it is based in Nepal on some pages and Doha, Qatar on others.
2. **Your publishing pattern can look like scaled content.** 10 of your 14 posts were published on the same day (22 Sept 2026). They have almost the same structure (6–7 H2s, 5 images, exactly 3 outside links). Google's September 2026 spam update and its October 2026 guidance target exactly this pattern.
3. **Almost no backlinks or brand signals yet.** The site started in Nov 2025, and a search for 'Apex Nepal' shows other companies with the same name (an LED company, two trekking agencies).
4. **Your keywords mostly bring low-value traffic.** Visitors from inside Nepal earn very little from ads (see Section 2), so you need to choose topics with monetization in mind.

### The 10 highest-impact fixes

| # | Fix | Type | Effort | Impact |
|---|---|---|---|---|
| 1 | Merge the 3 'Akash' author profiles into one real profile (photo, credentials, LinkedIn). 301-redirect the others. Fix the Doha/Nepal location conflict. | E-E-A-T | Low | Very high |
| 2 | Stop batch-publishing. Publish 2 posts a week, each with **original proof** (screenshots, receipts, your own test results). | Content | Ongoing | Very high |
| 3 | Add 'How I tested this' boxes and official citations (NRB, IRD, eSewa/Khalti docs) to all money/tax posts. 10 posts currently have only 3 outside links. | E-E-A-T / YMYL | Medium | High |
| 4 | Build 5 topic hub pages and link every post to its hub and to 3–5 related posts **inside the article text**. | On-page | Medium | High |
| 5 | Shorten SEO titles to about 60 characters (11 of 14 are longer now and get cut off in Google). | On-page | Low | Medium |
| 6 | Turn the remittance / 'send money to Nepal' topic into a cluster aimed at Nepalis abroad (higher ad value + affiliate income). | Strategy | Medium | Very high (revenue) |
| 7 | Create 1–2 free tools (e.g., 'Payoneer vs Wise NPR fee calculator'). You are a developer, so tools like this are your easiest way to earn backlinks. | Off-page | Medium | High |
| 8 | Fix technical items: real 404 status for missing posts, real category pages instead of /?category=, ads.txt, update llms.txt. | Technical | Low | Medium |
| 9 | Set up Google Search Console + Bing Webmaster Tools + GA4 and review them every week. | Measurement | Low | High |
| 10 | Distribute every post: Facebook groups, Reddit r/Nepal, LinkedIn, Viber/WhatsApp, newsletter. Early clicks and brand searches help a new site. | Off-page | Ongoing | High |

## 2. The money reality

You said your goal is revenue, so start with the numbers. Advertisers pay very different prices depending on where the visitor lives:

| Visitor location | Typical AdSense CPC | What it means |
|---|---|---|
| Nepal | about $0.03 per click | Even 100,000 Nepal visitors a month earn very little from display ads. |
| United States | about $0.61 per click | Roughly 20× more per click than Nepal. |
| US/UK/EU, general topics | RPM $3–$10 per 1,000 views | Usable as one income source. |
| US, finance-type topics | RPM $15–$40+ per 1,000 views | Money topics pay the most. |

*Sources: CPC by country tables [minidea.co.in, 4seohelp.com, 2026]; RPM ranges [Panstag, Aug 2026]. These are industry estimates, so check your own AdSense data once ads are live.*

> **What this means for your strategy**
>
> **1. Target Nepalis abroad, not only people in Nepal.** Millions of Nepalis work or study in the Gulf, Malaysia, Japan, Korea, Australia, the UK and the US. They search for remittance, visas, tax, banking and 'how to do X from abroad'. Advertisers pay much more for these visitors, and the topics fit affiliate links (Wise pays about £10 per new personal customer [affiliatejob.org, 2026]; Remitly reports up to ~$20 per new customer depending on corridor).
>
> **2. Use several income sources.** For an audience based in Nepal, affiliate links (hosting, domains, tools), sponsored posts from Nepali brands, a newsletter and digital products (templates, CV kits) usually earn far more than AdSense.
>
> **3. Your 'send money to Nepal' post is your most valuable page.** Build a whole cluster around it (Section 7).

## 3. What your site already does well

Keep all of these. If you redesign the site, check that none of them get lost.

| Area | What I found | Status |
|---|---|---|
| HTTPS + redirects | http:// and non-www both 308-redirect to https://www. HSTS is on. | ✅ Good |
| Canonical tags | All 14 posts have correct self-referencing canonicals. | ✅ Good |
| Sitemap + robots.txt | Sitemap is listed in robots.txt; private areas (/dashboard, /api) are blocked; tracking parameters are blocked. | ✅ Good |
| AI crawlers | GPTBot, ClaudeBot, PerplexityBot and Google-Extended are allowed, so AI search tools can cite you. | ✅ Good |
| Structured data | BlogPosting, BreadcrumbList, Person, Organization, WebSite on posts. | ✅ Good (small fixes below) |
| Robots meta | max-image-preview:large is set, which is required for large images in Google Discover. | ✅ Good |
| Headings | Exactly one H1 per post, with a clear H2/H3 structure. | ✅ Good |
| Images | Served as AVIF with srcset; all post images have alt text. | ✅ Good |
| Speed | Server response about 0.2–0.3 s from the Vercel edge cache. | ✅ Good |
| Article UX | Table of contents, 'Short answer' box, FAQ section, author box, reading time. | ✅ Very good |
| Trust pages | About, Contact, Privacy, Terms, Disclaimer, Editorial policy, Corrections, How we test. | ✅ Very good (needed for AdSense) |
| RSS | /feed.xml and /blog/rss.xml work. | ✅ Good |

## 4. Audit findings: problems ranked by priority

🔴 = fix this week · 🟠 = fix this month · 🟡 = nice to have

| P | Problem | Evidence from your site | Fix |
|---|---|---|---|
| 🔴 | One person, three author identities | Posts link to /authors/akash ('Payments & Tools Writer'). /authors/akash-adhikari (founder) says 'No published stories under this byline yet'. /authors/akash-d3682a09 is a third duplicate. Only 2 of them are in the sitemap. | Keep one URL (/authors/akash-adhikari). 301-redirect the other two. Reassign all posts to it. Use the same name everywhere. |
| 🔴 | Location conflicts | About page and footer: 'Editorial base: Nepal'. Author page: 'Doha, Qatar'. llms.txt: 'Editorial base: Doha, Qatar' and topics such as 'food and restaurant directories'. | Choose one true answer. Being based in Doha is fine if you say it honestly (for example, 'Nepali, based in Doha, covering Nepal'). Use it on every page and in llms.txt. |
| 🔴 | Batch publishing / templated pattern | 10 of 14 posts published 22 Sept 2026 within about 8 hours; nearly identical length (1,400–1,900 words), 6–7 H2s, 5 images, exactly 3 outside links. | Don't delete them. Over the next 6 weeks, improve each one with original proof and more sources, then update dateModified. From now on, publish on a steady schedule. |
| 🔴 | Few citations on YMYL (money/tax) posts | Posts on tax filing, USD receiving, eSewa vs Khalti and remittance have only 2–3 outside links, even though the site promises 'cited sources'. | Link to primary sources: Nepal Rastra Bank circulars, IRD, official fee pages. Add a 'Sources' list at the end of each post. |
| 🟠 | SEO titles too long | 11 of 14 titles are 74–108 characters, e.g., 'After Your First International Payment: PAN, Invoicing and Filing for Nepali Freelancers (FY 2083/84) \| Apex' (108). | Keep the long H1, but make the `<title>` about 60 characters or less (see examples in Section 6). |
| 🟠 | Weak internal linking | Most posts link to only 3 other posts, and only through the automatic 'Keep reading' box. | Add 3–5 links inside the article text with descriptive anchor text, plus a link up to the hub page. |
| 🟠 | Fake category URLs in breadcrumbs | BreadcrumbList points to https://www.apex-nepal.com/?category=Freelancing%20%26%20Remote%20Work, which canonicalizes to the homepage. | Make real category pages (e.g., /blog/category/freelancing) or point breadcrumbs to your existing hubs (/freelancing-in-nepal). |
| 🟠 | Too many categories for 14 posts | The blog filter shows 12 categories, and most have only 1–2 posts. | Merge them into 5–6 categories that match your hub pages. |
| 🟠 | Soft 404 on missing posts | /blog/any-wrong-slug returns HTTP 200 with noindex (other wrong URLs correctly return 404). | Return a real 404 status (code in Section 5). |
| 🟠 | No ads.txt | https://www.apex-nepal.com/ads.txt returns 404. | Add it as soon as you get an AdSense publisher ID. |
| 🟡 | Reused / unrelated images | The remote-jobs post uses an image named 'apex-nepal-payment-verification'. The alt text 'apex student portfolio workspace' also appears as a visible tag. | Use original screenshots and photos with descriptive file names and alt text. |
| 🟡 | Homepage stats show '0+' in HTML | The animated counters render as '0+ Resources, 0+ Guides' in the server HTML. | Render the real number on the server and animate it only on the client. |
| 🟡 | Generic homepage H1 | H1 'Build Your Digital Future' contains no keyword. | Use something like 'Tested Tools & Guides for Freelancers, Students and Small Businesses in Nepal'. |
| 🟡 | Organization schema is thin | sameAs contains only a GitHub profile. The logo is an SVG (Google prefers PNG/JPG, at least 112×112px). | Add Facebook, LinkedIn, X and YouTube profiles and a PNG logo. |
| 🟡 | inLanguage claims 'ne' | WebSite schema says en + ne, but there is no Nepali content. | Remove 'ne' until you publish in Nepali (or start publishing in Nepali, see Section 7). |
| 🟡 | Meta keywords tag | Present on every page. | Google ignores it. Harmless, so remove it whenever convenient. |
| 🟡 | JavaScript weight | About 377 KB of gzipped JS on a post page (16 chunks). | Check PageSpeed Insights (mobile). Lazy-load comments/reactions and keep INP under 200 ms. |

## 5. Technical SEO: fixes for your Next.js site

Your site runs Next.js (App Router, Turbopack) on Vercel with Supabase. The fixes below are written for that setup.

### 5.1 Return a real 404 for missing blog posts

This happens because the page starts streaming (probably from a loading.tsx file) before the post lookup finishes, so Next.js has already sent a 200 status. To fix it, call notFound() in generateMetadata, which runs before streaming starts, or remove loading.tsx from the blog/[slug] route.

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();               // runs before streaming -> real 404
  return {
    title: post.seoTitle ?? post.title,  // short SEO title (<= 60 chars)
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}
```

### 5.2 Merge the author pages with 301 redirects

```js
// next.config.js
async redirects() {
  return [
    { source: "/authors/akash", destination: "/authors/akash-adhikari", permanent: true },
    { source: "/authors/akash-d3682a09", destination: "/authors/akash-adhikari", permanent: true },
  ];
}
```

Then, in Supabase, point every post's author_id to the one profile. Update the Person schema `url` to /authors/akash-adhikari and add `sameAs` (LinkedIn, GitHub, X), `knowsAbout` and a real job title.

### 5.3 Separate SEO title and H1

Add a `seo_title` column to your posts table. Use the long, descriptive headline as the H1 and a short (≤ 60 characters), keyword-first title for the `<title>` tag. Change the title template from '%s | Apex' to '%s | Apex Nepal' only if the result still fits; otherwise drop the brand suffix on long titles.

### 5.4 Real category pages

- Create /blog/category/[slug] pages, each with a 150–300 word intro, the list of posts and links to the related hub.
- Or point breadcrumbs to your existing hubs: /freelancing-in-nepal, /digital-payments, /ai-tools, /blogging-hosting, /small-business-tools.
- Don't let filter URLs like /?category= get indexed. Your robots meta and canonical already handle this, but breadcrumbs should never link to them.

### 5.5 Structured data improvements

- **Organization**: add a PNG logo (512×512), every social profile in `sameAs`, `email`, `address` (country) and `founder` linking to the single author URL.
- **BlogPosting**: use BlogPosting on every post (one post, 'free AI stack', uses NewsArticle). Make `dateModified` change whenever you really update a post.
- **Comparison posts** (eSewa vs Khalti, Photopea vs Canva): optionally add `ItemList`. Don't add Review stars unless you have real ratings.
- **FAQ**: keep the visible FAQ sections because they help readers and AI answers. Google no longer shows FAQ rich results for most sites, so don't expect stars or dropdowns.
- **Tools you build**: add `SoftwareApplication` or `WebApplication` schema.
- Test every template at search.google.com/test/rich-results and validator.schema.org.

### 5.6 Other technical tasks

| Task | Why | How |
|---|---|---|
| ads.txt | Required for AdSense revenue. | Create /public/ads.txt containing: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0 |
| Update llms.txt | It currently describes a different site (Doha expat guides, food directories). | List your real hubs, your best 10 posts and your single author. |
| Bing Webmaster Tools + IndexNow | Bing powers parts of ChatGPT search and Copilot, and IndexNow gets new posts indexed in minutes. | Import from Search Console; ping IndexNow from your publish hook. |
| Image sitemap / original images | Google Images and Discover traffic. | Use your own images (screenshots); file names like esewa-limit-screen-2026.png. |
| Core Web Vitals | Ranking tiebreaker, and Nepali mobile users are on slower connections. | Targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 on mobile. Check PageSpeed Insights and Search Console > Core Web Vitals. |
| Lazy-load community widgets | Comments/reactions add JS to every post. | Use dynamic(() => import(...), { ssr: false }) and load them when the user scrolls near them. |
| Server-render homepage stats | Google sees '0+' now. | Render real numbers in the HTML. |
| Monitor 'Pages' report | Find 'Crawled – currently not indexed' posts. | Search Console > Indexing > Pages, checked weekly. |

## 6. On-page SEO: how to write each post so it ranks

### 6.1 Title tags (the most important on-page element)

Formula: **Main keyword + specific benefit or angle + year (if it changes yearly)**. Aim for about 60 characters or less. Put the keyword first.

| Current title (length) | Better SEO title |
|---|---|
| After Your First International Payment: PAN, Invoicing and Filing for Nepali Freelancers (FY 2083/84) \| Apex (108) | Freelancer Tax in Nepal: PAN, Invoices & Filing (2083/84) |
| How to Send Money to Nepal in 2026: Wise vs IME vs Bank Wire, Real Fees and Delivery Times \| Apex (97) | Send Money to Nepal 2026: Wise vs IME vs Bank (Real Fees) |
| How to Apply for Scholarships Abroad From Nepal: A Step-by-Step Free Toolkit (2026-27 Edition) \| Apex (101) | Scholarships for Nepali Students 2026-27: Free Toolkit |
| The Free AI Stack for Nepali Students: 7 Tools That Run on NTC Wi-Fi and Cost NPR 0 \| Apex (90) | 7 Free AI Tools for Nepali Students (Tested on NTC) |
| Your First $100 on Upwork from Nepal. \| Apex (44) | Upwork from Nepal: How to Earn Your First $100 (2026) |
| eSewa vs Khalti for Freelancers: When a Local Wallet Helps and When It Costs You \| Apex (87) | eSewa vs Khalti for Freelancers: Limits & Fees 2026 |

### 6.2 Meta descriptions

Your descriptions are already good (133–155 characters, keyword at the start). Keep doing that. Add a reason to click, such as a number, a test result or 'checked on [date]'.

### 6.3 Article structure that ranks and gets cited by AI

1. **Answer first.** Your 'Short answer' box is great. Keep it in the first 100 words and make it 40–60 words that answer the question directly.
2. **Use question headings.** Write H2s the way people search (for example, 'How much does Payoneer charge in Nepal?').
3. **Add a table to every comparison.** Pages with tables are cited much more often in AI Overviews.
4. **Add proof blocks.** Screenshots of the eSewa limit screen, a Payoneer fee receipt, a speed test on Ncell. This is the 'Experience' in E-E-A-T and the 'Originality' in Google's October 2026 guidance.
5. **Add a 'How I tested this' box** with dates, device, network (NTC/Ncell), amounts and what failed.
6. **Keep the FAQ** (3–7 real questions from Google's 'People also ask' and from Facebook groups).
7. **End with Sources and Last updated.** List official links and the update date.

### 6.4 Internal linking: hub and spoke

Turn your 5 existing category pages into real **hub pages** (also called pillar pages). Each hub should have 800–1,500 words of real guidance and link to every post in its topic. Each post should link back to its hub and to 3–5 sibling posts inside the article text.

| Hub page (exists) | Spoke posts that should link to it and to each other |
|---|---|
| /digital-payments | Send money to Nepal · Receiving USD · eSewa vs Khalti · Freelancer tax/PAN · (new) Payoneer fees · (new) Wise in Nepal |
| /freelancing-in-nepal | First $100 on Upwork · Remote jobs for students · Freelancer tax · (new) Fiverr from Nepal · (new) Upwork proposal examples |
| /ai-tools | Free AI stack · Agentic AI · AI scams in Nepal · (new) ChatGPT/Gemini in Nepal pricing in NPR |
| /blogging-hosting | What a blog costs in Nepal · (new) Free .com.np domain guide · (new) Best hosting for Nepal |
| /small-business-tools + /resources#students | Pasal online · Photopea vs Canva · Learn coding free · Scholarships toolkit |

Anchor text rule: use descriptive anchors ('compare eSewa and Khalti limits'), not 'click here'. Mix exact and natural phrases.

### 6.5 Keep posts fresh

- Fees, limits, rates and scholarships change. Review money posts **monthly** and other posts **every 3 months**.
- Only change the date when you actually change content, and show what changed ('Updated 3 Nov 2026: eSewa limit changed to…').
- Your /corrections page is a great trust signal. Link to it from updated posts.

## 7. Content SEO: keyword research, topic clusters and what to write

### 7.1 What Google rewards in 2026

Google's October 2026 documentation update lists four things quality raters judge in a page's main content: **Effort, Originality, Talent/Skill and Accuracy**. It says it is 'critical to manually fact-check and review all AI-generated content', and it names mass AI content without oversight as low effort [Delante, Oct 2026]. Industry analyses of the 2026 core updates report that sites with **fewer, deeper articles on a narrow topic** and **first-hand testing** gained ground, while broad, high-volume sites lost [Dataslayer; Koira, 2026].

> **Rule for every post**
>
> Ask: **'What will a reader find here that is not in the top 5 Google results?'** If the answer is 'nothing', don't publish it yet.
>
> Your advantage is that you can **test things from Nepal** (NTC/Ncell, eSewa, Khalti, Payoneer, NPR prices). Big global sites can't, and AI can't invent real receipts.
>
> AI can help you draft. A human (you) must test, add proof, fact-check and edit before publishing.

### 7.2 Free keyword research method (step by step)

1. **Google Search Console** (best free source): Performance > Queries. Find queries where you rank at positions 8–30 and improve those posts first, because they are the quickest wins.
2. **Google autocomplete and 'People also ask'**: type 'esewa ', 'payoneer nepal ', 'how to … from nepal' and write down every suggestion.
3. **Google Keyword Planner** (free with a Google Ads account): set location to Nepal, then to the USA, UK, Australia, Qatar, UAE and Japan for diaspora topics.
4. **Google Trends**: compare terms (for example, 'wise nepal' vs 'ime remit') and see seasonality (scholarship season, Dashain/Tihar remittance peaks).
5. **Real conversations**: Reddit r/Nepal, Nepali freelancer Facebook groups, Quora, and comments on Nepali YouTube channels. Repeated questions are keywords.
6. **Competitor gap**: look at what kamaune.com, merokalam.com, kokil.com.np and nepaldatabase.com rank for. These sites appear for your target queries now. Write a better, tested version.
7. **Optional paid tools**: Ahrefs/Semrush free trials or Ubersuggest for volume estimates. Treat Nepal volume numbers as rough.

### 7.3 Choose keywords by intent and money value

| Intent | Example | Value to you |
|---|---|---|
| Transactional / comparison | 'wise vs remitly nepal', 'best hosting in nepal' | 💰💰💰 Affiliate + high CPC |
| Problem-solving 'how to' | 'how to receive money from upwork in nepal' | 💰💰 Good traffic and trust |
| Informational | 'what is agentic ai' | 💰 Mostly answered by AI Overviews; low clicks |
| News | 'nrb new rule freelancers' | Short traffic spikes, Discover, links |

*Note: AI Overviews now appear on a large share of informational searches and can cut clicks to the #1 result by roughly 35–60% [Ahrefs/Seer data via ALM Corp, Oct 2026]. Prefer topics where people need tested, local, current details, such as fees, limits, step-by-step processes with screenshots, and comparisons.*

### 7.4 Content plan: next 24 posts (by cluster)

| Cluster | Post ideas | Audience | Monetization |
|---|---|---|---|
| 💸 Remittance (diaspora) — TOP PRIORITY | Send money from Qatar to Nepal (cheapest 2026, tested) · From UAE · From Malaysia · From Japan · From Korea · From Australia · From UK/USA · Wise vs Remitly vs IME for Nepal · How long a transfer takes on Dashain week · Receiving remittance in eSewa vs bank | Nepalis abroad | Affiliate (Wise, Remitly etc.) + high-CPC ads |
| 🌍 Freelancer payments | Payoneer fees in Nepal (real receipts) · Wise in Nepal: what works · PayPal alternatives in Nepal · Fiverr withdrawal to Nepal · Freelancer tax calculator | Nepal freelancers | Affiliate + tools |
| 🎓 Study / work abroad | IELTS vs PTE cost in Nepal · NOC process step by step · Japan language school costs in NPR · Korea EPS-TOPIK guide · Australia student visa costs from Nepal | Students + parents | High search volume, ads, consultancy sponsorships |
| 🌐 Blogging & hosting | Free .com.np domain (step-by-step, with screenshots) · Best hosting for Nepal (speed-tested from Butwal/KTM) · How to start a blog in Nepal and get paid | Creators | Hosting affiliates (high commission) |
| 🤖 AI tools in Nepal | How to pay for ChatGPT/Claude/Gemini from Nepal (dollar card) · Best free AI tools for SEE/+2 students · AI for Nepali language | Students, workers | Ads + tools |

### 7.5 Nepali-language content: an easier way to rank

Competition for Nepali-language queries (for example, 'इसेवा लिमिट कति हो', 'पेओनियर कसरी खोल्ने') is much lower. Start with Nepali versions of your 5 best posts:

- Put them at /ne/blog/... with hreflang tags linking the English and Nepali versions to each other.
- Write them as real Nepali articles, not machine translations, and make sure a human edits them.
- Note: ad value is low for this traffic, but it builds audience, brand searches and newsletter subscribers quickly.

### 7.6 Publishing rhythm

- **2 posts per week** (one new post and one major update of an old post) is better than 10 in one day.
- Fill clusters one at a time, finishing the remittance cluster before moving on. Topical depth beats covering everything.
- Prune or merge thin posts. Don't publish 'personal essays' and unrelated topics on the same domain until the core topics rank.

## 8. E-E-A-T: proving real experts write your posts

Your topics (money, tax, remittance, scholarships, scams) are **YMYL ('Your Money or Your Life')**, so Google holds them to its highest trust standard. Reported results from the 2026 updates show anonymous or generic author profiles losing ground [NuTech Digital, Apr 2026].

| Do this | Details |
|---|---|
| One strong author profile | Real photo (host it on your domain, not i.ibb.co), full name, role, 150+ word bio, what you have personally done (for example, 'received $X via Payoneer since 2023'), LinkedIn, GitHub, X and a list of posts. |
| Show experience in every post | Screenshots with dates, receipts with private details blurred, 'I sent NPR 10,000 via X on 3 Nov and it arrived in 14 minutes'. |
| Expert review for tax/legal posts | Ask a Nepali CA or tax consultant to review them and show 'Reviewed by [Name], CA' with a link to that person's profile. Add `reviewedBy` in schema. |
| Cite primary sources | NRB, IRD, the Department of Foreign Employment, official fee pages and university sites. Link to them directly. |
| Be consistent everywhere | Same name, location, photo and bio on the site, LinkedIn, Facebook and GitHub. |
| Show transparency | Keep the corrections log, editorial policy and affiliate disclosure, and add a 'Last updated' date on every post. |
| Guest authors | Ask only people with real experience (for example, a Nepali worker in Qatar writing the Qatar remittance guide) and give each one a full profile. |

## 9. Off-page SEO: getting backlinks

A new domain (Nov 2025) with few links is hard for Google to trust on money topics. You need **real links from relevant sites**. Never buy links or join PBNs or link farms. Google's spam updates penalize them, and AdSense can reject or ban you.

### 9.1 Link-building tactics that work for Apex

| Tactic | How to do it | Difficulty |
|---|---|---|
| **Free tools (your superpower)** | Build: NPR remittance fee calculator (Wise vs IME vs bank), Payoneer→NPR calculator, freelancer tax estimator, Nepali date converter for invoices. Tools earn natural links and repeat visits. | Medium |
| **Original data study** | For example, 'We tested 8 remittance services from Qatar to Nepal: real fees' or 'Survey of 300 Nepali freelancers: how they get paid'. Journalists and bloggers link to data. | Medium |
| **Nepali tech media** | Pitch tips, data or guest columns to Nepali tech and business news sites (for example, TechPana, ICT Samachar, TechLekh, Nepali Telecom, GadgetByte). Offer data, not 'please link me'. | Medium |
| **Universities & clubs** | Offer free workshops on freelancing/AI to IT clubs (KU, TU, Pokhara Univ., colleges in Butwal). Club pages and event pages often link back. | Easy |
| **Expert quotes (digital PR)** | Sign up for Qwoted, Featured.com and Help a B2B Writer, and answer journalist questions on remittance, freelancing in South Asia and AI scams. | Medium |
| **Communities** | Answer questions on Reddit r/Nepal, Quora and Facebook groups with helpful answers and a link only when it truly helps. These links pass little SEO value, but they bring real visitors and brand searches. | Easy |
| **Unlinked mentions & resource pages** | Search 'useful links for freelancers Nepal' and 'resources for Nepali students'. Ask the site owners to add your guide. | Easy |
| **Partnerships** | Co-write guides with Nepali co-working spaces, freelancer communities, scholarship groups and diaspora associations (NRNA chapters). | Medium |
| **GitHub / dev community** | Open-source the calculators. Post on dev.to and Hashnode with a canonical link back to your site. | Easy |

### 9.2 Social and distribution (helps a new site get discovered)

- **Facebook**: biggest channel in Nepal. Create an Apex Nepal page and share each post in 3–5 relevant groups with a summary, not just a link.
- **YouTube Shorts / TikTok / Reels**: turn each tested post into a 45-second screen recording (for example, 'eSewa limit 2026 in 40 seconds').
- **Newsletter** (you already have one): send weekly. Email subscribers are the traffic Google updates can't take away.
- **Viber/WhatsApp channels**: popular with Nepalis abroad, so use them for the remittance cluster.
- **LinkedIn**: post your data studies; journalists and HR people are there.

## 10. Brand / entity SEO: the 'Apex Nepal' name problem

A search for 'Apex Nepal' shows **Apex Nepal Pvt. Ltd.** (an LED screen company), **Apex Nepal Treks & Tours** and **Apex Nepal Adventure**. Google must learn that **your** Apex Nepal is a tech publication. Without that, brand searches go to other companies.

1. Use the **same full name everywhere**: 'Apex Nepal' (not 'Apex' in some places and 'Apex Community' in others). Your schema currently uses 'Apex' as the main name, so change it to 'Apex Nepal'.
2. Create profiles with the same name, logo and description on Facebook, LinkedIn, X, YouTube, Instagram and Crunchbase, then list them all in Organization `sameAs`.
3. Use a descriptive tagline in titles and bios: 'Apex Nepal — tested tech & money guides for Nepalis'.
4. Get mentioned on other sites (Section 9). Repeated mentions with your URL build the entity.
5. Track brand searches ('apex nepal blog', 'apex-nepal') in Search Console. A rising count is a strong quality signal.

## 11. AI search SEO (GEO): getting cited by AI Overviews, ChatGPT and Perplexity

In 2026, being **cited** inside AI answers is a separate form of visibility. Reports say only 17–54% of AI Overview citations come from the top-10 organic results [Dataslayer; ALM Corp, 2026], so even a new site can be cited if its answer is the clearest and most specific.

| Action | Why it works |
|---|---|
| Answer the question in the first 1–2 sentences under each H2 | AI systems pull short, self-contained answers. |
| Use tables and lists with real numbers (fees in NPR, limits, dates) | Specific data is cited much more often than general text. |
| Name sources and dates ('NRB circular, 2083/84') | Cited statistics increase trust and selection. |
| Keep AI crawlers allowed (you already do) | GPTBot, PerplexityBot and Google-Extended can read you. |
| Fix llms.txt and keep it accurate | Some AI tools read it to understand your site. |
| Get indexed in Bing (Bing Webmaster Tools) | ChatGPT search and Copilot depend heavily on Bing's index. |
| Track AI referrals in GA4 | Watch traffic from chatgpt.com, perplexity.ai and gemini.google.com. |

## 12. Monetization: AdSense, affiliates and sponsorships

### 12.1 AdSense readiness

Google publishes **no minimum** number of posts, traffic level or domain age. The main bar is original, useful content, a privacy policy, policy compliance and being 18+ [TheGuideX; BlogerHub, 2026]. The most common rejection is **'low value content'**, and the batch-published posts are your biggest risk there.

- Before applying, upgrade at least 15 posts with original proof (Section 6.3) and fix the author identity.
- Make sure your Privacy Policy mentions Google AdSense, cookies and third-party ad vendors.
- Add ads.txt and use a Google-certified consent banner (CMP) for EEA/UK visitors.
- Place ads carefully: one in-content ad after the 'Short answer' box, then one every 600–800 words. Too many ads hurt Core Web Vitals and trust.
- Later, at 50k+ monthly sessions with mostly Tier-1 traffic, consider premium ad networks (they often pay 3–5× AdSense [WikiWalls, 2026]).

### 12.2 Affiliate income (likely your biggest earner)

| Program type | Fits these posts | Notes |
|---|---|---|
| Money transfer (Wise, Remitly etc.) | Remittance cluster, receiving USD | Wise: ~£10 per new personal customer, £50 per business customer, via Partnerize [affiliatejob.org 2026]. Check that each service supports the Nepal corridor. |
| Hosting & domains | Blog cost, best hosting | International hosts pay high commissions. Disclose them and only recommend hosts that work well from Nepal. |
| Software / AI tools | AI tools, design tools | Many SaaS tools have recurring commissions. |
| Courses / test prep | Study abroad, coding | IELTS/PTE prep platforms. |

*Rules: add `rel="sponsored"` to affiliate links, add a clear disclosure at the top of each post, and never let commission decide a ranking. Your 'no affiliate surprises' promise is a trust asset worth protecting.*

### 12.3 Other income

- **Sponsored posts / newsletter sponsorship** from Nepali fintechs, ISPs, colleges, consultancies and co-working spaces. Label them 'Sponsored' and use `rel="sponsored"`.
- **Digital products**: Upwork proposal templates, scholarship SOP kit, freelancer invoice + tax template (NPR 200–500 via eSewa/Khalti).
- **Listings**: paid 'featured' slots in your resource directory, clearly labelled.

## 13. 90-day action plan

| When | Tasks | Done when… |
|---|---|---|
| Week 1 | Set up GSC (check), Bing Webmaster Tools, GA4. Merge author profiles + 301s. Fix Doha/Nepal conflict. Update llms.txt. Fix Organization schema (name 'Apex Nepal', PNG logo, sameAs). | One author URL; consistent location everywhere |
| Week 2 | Shorten all 14 SEO titles. Fix the soft 404. Real category pages or breadcrumb fix. Merge 12 categories into 5–6. Create social profiles. | Rich Results Test passes; titles ≤ 60 chars |
| Week 3–4 | Turn 5 hub pages into real pillar pages. Add 3–5 in-text internal links to every post. Upgrade the 3 money posts (send money, receiving USD, eSewa vs Khalti) with proof + official sources. | Every post links to its hub |
| Week 5–6 | Upgrade 5 more batch posts. Publish 2 new remittance-cluster posts (Qatar→Nepal, UAE→Nepal) with real tests. Start the Facebook/Reddit/newsletter routine. | 10 posts upgraded |
| Week 7–8 | Build tool #1: remittance fee calculator. Publish 'We tested X remittance services' data post. Pitch 10 Nepali media/blogs. | Tool live; 3+ new referring domains |
| Week 9–10 | Publish 4 more cluster posts. Get the tax post expert-reviewed by a CA. Publish 2 Nepali-language versions. | 20+ quality posts |
| Week 11–12 | Review GSC: improve posts ranking 8–30. Apply for AdSense if posts are upgraded. Join affiliate programs. Plan the next quarter's cluster. | AdSense applied; affiliate links live |

### Weekly routine (about 1 hour)

- Search Console: new queries, pages that dropped, 'not indexed' pages.
- Update one old post (fees and limits change).
- Share 2 posts in communities; answer 3 questions on Reddit/Quora/Facebook.
- Send the Thursday newsletter.

### KPIs to track

| Metric | Where | 3-month target (realistic for a young site) |
|---|---|---|
| Indexed pages | GSC > Pages | All sitemap URLs indexed |
| Impressions & clicks | GSC > Performance | Steady month-on-month growth |
| Queries in top 10 | GSC | 20+ |
| Referring domains | Ahrefs Webmaster Tools (free) / GSC Links | 15–30 real sites |
| Brand searches | GSC (query contains 'apex nepal') | Growing every month |
| Newsletter subscribers | Your DB | 500+ |
| Revenue per 1,000 visits | AdSense + affiliate dashboards | Track by cluster and invest in the best |

*SEO takes time: new sites usually need 4–12 months to rank for competitive terms. Long-tail Nepal-specific queries can rank within weeks.*

## 14. Checklist to use before you publish any post

- [ ] Target keyword chosen; I checked the top 5 results and know what my post adds that they don't.
- [ ] SEO title ≤ 60 chars with keyword first; H1 can be longer.
- [ ] Meta description 140–155 chars with keyword + reason to click.
- [ ] Short slug (3–6 words), e.g., /blog/payoneer-fees-nepal.
- [ ] 'Short answer' in the first 100 words.
- [ ] Question-style H2s; at least one table or list with real numbers.
- [ ] Original proof: my screenshots, receipts or test results with dates.
- [ ] 'How I tested this' box.
- [ ] Official sources linked (NRB, IRD, official fee pages) + Sources list at the end.
- [ ] 3–5 in-text internal links + link to the hub page; 2–3 older posts updated to link to this new one.
- [ ] Images: original, compressed, descriptive file name + alt text.
- [ ] FAQ with 3–7 real questions.
- [ ] Author = single real profile; expert reviewer for tax/legal.
- [ ] Affiliate links have `rel="sponsored"` + disclosure.
- [ ] Fact-checked by a human (required by Google's October 2026 guidance for AI-assisted content).
- [ ] After publishing: request indexing in GSC, ping IndexNow, share in newsletter + 3 communities.

## 15. Tools and sources

### Free tools

| Tool | Use |
|---|---|
| Google Search Console | Rankings, indexing, queries, Core Web Vitals |
| Bing Webmaster Tools | Bing/ChatGPT search visibility, IndexNow |
| Google Analytics 4 | Traffic, AI referrals, conversions |
| PageSpeed Insights | Core Web Vitals on mobile |
| Rich Results Test / Schema validator | Structured data checks |
| Ahrefs Webmaster Tools (free) | Backlinks and site audit for your own site |
| Google Keyword Planner / Trends | Keyword ideas, country comparison, seasonality |
| AlsoAsked / AnswerThePublic (free tiers) | Question keywords |
| Screaming Frog (free up to 500 URLs) | Crawl your site for broken links, titles, etc. |

### Sources used in this report

- Delante — 'Google Tightens Its Approach to AI Content' (6 Oct 2026): delante.co/google-tightens-its-approach-to-ai-content-what-changed/
- IndexCoverage — 'Google AI content guidelines: what changed in October 2026': indexcoverage.com/learn/google-ai-content-guidelines
- Dataslayer — 'Google Core Updates 2026: Timeline, Changes and Recovery': dataslayer.ai
- NuTech Digital — 'Google's NEW 2026 Algorithm Updates Explained' (Apr 2026): nutechdigital.com
- ALM Corp — 'Google's 2026 Algorithm Updates Explained' (Oct 2026): almcorp.com
- Strategy C — 'Google Algorithm Updates: What Changed in 2026': strategyc.io
- Koira — 'Google's August 2026 Core Update': koira.ai
- TheGuideX — 'Google AdSense Approval in 2026': theguidex.com/resources/google-adsense-approval
- BlogerHub — 'AdSense Approval Requirements for New Blogs (2026)': blogerhub.com
- AdSense CPC by country — minidea.co.in; 4seohelp.com (2026); RPM ranges — panstag.com (Aug 2026); wikiwalls.com (May 2026)
- Wise affiliate terms — affiliatejob.org/programs/wise; affiliatepicker.com/programs/wise
- Remitly affiliate — theaffiliatemonkey.com; flexoffers.com (rates vary by network and corridor)
- Site audit data: my own crawl of apex-nepal.com on 25 Oct 2026 (homepage, sitemap, 14 posts, author pages, robots.txt, llms.txt, feed).
*Note: third-party statistics (CTR drops, CPC/RPM, affiliate rates) are industry estimates and change often. Confirm affiliate terms in each program's dashboard before you rely on them.*
