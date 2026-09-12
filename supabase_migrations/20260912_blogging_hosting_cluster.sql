-- ============================================================================
-- APEX NEPAL — BLOGGING & HOSTING CLUSTER (DRAFTS, MANUAL INSERT)
-- Date: 2026-09-13
-- Pillar: /blogging-hosting (static page, not DB)
-- Supporting drafts: 3 blog posts — status='draft' until you verify NPR pricing & screenshots
-- See: content/drafts/blogging-hosting/*.md for markdown sources
-- Affiliate: placeholders only (AFFILIATE_LINK_* via NEXT_PUBLIC_AFFILIATE_* env)
-- Internal links: each draft links to pillar + ≥1 sibling (see markdown)
-- ============================================================================
-- INSTRUCTIONS:
-- 1. Review markdown drafts in content/drafts/blogging-hosting/ first.
-- 2. Run SELECT to verify no slug collision:
--    SELECT slug, status FROM articles WHERE slug IN ('hostinger-review-nepal-blogging','how-to-start-blog-nepal-2026','cheap-domain-hosting-nepal-pay-with-esewa');
-- 3. If clear, run the INSERTs below (they use ON CONFLICT DO NOTHING to avoid duplicates).
-- 4. Verify: SELECT slug, title, status, category FROM articles WHERE category='Blogging & Hosting' ORDER BY created_at DESC;
-- 5. When ready to publish (after you add real screenshots & NPR tables), run:
--    UPDATE articles SET status='published', published_at=CURRENT_DATE, updated_at=NOW() WHERE slug IN (...);
-- ============================================================================

-- Pre-check (read-only)
-- SELECT slug, status FROM articles WHERE slug IN ('hostinger-review-nepal-blogging','how-to-start-blog-nepal-2026','cheap-domain-hosting-nepal-pay-with-esewa');

-- Insert 3 drafts — status='draft' (NOT published, so not in sitemap, not indexable)
-- Uses guest author id; replace author_id with your real profile id if you want byline.
-- Content is loaded from markdown files — here we insert a short placeholder that points to the markdown for full review.
-- For full content inserts, copy the markdown body from content/drafts/... into the content column (see full inserts below as comment).

INSERT INTO public.articles (id, author_id, title, slug, category, target_keyword, meta_description, image_url, content, seo_score, status, published_at)
VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Hostinger Review for Nepal (2026) — Tested with eSewa & Cloudflare',
  'hostinger-review-nepal-blogging',
  'Blogging & Hosting',
  'Hostinger Nepal review',
  'Hostinger for Nepal tested: speed, Hostinger + Cloudflare, eSewa/Khalti payments, renewal price in NPR. Is it worth it for Nepali bloggers? Real screenshots TODO.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  E'# Hostinger Review for Nepal (2026) — Tested with eSewa & Cloudflare\n\n> Affiliate disclosure: Some links are affiliate links. See /disclaimer. Placeholder: AFFILIATE_LINK_HOSTINGER via NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL.\n\n**TODO before publishing:** Verify NPR price on test date, add screenshots, speed test with Cloudflare, renewal table.\n\n## Why Hostinger for Nepal?\n\nHostinger is primary pick for first blog — cheap, LiteSpeed, free domain yr1, works with eSewa-linked cards (TODO screenshot). Secondary: Cloudflare free CDN (see pillar /blogging-hosting).\n\n## Internal links\n\n- Pillar: [Blogging & Hosting — Ultimate Guide](/blogging-hosting)\n- Sibling: [How to Start a Blog in Nepal (2026)](/blog/how-to-start-blog-nepal-2026)\n- Sibling: [Cheap Domain & Hosting You Can Pay with eSewa](/blog/cheap-domain-hosting-nepal-pay-with-esewa)\n- Resources: [Resources](/resources#hosting)\n\nFull markdown: See content/drafts/blogging-hosting/hostinger-review-nepal-blogging.md\n',
  85,
  'draft',
  CURRENT_DATE
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.articles (id, author_id, title, slug, category, target_keyword, meta_description, image_url, content, seo_score, status, published_at)
VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'How to Start a Blog in Nepal (2026) — Step-by-Step with Screenshots',
  'how-to-start-blog-nepal-2026',
  'Blogging & Hosting',
  'how to start a blog in Nepal',
  'Start a blog in Nepal step-by-step: domain, Hostinger + Cloudflare, WordPress, eSewa payments, and SEO that ranks in Nepal. With screenshots TODO.',
  'https://images.unsplash.com/photo-1499951360447-b19be2c0e1a8?auto=format&fit=crop&w=1200&q=80',
  E'# How to Start a Blog in Nepal (2026) — Step-by-Step with Screenshots\n\n> Affiliate disclosure: Hostinger/Cloudflare links are affiliate placeholders (AFFILIATE_LINK_HOSTINGER, AFFILIATE_LINK_CLOUDFLARE).\n\n**TODO:** Screenshots of Namecheap, Hostinger hPanel, Cloudflare DNS, WordPress installer; verify NPR totals; add test date.\n\n## Steps\n\n1. Pick domain (see cheap domain guide)\n2. Buy Hostinger (AFFILIATE_LINK_HOSTINGER) + Cloudflare free\n3. Install WordPress, enable LiteSpeed + SSL\n\n## Internal links\n\n- Pillar: [Blogging & Hosting](/blogging-hosting)\n- Sibling: [Hostinger Review](/blog/hostinger-review-nepal-blogging)\n- Sibling: [Cheap Domain with eSewa](/blog/cheap-domain-hosting-nepal-pay-with-esewa)\n\nFull markdown: content/drafts/blogging-hosting/how-to-start-blog-nepal-2026.md\n',
  85,
  'draft',
  CURRENT_DATE
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.articles (id, author_id, title, slug, category, target_keyword, meta_description, image_url, content, seo_score, status, published_at)
VALUES
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Cheap Domain & Hosting You Can Pay with eSewa/Khalti in Nepal (2026)',
  'cheap-domain-hosting-nepal-pay-with-esewa',
  'Blogging & Hosting',
  'domain hosting pay with eSewa Khalti Nepal',
  'Cheap domain & hosting in Nepal you can pay with eSewa/Khalti-linked cards: Namecheap domains, Hostinger free domain, and free .com.np. Price in NPR, screenshots TODO.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  E'# Cheap Domain & Hosting You Can Pay with eSewa/Khalti in Nepal (2026)\n\n> Affiliate disclosure: Placeholders AFFILIATE_LINK_NAMECHEAP, AFFILIATE_LINK_HOSTINGER, AFFILIATE_LINK_CLOUDFLARE.\n\n**TODO:** Verify eSewa direct vs card, price table NPR, .com.np timeline, screenshots.\n\n## Options\n\n- Namecheap .com ~$10/yr (card, TODO eSewa direct)\n- Hostinger free domain yr1\n- .com.np free (Mercantile, needs docs)\n\n## Internal links\n\n- Pillar: [Blogging & Hosting](/blogging-hosting)\n- Sibling: [Hostinger Review](/blog/hostinger-review-nepal-blogging)\n- Sibling: [How to Start a Blog](/blog/how-to-start-blog-nepal-2026)\n\nFull markdown: content/drafts/blogging-hosting/cheap-domain-hosting-nepal-pay-with-esewa.md\n',
  85,
  'draft',
  CURRENT_DATE
)
ON CONFLICT (slug) DO NOTHING;

-- Post-insert verification
-- SELECT slug, title, status, category, published_at FROM articles WHERE slug IN ('hostinger-review-nepal-blogging','how-to-start-blog-nepal-2026','cheap-domain-hosting-nepal-pay-with-esewa');

-- To publish after you verify (UNCOMMENT ONLY AFTER you add real screenshots & NPR):
-- UPDATE articles SET status='published', published_at=CURRENT_DATE, updated_at=NOW() WHERE slug='hostinger-review-nepal-blogging';
-- UPDATE articles SET status='published', published_at=CURRENT_DATE, updated_at=NOW() WHERE slug='how-to-start-blog-nepal-2026';
-- UPDATE articles SET status='published', published_at=CURRENT_DATE, updated_at=NOW() WHERE slug='cheap-domain-hosting-nepal-pay-with-esewa';

-- Full content replacement (if you want to paste full markdown, update content column):
-- UPDATE articles SET content = (SELECT pg_read_file('content/drafts/blogging-hosting/hostinger-review-nepal-blogging.md')) WHERE slug='hostinger-review-nepal-blogging';
-- Or via Supabase dashboard: open article → edit content → paste full markdown.
