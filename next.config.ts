import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "imgs.search.brave.com" },
      { protocol: "https", hostname: "english.onlinekhabar.com" },
      { protocol: "https", hostname: "news24online.com" },
    ],
  },
  compiler: {
    // Strip console.log in production builds
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async redirects() {
    return [
      // Generic fallback redirects for archived off-topic categories
      // For exact slug-level 301s, see /redirects.csv and run verification query in supabase/migrations/20260912_rebrand_taxonomy.sql
      // These are conservative category-filter redirects that preserve SEO juice without auto-drafting live content
      {
        source: "/blog/:slug*",
        has: [{ type: "query", key: "category", value: "Food & Recipes" }],
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Food & Recipes" }],
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Travel & Lifestyle" }],
        destination: "/",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Personal Stories" }],
        destination: "/about",
        permanent: true,
      },
      // Legacy Web Development / Tech & AI slugs that may have moved to new pillars
      // Keep existing /blog/:slug working — no redirect, handled by DB slug lookup
    ];
  },
  // Ensure offline builds don't fail on Google Fonts — layout.tsx uses system-font fallback
  // No additional font config needed here; see app/layout.tsx for local fallback.
};

export default nextConfig;
