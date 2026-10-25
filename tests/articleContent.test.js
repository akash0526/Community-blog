import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

// Regression test for the Vercel prerender crash after PR #9 merged:
// ArticleContent.jsx referenced identifiers that were never defined
// (authorProfileHref, testedMethod, sources, ...) because parallel edits
// to the same file had overwritten each other. Local builds missed it
// (no Supabase => zero article pages prerendered). This server-renders
// the component with a fully populated article — the exact code path
// that threw `ReferenceError: authorProfileHref is not defined`.
vi.mock("next/dynamic", () => ({ default: () => () => null }));

import ArticleContent from "../app/blog/[slug]/ArticleContent.jsx";

const article = {
	id: "test-1",
	slug: "esewa-vs-khalti",
	title: "eSewa vs Khalti for Freelancers: When a Local Wallet Helps",
	meta_description:
		"eSewa vs Khalti for Nepali freelancers: real limits and fees, tested.",
	category: "Payments & Finance",
	target_keyword: "eSewa vs Khalti",
	image_url: "https://images.unsplash.com/photo-1",
	content: "## Short answer\n\nUse eSewa under NPR 25,000.\n\nBody text here.",
	published_at: "2026-09-22",
	created_at: "2026-09-22T00:00:00Z",
	updated_at: "2026-10-20T00:00:00Z",
	tested_method: "Sent NPR 10,000 via eSewa on NTC on 3 Nov; arrived in 14 minutes.",
	sources: [{ label: "NRB payment systems", url: "https://www.nrb.org.np" }],
	has_affiliate_links: true,
	reviewer_name: "Test Reviewer, CA",
	reviewer_url: "https://example.com/reviewer",
	profiles: {
		full_name: "Akash Adhikari",
		username: "akash-adhikari",
		professional_role: "Founder & Lead Editor",
		avatar_url: "https://avatars.githubusercontent.com/u/148329502?v=4",
		bio: "Founder of Apex Nepal.",
		website: "https://github.com/akash0526",
		twitter: "",
		linkedin: "https://www.linkedin.com/in/example",
	},
};

describe("ArticleContent SSR (prerender path)", () => {
	it("renders a full article without ReferenceError", () => {
		const html = renderToString(
			createElement(ArticleContent, {
				serverArticle: article,
				slug: article.slug,
				related: [
					{
						slug: "send-money-to-nepal",
						title: "Send Money to Nepal",
						meta_description: "Fees compared.",
						category: "Payments & Finance",
					},
				],
				hub: { href: "/digital-payments", label: "Digital Payments hub" },
				categoryPage: "/blog/category/payments-finance",
				categoryName: "Payments & Finance",
			}),
		);

		// Canonical byline URL from `username` (the crashed expression).
		expect(html).toContain('href="/authors/akash-adhikari"');
		// E-E-A-T blocks restored by the hotfix.
		expect(html).toContain("How I tested this");
		expect(html).toContain("NRB payment systems");
		expect(html).toContain("Disclosure:");
		expect(html).toContain("Test Reviewer, CA");
		// YMYL disclaimer fires via the canonical category.
		expect(html).toContain("This is not financial advice");
		// Hub-and-spoke links.
		expect(html).toContain('href="/digital-payments"');
		expect(html).toContain('href="/blog/category/payments-finance"');
		expect(html).toContain("Send Money to Nepal");
	});
});
