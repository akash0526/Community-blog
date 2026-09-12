"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

// Renders a stable placeholder on server/SSR, then hydrates to the real
// locale date on the client. Prevents React hydration mismatch #418
// where toLocaleDateString differs between Node (SSR) and browser.
export default function ClientDate({ date, options = { year: "numeric", month: "short", day: "numeric" }, placeholder = "—", fallback = "Recently" }) {
  const opts = options;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    // Server and initial client render must match
    return <span suppressHydrationWarning>{placeholder}</span>;
  }
  if (!date) return <span>{fallback}</span>;
  let formatted = fallback;
  try {
    formatted = new Date(date).toLocaleDateString("en-GB", opts);
  } catch {
    formatted = fallback;
  }
  return <span>{formatted}</span>;
}
