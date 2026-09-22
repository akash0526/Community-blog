"use client";
import { useState } from "react";
import Link from "next/link";
import { IconCheck } from "./Icon";

// Read once during state init (this component is client-only via
// next/dynamic ssr:false, so localStorage is always available here).
function readConsent() {
  try {
    return localStorage.getItem("apex_cookie_consent");
  } catch {
    return "dismissed";
  }
}

export default function CookieConsent(){
  const [choice, setChoice] = useState(readConsent);

  const decide = (value) => {
    try { localStorage.setItem("apex_cookie_consent", value); } catch {}
    setChoice(value);
  };

  if (choice) return null;
  return (
    <div className="card reveal in fixed bottom-4 left-4 right-4 z-[100] !gap-3 !p-5 text-sm sm:left-auto sm:right-6 sm:max-w-md">
      <div className="flex items-center gap-2 font-semibold">
        <span className="tile__icon !mb-0 !h-7 !w-7">
          <IconCheck className="icon icon--15" />
        </span>
        Your cookie choice
      </div>
      <p className="text-[0.875rem] leading-relaxed text-[var(--ink-muted)]">
        Apex uses essential cookies for login, theme, and your cookie choice. See
        our <Link href="/privacy" className="link">Privacy Policy</Link>.
      </p>
      <div className="flex gap-2">
        <button onClick={() => decide("accepted")} className="btn btn--primary flex-1 justify-center !py-2.5 !text-[0.8125rem]">
          Got it
        </button>
        <button onClick={() => decide("declined")} className="btn btn--ghost !py-2.5 !text-[0.8125rem]">
          Essential only
        </button>
      </div>
    </div>
  );
}
