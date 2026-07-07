import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy – Apex",
  description: "How Apex creates, fact-checks, corrects, and labels content. YMYL standards, affiliate disclosure, and corrections policy.",
  alternates: { canonical: "/editorial" },
};

export default function EditorialPage(){
  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 prose prose-slate dark:prose-invert prose-lg">
        <h1>Editorial Policy</h1>
        <p className="lead">Last updated: July 7, 2026 — v1.0</p>

        <h2>Mission</h2>
        <p>Apex publishes tested, cited, human-written stories. No AI farms. No fake metrics. Real authors, real evidence.</p>

        <h2>How content is created</h2>
        <ul>
          <li>All articles have a named human author with a public profile: photo, bio, credentials, social links.</li>
          <li>“I tested” claims require first-hand evidence: dated screenshots, receipts (sensitive data blurred), exact amounts, methodology section.</li>
          <li>We cite primary sources with live links: regulators, official apps, court filings, peer-reviewed studies.</li>
          <li>AI tools may assist drafting / grammar, but a human editor fact-checks every published piece. We do not publish unedited AI output.</li>
        </ul>

        <h2>Fact-checking</h2>
        <ul>
          <li>Financial rates / fees verified same-day with screenshots.</li>
          <li>News / politics: minimum 2 independent reputable sources, linked inline.</li>
          <li>YMYL topics (money, health, legal, immigration) are reviewed by a subject-qualified editor before publish.</li>
        </ul>

        <h2>Corrections</h2>
        <p>We fix verified errors within 24 hours. Every substantive change gets a public correction note at the bottom of the article with date and what changed. See <Link href="/corrections">Corrections log</Link>.</p>
        <p>Report errors: <a href="mailto:editor@apex-nepal.com">editor@apex-nepal.com</a></p>

        <h2>Sponsored / affiliate content</h2>
        <ul>
          <li>All affiliate links are clearly disclosed at the top of the article.</li>
          <li>Sponsored posts are labeled “Sponsored” and use <code>rel="sponsored"</code>.</li>
          <li>Sponsors never see copy before publish and cannot alter test results.</li>
          <li>We do not do “pay for positive review”.</li>
        </ul>

        <h2>Author qualifications (E-E-A-T)</h2>
        <ul>
          <li><strong>Experience:</strong> show proof you did the thing.</li>
          <li><strong>Expertise:</strong> financial / health / legal articles by qualified authors only.</li>
          <li><strong>Authoritativeness:</strong> real bylines, credentials, external references.</li>
          <li><strong>Trustworthiness:</strong> contact info, corrections, privacy policy, HTTPS, last-updated dates.</li>
        </ul>

        <h2>Updating articles</h2>
        <p>Time-sensitive guides show “Published” + “Last updated” dates. We review remittance / visa / pricing content at least quarterly.</p>

        <h2>Comment moderation</h2>
        <p>Comments are pre-moderated for spam / hate. Real discussion is welcome. Fake engagement is not.</p>

        <h2>AI / LLM disclosure</h2>
        <p>We optimize for clarity so humans and AI crawlers can trust our content: structured data, citations, real authors, clean HTML. We do not cloak or hide text from crawlers.</p>

        <h2>Contact</h2>
        <p>Editorial: <a href="mailto:editor@apex-nepal.com">editor@apex-nepal.com</a> — <Link href="/contact">contact page</Link></p>
      </div>
    </main>
  );
}
