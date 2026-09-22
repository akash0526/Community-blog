import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer – Apex",
  description: "Financial, medical, legal, and affiliate disclaimers for Apex.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage(){
  return (
    <div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 prose prose-slate dark:prose-invert prose-lg">
        <h1>Disclaimer</h1>
        <p className="lead">Last updated: July 7, 2026</p>

        <h2>General</h2>
        <p>Content on Apex is for informational purposes only. We make reasonable efforts to ensure accuracy, but information can change. Verify independently before acting.</p>

        <h2>Financial disclaimer</h2>
        <p>Remittance fees, exchange rates, investment mentions, and money-transfer comparisons are not financial advice. Rates change hourly. Always confirm live rates in the provider app before transferring. Apex and its authors are not licensed financial advisors. You are solely responsible for your financial decisions.</p>

        <h2>Medical / health disclaimer</h2>
        <p>Health & Wellness content is educational only, not medical advice, diagnosis, or treatment. Consult a qualified healthcare professional.</p>

        <h2>Legal / immigration disclaimer</h2>
        <p>Visa, immigration, QID, labor-law content is general information, not legal advice. Qatar laws change. Confirm with MOI / official government portals or a licensed attorney.</p>

        <h2>Affiliate disclosure</h2>
        <p>Some links are affiliate links. If you click and sign up, Apex may earn a commission at no extra cost to you. This helps fund independent testing. Commissions never influence our rankings. Sponsored content is clearly labeled “Sponsored”.</p>

        <h2>Test results</h2>
        <p>“I tested” articles show real transactions performed by the author on stated dates, with screenshots where possible. Your results may vary by corridor, bank, KYC status, and time of day.</p>

        <p>Questions: <a href="mailto:editor@apex-nepal.com">editor@apex-nepal.com</a></p>
      </div>
    </div>
  );
}
