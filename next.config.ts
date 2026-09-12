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
      // Query-param redirects for archived off-topic categories.
      // Must use `has` with type: 'query' — source never includes ?query.
      // Verified via curl -I "http://localhost:3000/?category=Food%20%26%20Recipes" → 308
      // See redirects.csv for exact slug-level map (generated after DB verification).
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Food & Recipes" }],
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Travel & Lifestyle" }],
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "category", value: "Personal Stories" }],
        destination: "/about",
        permanent: true,
      },
    ];
  },
  // Ensure offline builds don't fail on Google Fonts — layout.tsx uses system-font fallback
  // No additional font config needed here; see app/layout.tsx for local fallback.
};

export default nextConfig;
