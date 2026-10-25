import { describe, it, expect } from "vitest";
import {
	resolveCategory,
	normalizeCategory,
	categoryFromSlug,
	categoryPagePath,
	hubForCategory,
} from "../lib/categories.js";
import {
	articleMetadataTitle,
	authorSlugFor,
	parseSources,
} from "../lib/seoUtils.js";
import { analyzeSeo } from "../lib/seoEngine.js";

describe("categories (playbook §5.4)", () => {
	it("keeps canonical values", () => {
		expect(normalizeCategory("Payments & Finance")).toBe("Payments & Finance");
	});

	it("renames exact legacy values", () => {
		expect(normalizeCategory("Business & Finance")).toBe("Payments & Finance");
		expect(normalizeCategory("Tech & AI")).toBe("AI Tools & Automation");
	});

	it("routes broad buckets by title keywords", () => {
		expect(
			normalizeCategory("Tool Reviews & Comparisons", "eSewa vs Khalti limits"),
		).toBe("Payments & Finance");
		expect(
			normalizeCategory("Guides & Tutorials", "How to apply for scholarships"),
		).toBe("Student Resources");
	});

	it("builds real category page paths (never /?category=)", () => {
		expect(categoryPagePath("Payments & Finance")).toBe(
			"/blog/category/payments-finance",
		);
		expect(categoryPagePath("Unknown Bucket")).toBe("/blog");
	});

	it("resolves slugs and hubs", () => {
		expect(categoryFromSlug("ai-tools")?.value).toBe("AI Tools & Automation");
		expect(categoryFromSlug("nope")).toBeNull();
		expect(hubForCategory("Freelancing & Remote Work").href).toBe(
			"/freelancing-in-nepal",
		);
		expect(resolveCategory("")).toBeNull();
	});
});

describe("articleMetadataTitle (playbook §5.3/§6.1)", () => {
	it("prefers seo_title as an absolute title", () => {
		expect(
			articleMetadataTitle({
				title:
					"After Your First International Payment: PAN, Invoicing and Filing for Nepali Freelancers (FY 2083/84)",
				seo_title: "Freelancer Tax in Nepal: PAN, Invoices & Filing (2083/84)",
			}),
		).toEqual({
			absolute: "Freelancer Tax in Nepal: PAN, Invoices & Filing (2083/84)",
		});
	});

	it("drops the brand suffix for long H1s without seo_title", () => {
		const long = "x".repeat(80);
		expect(articleMetadataTitle({ title: long })).toEqual({ absolute: long });
	});

	it("returns short titles plainly so the template adds the brand", () => {
		expect(articleMetadataTitle({ title: "Short title" })).toBe("Short title");
	});
});

describe("authorSlugFor / parseSources", () => {
	it("prefers username over name-derived slug", () => {
		expect(
			authorSlugFor({ username: "akash-adhikari", full_name: "Akash" }),
		).toBe("akash-adhikari");
		expect(authorSlugFor({ full_name: "Sita Sharma" })).toBe("sita-sharma");
	});

	it("parses jsonb sources in all stored shapes", () => {
		expect(parseSources(null)).toEqual([]);
		expect(parseSources([{ label: "NRB", url: "https://www.nrb.org.np" }])).toEqual([
			{ label: "NRB", url: "https://www.nrb.org.np" },
		]);
		expect(parseSources(["https://ird.gov.np"])).toEqual([
			{ label: "https://ird.gov.np", url: "https://ird.gov.np" },
		]);
		expect(parseSources('[{"label":"IRD","url":"https://ird.gov.np"}]')).toEqual([
			{ label: "IRD", url: "https://ird.gov.np" },
		]);
		expect(parseSources([{ label: "no url" }])).toEqual([]);
	});
});

describe("analyzeSeo playbook checks (§14)", () => {
	const base = {
		title: "eSewa vs Khalti for Freelancers: When a Local Wallet Helps and When It Costs You",
		targetKeyword: "eSewa vs Khalti",
		metaDescription:
			"eSewa vs Khalti for Nepali freelancers: real limits, fees and withdrawal tests on NTC, checked this month with receipts.",
		content: "## Intro\n\nword ".repeat(1),
	};

	it("flags a long title without seo_title and passes with one", () => {
		const without = analyzeSeo(base).checklist.find(
			(c) => c.metric === "SEO Title Length (≤60)",
		);
		expect(without.passed).toBe(false);

		const withSeo = analyzeSeo({
			...base,
			seoTitle: "eSewa vs Khalti for Freelancers: Limits & Fees 2026",
		}).checklist.find((c) => c.metric === "SEO Title Length (≤60)");
		expect(withSeo.passed).toBe(true);
	});

	it("counts in-text internal links, tables and official sources", () => {
		const content = [
			"Short answer: use eSewa under NPR 25,000.",
			"",
			"| Wallet | Limit |",
			"|---|---|",
			"| eSewa | 25,000 |",
			"",
			"See [sending money](/blog/send-money-to-nepal), [receiving USD](/blog/receive-usd) and [tax basics](/blog/freelancer-tax).",
			"Official: [NRB](https://www.nrb.org.np) [IRD](https://ird.gov.np) [eSewa fees](https://esewa.com.np)",
			"",
			"## How I tested this",
			"",
			"## FAQ",
		].join("\n");
		const result = analyzeSeo({ ...base, seoTitle: "eSewa vs Khalti 2026", content });
		const byMetric = Object.fromEntries(result.checklist.map((c) => [c.metric, c]));
		expect(byMetric["In-text Internal Links"].passed).toBe(true);
		expect(byMetric["Official / Primary Sources"].passed).toBe(true);
		expect(byMetric["Comparison Table"].passed).toBe(true);
		expect(byMetric["Short Answer + FAQ"].passed).toBe(true);
		expect(byMetric["How I Tested This"].passed).toBe(true);
	});
});
