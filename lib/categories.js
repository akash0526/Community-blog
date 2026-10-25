// lib/categories.js
// Single source of truth for article categories, their public pages and
// their hub (pillar) pages. Playbook §4/§5.4/§6.4: 12 thin categories were
// merged into 6 that match the hub pages, breadcrumbs must point at real
// pages (never /?category=…), and every post links up to its hub.
//
// The Supabase migration 20261025_seo_playbook.sql rewrites stored
// `articles.category` values to these six. The `legacyCategoryMap` +
// keyword routing below keeps any not-yet-migrated rows resolving to the
// right category page / hub in the meantime.

export const canonicalCategories = [
	{
		value: "Payments & Finance",
		slug: "payments-finance",
		label: "💳 Payments & Finance (Nepal)",
		hub: "/digital-payments",
		hubLabel: "Digital Payments hub",
		intro:
			"Tested guides to sending money to Nepal, receiving USD as a freelancer, and using eSewa, Khalti, Payoneer, Wise and Nepali banks without losing money to hidden fees. Every fee, limit and exchange rate here is checked against official sources (NRB, IRD, provider fee pages) and date-stamped, because payment rules in Nepal change fast. Start with the remittance comparison if you are sending money home from abroad, or the receiving-USD guide if a client is about to pay you for the first time.",
	},
	{
		value: "Freelancing & Remote Work",
		slug: "freelancing",
		label: "💼 Freelancing & Remote Work",
		hub: "/freelancing-in-nepal",
		hubLabel: "Freelancing in Nepal hub",
		intro:
			"Practical, Nepal-tested help for landing your first client on Upwork or Fiverr, pricing in USD, handling time zones, and staying legal with PAN and tax filing. These guides are written from real client work done from Nepal — real proposals, real payment receipts, real mistakes — not recycled global advice that assumes a US bank account. If you are starting out, work through the first-$100 guide, then the payments and tax posts in that order.",
	},
	{
		value: "AI Tools & Automation",
		slug: "ai-tools",
		label: "🤖 AI Tools & Automation",
		hub: "/ai-tools",
		hubLabel: "AI Tools hub",
		intro:
			"AI tools that actually work from Nepal: tested on NTC and Ncell connections, priced in NPR, and checked for whether the free tier is usable without a VPN or an international card. We cover study help, coding assistants, design tools and the AI scams now targeting Nepali users. Every recommendation says what we tested, on what device and network, and what failed — so you can skip the tools that only work in a San Francisco demo.",
	},
	{
		value: "Web Hosting & Domains",
		slug: "hosting",
		label: "🌐 Web Hosting & Domains",
		hub: "/blogging-hosting",
		hubLabel: "Blogging & Hosting hub",
		intro:
			"What it really costs to run a website from Nepal: .com.np domains, hosting that stays fast on Nepali broadband, and the payment workarounds (dollar cards, eSewa, Khalti) bloggers here actually use. Prices are shown in NPR with the date they were checked, and speed claims are tested from Nepali networks rather than copied from a provider's marketing page. Start with the blog-cost breakdown before you pay for anything.",
	},
	{
		value: "Small Business Workflows",
		slug: "small-business",
		label: "🏪 Small Business Workflows",
		hub: "/small-business-tools",
		hubLabel: "Small Business Tools hub",
		intro:
			"Free and low-cost tools for a pasal, Facebook shop or small service business in Nepal: design, billing, delivery and getting found online. Each workflow is tested with the constraints Nepali shop owners actually have — a mid-range phone, mobile data, and payment by eSewa or Khalti instead of a credit card. If a tool needs a dollar card or a laptop to be useful, we say so up front.",
	},
	{
		value: "Student Resources",
		slug: "students",
		label: "🎓 Student Resources",
		hub: "/resources#students",
		hubLabel: "Student Resources",
		intro:
			"Free study resources, scholarship toolkits and skill-building guides for Nepali students — from SEE and +2 to learning to code and applying abroad. Everything here is free to start (NPR 0), works on the connections students in Nepal actually have, and links to the official application or course page so you never have to trust a screenshot. Scholarship deadlines and costs are re-checked each intake season.",
	},
];

export const storyCategories = canonicalCategories.map(({ value, label }) => ({
	value,
	label,
}));

