import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "imgs.search.brave.com" },
      { protocol: "https", hostname: "english.onlinekhabar.com" },
      { protocol: "https", hostname: "news24online.com" },
    ],
  },
  compiler: {
    // Strip console.log in production builds
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
