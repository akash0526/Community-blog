import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy – Apex Nepal" },
  description: "How Apex Nepal collects, uses, and protects your data. GDPR/CCPA compliant.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 prose prose-slate dark:prose-invert prose-lg">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: October 25, 2026</p>

        <p>Apex Nepal (“we”, “us”) operates apex-nepal.com. We respect your privacy and comply with GDPR and CCPA principles.</p>

        <h2>1. Data we collect</h2>
        <ul>
          <li><strong>Account data:</strong> name, email, avatar, bio, professional role – when you create an author account.</li>
          <li><strong>Content data:</strong> articles, comments, claps, bookmarks you submit.</li>
          <li><strong>Reading counts:</strong> aggregate per-article pageview counters stored in our own database.</li>
          <li><strong>Site analytics (cookieless):</strong> we use Vercel Web Analytics and Vercel Speed Insights to see which pages are read and how fast they load. These do <strong>not</strong> use cookies, do <strong>not</strong> store an identifier on your device, and do <strong>not</strong> track you across other websites. What is recorded is: the page URL, referrer, country, and coarse device/browser type, plus page-speed timings. Vercel derives a temporary, daily-rotating hash (from your IP address, user agent, and the page) purely to count a visit once — it is not stored, not reversible, and cannot be used to identify you. Your full IP address is never retained by us.</li>
          <li><strong>Cookies:</strong> essential session cookies (Supabase auth) and preference cookies (theme, cookie choice) only. Our analytics sets no cookies, which is exactly why we chose it.</li>
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
        <p>Legitimate interest (aggregate, cookieless audience measurement; security and anti-spam), Contract (publishing your account), Consent (anything optional we may add later).</p>

        <h2>4. Cookies & consent</h2>
        <p>We show a cookie banner to all visitors. Essential cookies always run. Our analytics is cookieless and collects no personal data, so it runs for everyone — declining does not change what is collected, because nothing identifying is collected either way. You can revisit or withdraw your cookie choice at any time via the footer “Cookie settings” link or in your browser settings, and you can block analytics entirely with any tracker blocker or by enabling Do Not Track.</p>

        <h2>5. Third parties</h2>
        <ul>
          <li>Supabase (US/EU) – authentication & database</li>
          <li>Vercel – hosting / CDN</li>
          <li>Vercel Web Analytics & Speed Insights (served first-party from this domain) – cookieless traffic and performance measurement</li>
        </ul>

        <h2>6. Data retention</h2>
        <p>Account data: until you delete your account. Aggregate analytics: up to 12 months, and it is aggregate only — there is no personal record to delete. Contact emails: 12 months.</p>

        <h2>7. Your rights</h2>
        <p>Access, rectify, erase, export, restrict, object. Email <a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a>. We respond within 30 days.</p>

        <h2>8. Children</h2>
        <p>Apex is not directed to children under 16.</p>

        <h2>9. International transfers</h2>
        <p>Data may be processed in the US / EU with Standard Contractual Clauses.</p>

        <h2>10. Advertising & third-party ad vendors</h2>
        <p>We may display ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google&rsquo;s use of advertising cookies enables it and its partners to serve ads based on your visits. You may opt out of personalised advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>, opt out of some third-party vendors at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info/choices</a>, and (in the EEA/UK) manage consent through our cookie banner before any advertising cookie is set. Where ads are not yet enabled on a page, no advertising cookies are set. Affiliate links are disclosed on the page itself; see our <a href="/editorial">editorial policy</a>.</p>

        <h2>11. Changes</h2>
        <p>We will post updates here with a new “last updated” date.</p>

        {/* TODO(owner, playbook §4): legal jurisdiction/address previously
            said "Doha, Qatar" while the editorial base is Nepal. Confirm the
            correct legal contact city/country and update this line plus
            /terms (governing law) together. See SEO_PLAYBOOK_IMPLEMENTATION.md. */}
        <p><strong>Contact:</strong> Apex Nepal, Nepal — <a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a></p>
      </div>
    </div>
  );
}
