import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Apex",
  description: "How Apex collects, uses, and protects your data. GDPR/CCPA compliant.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 prose prose-slate dark:prose-invert prose-lg">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: July 7, 2026</p>

        <p>Apex (“we”, “us”) operates apex-nepal.com. We respect your privacy and comply with GDPR, CCPA, and Qatar PDPL principles.</p>

        <h2>1. Data we collect</h2>
        <ul>
          <li><strong>Account data:</strong> name, email, avatar, bio, professional role – when you create an author account.</li>
          <li><strong>Content data:</strong> articles, comments, claps, bookmarks you submit.</li>
          <li><strong>Reading counts:</strong> aggregate per-article pageview counters stored in our own database (no third-party analytics trackers are installed today).</li>
          <li><strong>Cookies:</strong> essential session cookies (Supabase auth) and preference cookies (theme, cookie choice). If we add analytics in the future, it will be opt-in and this policy will be updated first.</li>
          <li><strong>Contact form:</strong> name, email, message – only to reply.</li>
        </ul>

        <h2>2. How we use it</h2>
        <ul>
          <li>Publish your bylined articles.</li>
          <li>Improve site performance and Core Web Vitals.</li>
          <li>Detect abuse / spam.</li>
          <li>Reply to your inquiries.</li>
        </ul>
        <p>We do <strong>not</strong> sell personal data. Ever.</p>

        <h2>3. Legal bases (GDPR)</h2>
        <p>Consent (analytics), Contract (publishing your account), Legitimate interest (security, anti-spam).</p>

        <h2>4. Cookies & consent</h2>
        <p>We show a cookie banner to all visitors. Essential cookies always run. You can revisit or withdraw your choice at any time via the footer “Cookie settings” link or in your browser settings.</p>

        <h2>5. Third parties</h2>
        <ul>
          <li>Supabase (US/EU) – authentication & database</li>
          <li>Vercel – hosting / CDN</li>
        </ul>

        <h2>6. Data retention</h2>
        <p>Account data: until you delete your account. Analytics: 14 months. Contact emails: 12 months.</p>

        <h2>7. Your rights</h2>
        <p>Access, rectify, erase, export, restrict, object. Email <a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a>. We respond within 30 days.</p>

        <h2>8. Children</h2>
        <p>Apex is not directed to children under 16.</p>

        <h2>9. International transfers</h2>
        <p>Data may be processed in the US / EU with Standard Contractual Clauses.</p>

        <h2>10. Changes</h2>
        <p>We will post updates here with a new “last updated” date.</p>

        <p><strong>Contact:</strong> Apex, Doha, Qatar — <a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a></p>
      </div>
    </main>
  );
}
