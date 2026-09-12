#!/usr/bin/env node
/**
 * article:publish <slug> — read content/drafts/category/<slug>.md, parse frontmatter, upsert into Supabase articles with status='draft'
 * Usage:
 *   npm run article:publish my-slug
 *   node scripts/article-publish.js my-slug
 *   node scripts/article-publish.js my-slug --dry-run
 *
 * It does NOT auto-publish: it forces status='draft' even if frontmatter says published.
 * You run it manually; to go live you do:
 *   UPDATE articles SET status='published' WHERE slug='my-slug';
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  const envPath2 = path.join(ROOT, ".env");
  for (const p of [envPath, envPath2]) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
loadEnvLocal();

function findDraftFile(slug) {
  const draftsRoot = path.join(ROOT, "content", "drafts");
  if (!fs.existsSync(draftsRoot)) return null;
  const found = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name === `${slug}.md`) found.push(full);
    }
  }
  walk(draftsRoot);
  if (found.length === 0) return null;
  if (found.length > 1) {
    console.warn(`Warning: multiple files found for slug "${slug}":`);
    found.forEach((f) => console.warn(`  - ${path.relative(ROOT, f)}`));
    console.warn(`Using first: ${path.relative(ROOT, found[0])}`);
  }
  return found[0];
}

function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error("Frontmatter not found — file must start with --- YAML ---");
  }
  const fmRaw = fmMatch[1];
  const body = fmMatch[2];
  const data = {};
  // very small YAML parser: handles "key: \"value\"" and "key: value"
  for (const line of fmRaw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let val = trimmed.slice(colon + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
    }
    // try numeric
    if (/^-?\d+$/.test(val)) val = Number(val);
    else if (val === "true") val = true;
    else if (val === "false") val = false;
    data[key] = val;
  }
  return { data, body };
}

const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes("--dry-run");
const slug = rawArgs.find((a) => !a.startsWith("--"));

if (!slug) {
  console.error(`
Usage: npm run article:publish <slug> [-- --dry-run]

  npm run article:publish my-slug
  npm run article:publish my-slug -- --dry-run   # parse only, no DB write

Finds content/drafts/category/<slug>.md, parses frontmatter, upserts to Supabase with status='draft'.
`);
  process.exit(1);
}

const draftPath = findDraftFile(slug);
if (!draftPath) {
  console.error(`Draft not found for slug "${slug}". Looked in content/drafts/category/${slug}.md`);
  console.error(`Create it first: npm run article:new ${slug} -- --category="Blogging & Hosting"`);
  process.exit(1);
}

console.log(`→ Found draft: ${path.relative(ROOT, draftPath)}`);

let raw;
try {
  raw = fs.readFileSync(draftPath, "utf8");
} catch (e) {
  console.error(`Failed to read ${draftPath}: ${e.message}`);
  process.exit(1);
}

let data, body;
try {
  const parsed = parseFrontmatter(raw);
  data = parsed.data;
  body = parsed.body;
} catch (e) {
  console.error(`Frontmatter parse error: ${e.message}`);
  process.exit(1);
}

// Validate required fields
const required = ["title", "slug", "category", "target_keyword", "meta_description"];
const missing = required.filter((k) => !data[k]);
if (missing.length) {
  console.error(`Missing required frontmatter fields: ${missing.join(", ")}`);
  console.error(`Found: ${Object.keys(data).join(", ")}`);
  process.exit(1);
}
if (data.slug !== slug) {
  console.warn(`Warning: frontmatter slug "${data.slug}" != requested slug "${slug}". Using frontmatter slug.`);
}

const payload = {
  title: String(data.title),
  slug: String(data.slug),
  category: String(data.category),
  target_keyword: String(data.target_keyword),
  meta_description: String(data.meta_description).slice(0, 500),
  image_url: String(data.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"),
  content: body, // full markdown body (not frontmatter)
  seo_score: Number(data.seo_score || 85),
  status: "draft", // force draft — never auto-publish
  author_id: String(data.author_id || "00000000-0000-0000-0000-000000000000"),
  published_at: data.published_at ? String(data.published_at) : new Date().toISOString().slice(0, 10),
};

console.log(`\nParsed frontmatter:`);
console.log(`  title: ${payload.title}`);
console.log(`  slug: ${payload.slug}`);
console.log(`  category: ${payload.category}`);
console.log(`  status: ${payload.status} (forced, frontmatter was "${data.status || "missing"}")`);
console.log(`  author_id: ${payload.author_id}`);
console.log(`  content length: ${payload.content.length} chars`);
console.log(`  seo_score: ${payload.seo_score}`);

if (dryRun) {
  console.log(`\n--dry-run: not writing to Supabase. Payload would be:`);
  console.log(JSON.stringify({ ...payload, content: payload.content.slice(0, 200) + "…" }, null, 2));
  console.log(`\n✓ Dry run ok. Remove --dry-run to upsert.`);
  process.exit(0);
}

// Check env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

let supabaseKey = supabaseAnonKey;
let keyType = "anon";
if (supabaseServiceKey) {
  supabaseKey = supabaseServiceKey;
  keyType = "service_role";
}

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
  console.error(`
✖ Supabase env not configured.

Need:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY  (or SUPABASE_SERVICE_ROLE_KEY for bypassing RLS)

Current:
  NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl || "(missing)"}
  key type=${supabaseAnonKey ? "anon present" : "missing"} / service_role=${supabaseServiceKey ? "present" : "missing"}

For local verification without live Supabase, run with --dry-run:
  npm run article:publish ${slug} -- --dry-run

To wire live, create .env.local:
  NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
  # optional: SUPABASE_SERVICE_ROLE_KEY=<service_role> (server only)

Then re-run without --dry-run.
`);
  console.log(`\nℹ Payload validated locally — you can still write manually via Supabase SQL Editor using the template in supabase_migrations/20260912_blogging_hosting_cluster.sql`);
  process.exit(2);
}

console.log(`\n→ Supabase: ${supabaseUrl} (key: ${keyType})`);

let supabase;
try {
  const { createClient } = await import("@supabase/supabase-js");
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (e) {
  console.error(`Failed to import @supabase/supabase-js: ${e.message}`);
  console.error(`Try: npm install`);
  process.exit(1);
}

// Upsert — try with published_at as date, fallback if column missing
console.log(`→ Upserting articles (onConflict: slug) with status='draft'...`);

const insertPayload = {
  title: payload.title,
  slug: payload.slug,
  category: payload.category,
  target_keyword: payload.target_keyword,
  meta_description: payload.meta_description,
  image_url: payload.image_url,
  content: payload.content,
  seo_score: payload.seo_score,
  status: payload.status,
  author_id: payload.author_id,
  published_at: payload.published_at,
};

const { data: result, error } = await supabase
  .from("articles")
  .upsert(insertPayload, { onConflict: "slug" })
  .select("slug, status, title");

if (error) {
  console.error(`\n✖ Supabase upsert error: ${error.message}`);
  if (error.details) console.error(`  details: ${error.details}`);
  if (error.hint) console.error(`  hint: ${error.hint}`);
  console.error(`\nTry with service_role key if RLS blocks anon insert (guest author_id should work with anon).`);
  process.exit(1);
}

console.log(`\n✓ Upserted as draft:`);
console.log(result);
console.log(`
Next steps:
  1. Verify draft (not public): SELECT slug, status FROM articles WHERE slug='${payload.slug}';
     → should be 'draft' and NOT appear on /blog/${payload.slug} publicly if RLS hides drafts.
  2. Publish (when ready): UPDATE articles SET status='published', published_at=CURRENT_DATE WHERE slug='${payload.slug}';
  3. View: http://localhost:3000/blog/${payload.slug}  and https://www.apex-nepal.com/blog/${payload.slug}
  4. Revert: UPDATE articles SET status='draft' WHERE slug='${payload.slug}';
`);
