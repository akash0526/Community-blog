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
    // Old Qatar/off-topic categories deleted manually 2026-09-12 — no redirects needed.
    // All public content is now the 5 new pillars only.
    return [];
  },
  // Ensure offline builds don't fail on Google Fonts — layout.tsx uses system-font fallback
  // No additional font config needed here; see app/layout.tsx for local fallback.
};

export default nextConfig;
