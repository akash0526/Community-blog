// lib/affiliates.js
// Central placeholder map for affiliate links — use env vars, never hardcode IDs.
// Phase 3: Hostinger + Grammarly + Canva are priority (placeholders); others TODO.
// Do NOT invent real affiliate IDs or fake earnings. See REBRAND_PLAN.md.

export const AFFILIATE_LINKS = {
  // Priority — Blogging & Hosting + AI Tools (env placeholders)
  HOSTINGER: process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL || "#TODO-affiliate-hostinger",
  // Example: "https://www.hostinger.com?REFERRALCODE=DO_NOT_INVENT_USE_ENV" — replace via env
  HOSTINGER_TEXT: "AFFILIATE_LINK_HOSTINGER",

  GRAMMARLY: process.env.NEXT_PUBLIC_AFFILIATE_GRAMMARLY_URL || "#TODO-affiliate-grammarly",
  GRAMMARLY_TEXT: "AFFILIATE_LINK_GRAMMARLY",

  CANVA: process.env.NEXT_PUBLIC_AFFILIATE_CANVA_URL || "#TODO-affiliate-canva",
  CANVA_TEXT: "AFFILIATE_LINK_CANVA",

  CLOUDFLARE: process.env.NEXT_PUBLIC_AFFILIATE_CLOUDFLARE_URL || "#TODO-affiliate-cloudflare",
  CLOUDFLARE_TEXT: "AFFILIATE_LINK_CLOUDFLARE",

  NAMECHEAP: process.env.NEXT_PUBLIC_AFFILIATE_NAMECHEAP_URL || "#TODO-affiliate-namecheap",
  NAMECHEAP_TEXT: "AFFILIATE_LINK_NAMECHEAP",

  WORDPRESS_COM: process.env.NEXT_PUBLIC_AFFILIATE_WORDPRESS_URL || "#TODO-affiliate-wordpress",
  WORDPRESS_COM_TEXT: "AFFILIATE_LINK_WORDPRESS",

  // TODO-affiliate — prepare rows but do NOT publish with fake IDs
  PAYONEER: process.env.NEXT_PUBLIC_AFFILIATE_PAYONEER_URL || "#TODO-affiliate-payoneer",
  PAYONEER_TEXT: "AFFILIATE_LINK_PAYONEER",

  WISE: process.env.NEXT_PUBLIC_AFFILIATE_WISE_URL || "#TODO-affiliate-wise",
  WISE_TEXT: "AFFILIATE_LINK_WISE",

  NOTION: process.env.NEXT_PUBLIC_AFFILIATE_NOTION_URL || "#TODO-affiliate-notion",
  NOTION_TEXT: "AFFILIATE_LINK_NOTION",

  DARAZ: process.env.NEXT_PUBLIC_AFFILIATE_DARAZ_URL || "#TODO-affiliate-daraz",
  DARAZ_TEXT: "AFFILIATE_LINK_DARAZ",
};

// Helper to check if link is placeholder (not yet configured)
export function isAffiliateConfigured(link) {
  return link && !String(link).startsWith("#TODO-affiliate");
}

// Env var names for documentation / .env.example
export const AFFILIATE_ENV_VARS = [
  "NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL",
  "NEXT_PUBLIC_AFFILIATE_GRAMMARLY_URL",
  "NEXT_PUBLIC_AFFILIATE_CANVA_URL",
  "NEXT_PUBLIC_AFFILIATE_CLOUDFLARE_URL",
  "NEXT_PUBLIC_AFFILIATE_NAMECHEAP_URL",
  "NEXT_PUBLIC_AFFILIATE_WORDPRESS_URL",
  "NEXT_PUBLIC_AFFILIATE_PAYONEER_URL",
  "NEXT_PUBLIC_AFFILIATE_WISE_URL",
  "NEXT_PUBLIC_AFFILIATE_NOTION_URL",
  "NEXT_PUBLIC_AFFILIATE_DARAZ_URL",
];
