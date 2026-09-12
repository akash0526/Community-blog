"use client";

import { useState } from "react";

// Simple placeholder subscribe form.
// Currently stores email in localStorage as placeholder.
// Wire to Supabase when you create a `subscribers` table:
//   supabase.from('subscribers').insert({ email, category, created_at: new Date() })
export default function SubscribeForm({ category = "general" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      // Placeholder: store locally so you see it works without Supabase table yet.
      // TODO: Replace with Supabase insert when you create `subscribers` table.
      if (typeof window !== "undefined") {
        const key = `apex_subscribe_${category}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        if (!existing.includes(trimmed)) {
          existing.push(trimmed);
          localStorage.setItem(key, JSON.stringify(existing));
        }
      }
      // Simulate network
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
      setMessage("Thanks — we'll notify you when this guide is live.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md">
      <label htmlFor={`subscribe-${category}`} className="sr-only">
        Email address
      </label>
      <input
        id={`subscribe-${category}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={status === "loading" || status === "success"}
      />
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black text-sm whitespace-nowrap"
      >
        {status === "loading" ? "Saving…" : status === "success" ? "Saved ✓" : "Notify me"}
      </button>
      {message && (
        <p
          className={`text-xs mt-2 sm:mt-0 sm:ml-2 sm:self-center ${status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
