import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Apex",
  description: "Terms governing use of Apex, content ownership, and liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage(){
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 prose prose-slate dark:prose-invert prose-lg">
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: July 7, 2026</p>

        <h2>1. Acceptance</h2>
        <p>By using apex-nepal.com you agree to these Terms. If you disagree, stop using the site.</p>

        <h2>2. Accounts</h2>
        <p>You must provide accurate author information. You are responsible for your password and all content posted under your account.</p>

        <h2>3. Content ownership</h2>
        <ul>
          <li>You retain copyright to your articles.</li>
          <li>You grant Apex a worldwide, non-exclusive, royalty-free license to publish, distribute, promote, and archive your content on Apex and syndication partners, with attribution.</li>
          <li>You confirm you have rights to all text, images, and data you submit.</li>
        </ul>

        <h2>4. Editorial standards</h2>
        <p>All content must follow our <a href="/editorial">Editorial Policy</a>. We may edit for clarity, reject, or remove content that is spam, defamatory, plagiarized, illegal, or AI-farm low-effort.</p>

        <h2>5. Prohibited</h2>
        <p>No hate speech, doxxing, impersonation, malware, scraping at abusive rates, or hidden affiliate links.</p>

        <h2>6. YMYL (money / health / legal)</h2>
        <p>Financial, medical, and legal articles require qualified authorship and include disclaimers. See <a href="/disclaimer">Disclaimer</a>. Not professional advice.</p>

        <h2>7. Affiliate disclosure</h2>
        <p>Some links are affiliate links. We disclose per-article. Commissions never influence test results.</p>

        <h2>8. Disclaimer / liability</h2>
        <p>Content is provided “as is”. To the fullest extent permitted by law, Apex disclaims all warranties. Liability capped at $100 USD or amounts you paid us in the prior 12 months, whichever is greater.</p>

        <h2>9. DMCA</h2>
        <p>Send takedown notices to <a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a> with: (a) signature, (b) infringing URL, (c) original work, (d) contact info, (e) good-faith statement.</p>

        <h2>10. Termination</h2>
        <p>We may suspend accounts violating these Terms.</p>

        <h2>11. Governing law</h2>
        <p>Qatar courts, with arbitration option in Doha under QICCA rules. For EU consumers, mandatory local protections apply.</p>

        <h2>12. Contact</h2>
        <p><a href="mailto:legal@apex-nepal.com">legal@apex-nepal.com</a> — Apex, Doha, Qatar</p>
      </div>
    </main>
  );
}