export const storyCategoryValues = canonicalCategories.map((c) => c.value);

const byValue = new Map(
	canonicalCategories.map((c) => [c.value.toLowerCase(), c]),
);
const bySlug = new Map(canonicalCategories.map((c) => [c.slug, c]));

// Exact-value legacy renames (stored value -> canonical value).
export const legacyCategoryMap = {
	"business & finance": "Payments & Finance",
	finance: "Payments & Finance",
	money: "Payments & Finance",
	"payments & finance (nepal)": "Payments & Finance",
	"tech & ai": "AI Tools & Automation",
	"ai tools": "AI Tools & Automation",
	"web hosting": "Web Hosting & Domains",
	hosting: "Web Hosting & Domains",
	"small business": "Small Business Workflows",
	students: "Student Resources",
	freelancing: "Freelancing & Remote Work",
};

// Broad/legacy buckets that spanned topics are routed by title keywords.
const KEYWORD_ROUTES = [
	{
		value: "Payments & Finance",
		pattern:
			/esewa|khalti|payoneer|wise|remit|send money|receive.*usd|payment|wallet|bank|pan\b|tax|invoice|ime\b|dollar card/i,
	},
	{
		value: "Web Hosting & Domains",
		pattern: /hosting|domain|\.com\.np|wordpress|blog.*cost|cost.*blog/i,
	},
	{
		value: "Freelancing & Remote Work",
		pattern: /upwork|fiverr|freelanc|remote job|remote work|first client/i,
	},
	{
		value: "AI Tools & Automation",
		pattern: /\bai\b|chatgpt|gemini|deepseek|claude|photopea|canva|automation/i,
	},
	{
		value: "Student Resources",
		pattern:
			/scholarship|student|study abroad|learn.*cod|coding|ielts|pte|exam/i,
	},
	{
		value: "Small Business Workflows",
		pattern: /pasal|shop|business|facebook shop|billing|sell online/i,
	},
];

const BROAD_LEGACY = new Set([
	"tool reviews & comparisons",
	"guides & tutorials",
	"community contributions",
	"personal stories",
	"opinion & essays",
	"news & current affairs",
	"nepal tech news",
	"stories",
	"guide",
]);

/**
 * Resolve any stored category (canonical, renamed, or broad legacy) to its
 * canonical category object. Pass the article title/keyword so broad legacy
 * buckets route by topic. Returns null when nothing matches.
 */
export function resolveCategory(category, hint = "") {
	if (!category) return null;
	const key = String(category).trim().toLowerCase();
	if (byValue.has(key)) return byValue.get(key);
	if (bySlug.has(key)) return bySlug.get(key);
	if (legacyCategoryMap[key]) return byValue.get(legacyCategoryMap[key].toLowerCase());
	if (BROAD_LEGACY.has(key) || hint) {
		for (const route of KEYWORD_ROUTES) {
			if (route.pattern.test(`${category} ${hint}`)) {
				return byValue.get(route.value.toLowerCase());
			}
		}
	}
	return null;
}

/** Canonical category value for a stored category, or the raw value. */
export function normalizeCategory(category, hint = "") {
	return resolveCategory(category, hint)?.value || category || "";
}

export function categoryFromSlug(slug) {
	return bySlug.get(String(slug || "").trim().toLowerCase()) || null;
}

export function categoryPagePath(category, hint = "") {
	const resolved = resolveCategory(category, hint);
	return resolved ? `/blog/category/${resolved.slug}` : "/blog";
}

export function hubForCategory(category, hint = "") {
	const resolved = resolveCategory(category, hint);
	return resolved
		? { href: resolved.hub, label: resolved.hubLabel, category: resolved }
		: { href: "/blog", label: "All guides", category: null };
}

/** All stored values (canonical + known legacy) that belong to a category,
 *  for querying Supabase before/after the data migration. */
export function storedValuesForCategory(canonicalValue) {
	const values = new Set([canonicalValue]);
	for (const [legacy, canonical] of Object.entries(legacyCategoryMap)) {
		if (canonical === canonicalValue) {
			// Legacy keys are stored lowercase here; DB values were title-case,
			// so callers should match case-insensitively where possible.
			values.add(legacy);
		}
	}
	return [...values];
}
