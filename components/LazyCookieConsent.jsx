"use client";

import dynamic from "next/dynamic";

// Lazy-load cookie consent — not critical for FCP/LCP.
// ssr: false is only allowed in Client Components.
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});

export default function LazyCookieConsent() {
  return <CookieConsent />;
}
