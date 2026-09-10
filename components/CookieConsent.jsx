"use client";
import { useState } from "react";
import Link from "next/link";

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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[100] glass rounded-2xl shadow-2xl p-5 text-sm fade-up">
      <div className="font-black mb-2">🍪 We use cookies</div>
      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
        Apex uses essential cookies for login, theme, and your cookie choice.
        See our <Link href="/privacy" className="underline text-indigo-600 dark:text-indigo-400">Privacy Policy</Link>.
      </p>
      <div className="flex gap-2">
        <button onClick={() => decide("accepted")} className="btn btn-primary flex-1 py-2.5 rounded-xl font-black text-xs">Got it</button>
        <button onClick={() => decide("declined")} className="btn btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold">Essential only</button>
      </div>
    </div>
  )
}
