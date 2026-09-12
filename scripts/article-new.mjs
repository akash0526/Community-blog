#!/usr/bin/env node
/**
 * article:new <slug> — create a new markdown stub in content/drafts/<category>/<slug>.md
 * Usage:
 *   npm run article:new my-slug
 *   npm run article:new my-slug -- --category="Blogging & Hosting"
 *   npm run article:new my-slug -- --category="AI Tools" --title="My Title" --keyword="my keyword"
 *   node scripts/article-new.js my-slug "Freelancing in Nepal"
 *
 * Frontmatter: title, slug, category, target_keyword, meta_description, status: draft, author_id, etc.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

function slugifyCategory(cat) {
  return cat
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseArgs() {
  const raw = process.argv.slice(2);
  const args = { _: [] };
  for (const a of raw) {
    if (a.startsWith("--category=")) args.category = a.slice("--category=".length).replace(/^"|"$/g, "");
    else if (a.startsWith("--title=")) args.title = a.slice("--title=".length).replace(/^"|"$/g, "");
    else if (a.startsWith("--keyword=")) args.keyword = a.slice("--keyword=".length).replace(/^"|"$/g, "");
    else if (a.startsWith("--desc=") || a.startsWith("--description=")) {
      const v = a.includes("=") ? a.slice(a.indexOf("=") + 1) : "";
      args.description = v.replace(/^"|"$/g, "");
    } else if (a.startsWith("--")) {
      // unknown flag
    } else {
      args._.push(a);
    }
  }
  return args;
}

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const args = parseArgs();
const slug = args._[0];
const categoryArg = args.category || args._[1] || "Blogging & Hosting";

if (!slug) {
  console.error(`
Usage: npm run article:new <slug> [-- --category="Category Name"]

Examples:
  npm run article:new my-first-post
  npm run article:new my-first-post -- --category="AI Tools"
  npm run article:new my-first-post -- --category="Blogging & Hosting" --title="My Honest Title" --keyword="my keyword"

Slug must be kebab-case, e.g., "hostinger-review-nepal-2026"
`);
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Invalid slug "${slug}". Use kebab-case, e.g., "my-first-post"`);
  process.exit(1);
}

const allowedCategories = [
  "AI Tools",
  "Freelancing in Nepal",
  "Blogging & Hosting",
  "Digital Payments",
  "Small Business Tools",
];

// Normalize category — allow both slug and proper value
let category = categoryArg;
const catLower = category.toLowerCase();
const found = allowedCategories.find((c) => c.toLowerCase() === catLower || slugifyCategory(c) === slugifyCategory(category));
if (found) category = found;
else if (!allowedCategories.includes(category)) {
  console.warn(`Warning: category "${category}" not in allowed list (${allowedCategories.join(", ")}). Using as-is.`);
}

const categoryFolder = slugifyCategory(category);
const draftsDir = path.join(ROOT, "content", "drafts", categoryFolder);
const filePath = path.join(draftsDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${path.relative(ROOT, filePath)}`);
  process.exit(1);
}

const title = args.title || `${toTitleCase(slug)} — Tested for Nepal (2026)`;
const targetKeyword = args.keyword || slug.replace(/-/g, " ");
const metaDescription = args.description || `${title} — honest, tested guide for Nepali freelancers, students, and small businesses. No fake claims, real screenshots when published.`;
const authorId = "00000000-0000-0000-0000-000000000000";
const today = new Date().toISOString().slice(0, 10);

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${category}"
target_keyword: "${targetKeyword.replace(/"/g, '\\"')}"
meta_description: "${metaDescription.replace(/"/g, '\\"')}"
status: "draft"
author_id: "${authorId}"
published_at: "${today}"
updated_at: "${today}"
image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
seo_score: 85
---

> **Affiliate disclosure (when needed):** Place links behind env placeholders (e.g., \`NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL\`). Add \`<AffiliateDisclosure />\` at top when you use affiliate links. See \`lib/affiliates.js\`.

**TODO before publishing:**
- [ ] Verify NPR pricing / real screenshots / test date
- [ ] Add 1–2 internal links to pillar (e.g., [Blogging & Hosting](/blogging-hosting)) and a sibling

---

# ${title}

Write your honest, tested content here. Keep English primary, verify claims, and disclose affiliates clearly.

## Why this matters for Nepal

Explain the Nepal-specific angle in one paragraph.

## Steps / Review / Comparison

Add real data, not placeholders.

## Internal links

- Pillar: [Blogging & Hosting](/blogging-hosting)
- Resources: [Resources](/resources)

## Methodology

Tested on ${today} in Kathmandu (or note your test environment). See [Editorial Policy](/editorial) and [Disclaimer](/disclaimer).
`;

fs.mkdirSync(draftsDir, { recursive: true });
fs.writeFileSync(filePath, frontmatter, "utf8");

console.log(`✓ Created ${path.relative(ROOT, filePath)}`);
console.log(`  category: ${category} → ${categoryFolder}/`);
console.log(`  slug: ${slug}`);
console.log(`  status: draft (will stay draft until you publish)`);
console.log(`\nNext:`);
console.log(`  1. Edit the file and write your content`);
console.log(`  2. Publish as draft to Supabase: npm run article:publish ${slug}`);
console.log(`  3. When ready to go live: UPDATE articles SET status='published' WHERE slug='${slug}';`);
