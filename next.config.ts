import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The sandbox live-preview proxy serves the dev server from a
  // different origin (*.e2b.app). Next 16 rejects cross-origin requests
  // to the dev server unless the origin is allowlisted — without this
  // the HMR websocket and page loads break behind the proxy.
  allowedDevOrigins: ["*.e2b.app"],
  // Next hard-requires its legacy client polyfills (polyfill-module) from
  // next/dist/client/app-globals.js. Every target in `browserslist`
  // (safari >= 15.4, chrome/edge/firefox >= 93) implements those APIs
  // natively, and Lighthouse's "Legacy JavaScript" audit flags the shims
  // as dead weight — so swap them for an empty stub. The separate
  // `polyfill-nomodule` bundle (loaded with noModule, for really old
  // browsers) is left untouched.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./lib/next-polyfill-stub.js",
      [path.join(
        process.cwd(),
        "node_modules/next/dist/build/polyfills/polyfill-module.js",
      )]: "./lib/next-polyfill-stub.js",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    // AVIF first, WebP fallback — directly targets Lighthouse's "increase
    // the image compression factor" delivery insights (often 30–50% fewer
    // bytes than the default WebP-only pipeline).
    formats: ["image/avif", "image/webp"],
    // Quality ladder used by the quality= props across the site (60 for
    // below-fold photography, 65 for the LCP hero image, 75 default).
    qualities: [50, 60, 65, 70, 75],
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
