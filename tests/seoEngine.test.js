import { describe, it, expect } from "vitest";
import { analyzeSeo, generateCleanSlug } from "../lib/seoEngine.js";

describe("analyzeSeo", () => {
	const validArticle = {
		title: "Why Connection Pooling Matters in Serverless App Routers",
		targetKeyword: "Connection Pooling",
		metaDescription:
			"Connection Pooling guide exploring how to scale database connections in Serverless Next.js App Routers using PgBouncer and connection multiplexing strategies.",
		content: `# Why Connection Pooling Matters in Serverless App Routers

Connection Pooling is critical for modern serverless applications. This guide explains why this technique is essential for scaling database connections effectively. When we talk about database connection management in serverless environments, we need to understand the fundamental challenges that arise.

## Understanding Connection Pooling

Connection Pooling allows multiple clients to share a set of database connections. It reduces the overhead of establishing new connections for each request. In a serverless architecture, this becomes even more crucial because each function invocation may run in an isolated environment. Pools help mitigate the connection storm problem that occurs when hundreds of serverless functions try to connect to the database simultaneously.

## Implementing with PgBouncer for Connection Pooling

Using Connection Pooling with PgBouncer provides a lightweight solution for managing database connections. This approach uses transaction-level pooling to efficiently distribute connections across multiple serverless functions. Understanding pool configurations like size and timeout settings is essential for optimal performance.

## Best Practices for Connection Pooling

Connection Pooling requires careful configuration of pool sizes, timeout settings, and connection limits. Strategies vary depending on your specific use case and traffic patterns. Implementing Connection Pooling correctly can dramatically improve your application performance and reliability under load.

## Production Deployments

Production environments require monitoring and optimization of database connection pools. They should be configured with appropriate max connections, idle timeout, and connection timeout values. Production deployments also benefit from connection multiplexing and prepared statement caching.

Reference: [Next.js App Router](https://nextjs.org)

## Operational Notes

Teams should also monitor queue depth, connection latency, p95 response time, cold starts, retry behavior, and database CPU usage during launches. Good observability helps engineers understand when pooling settings are healthy and when an architecture needs more tuning for reliability under real production traffic.
`,
	};

	it("returns totalScore, wordCount, and checklist", () => {
		const result = analyzeSeo(validArticle);
		expect(result).toHaveProperty("totalScore");
		expect(result).toHaveProperty("wordCount");
		expect(result).toHaveProperty("checklist");
		expect(Array.isArray(result.checklist)).toBe(true);
	});

	it("scores a well-optimized article at 80 or above", () => {
		const result = analyzeSeo(validArticle);
		expect(result.totalScore).toBeGreaterThanOrEqual(80);
	});

	it("detects keyword in the headline", () => {
		const result = analyzeSeo(validArticle);
		const item = result.checklist.find(
			(c) => c.metric === "Headline Core Topic",
		);
		expect(item).toBeDefined();
		expect(item.passed).toBe(true);
	});

	it("flags missing keyword in the headline", () => {
		const result = analyzeSeo({
			title: "No Keyword Here",
			targetKeyword: "Connection Pooling",
			metaDescription: "",
			content: "",
		});
		const item = result.checklist.find(
			(c) => c.metric === "Headline Core Topic",
		);
		expect(item).toBeDefined();
		expect(item.passed).toBe(false);
	});

	it("detects keyword in the first 100 words", () => {
		const result = analyzeSeo(validArticle);
		const item = result.checklist.find(
			(c) => c.metric === "Introductory Story Hook",
		);
		expect(item).toBeDefined();
		expect(item.passed).toBe(true);
	});

	it("detects keyword in H2 subheadings", () => {
		const result = analyzeSeo(validArticle);
		const item = result.checklist.find(
			(c) => c.metric === "Section Heading Outline",
		);
		expect(item).toBeDefined();
		expect(item.passed).toBe(true);
	});

	it("detects helpful external links", () => {
		const result = analyzeSeo(validArticle);
		const item = result.checklist.find(
			(c) => c.metric === "Helpful Context References",
		);
		expect(item).toBeDefined();
		expect(item.passed).toBe(true);
	});

	it("handles empty inputs gracefully", () => {
		const result = analyzeSeo({
			title: "",
			targetKeyword: "",
			metaDescription: "",
			content: "",
		});
		expect(result.totalScore).toBe(0);
		expect(result.wordCount).toBe(0);
		expect(result.checklist.length).toBeGreaterThan(0);
	});
});

describe("generateCleanSlug", () => {
	it("converts English titles to URL-friendly slugs", () => {
		expect(
			generateCleanSlug(
				"Why Connection Pooling is Mandatory in Modern Serverless App Routers",
			),
		).toBe(
			"why-connection-pooling-is-mandatory-in-modern-serverless-app-routers",
		);
	});

	it("lowercases Latin characters", () => {
		expect(generateCleanSlug("Hello World")).toBe("hello-world");
	});

	it("collapses repeated spaces into a single hyphen", () => {
		expect(generateCleanSlug("hello   world")).toBe("hello-world");
	});

	it("removes punctuation", () => {
		expect(generateCleanSlug("Hello, World! How are you?")).toBe(
			"hello-world-how-are-you",
		);
	});

	it("trims leading and trailing hyphens", () => {
		expect(generateCleanSlug("--hello-world--")).toBe("hello-world");
	});

	it("preserves Nepali combining marks", () => {
		expect(
			generateCleanSlug(
				"कतारबाट घर पैसा पठाउन सबैभन्दा सस्तो तरिका २०२६ मा परीक्षण गरिएका ५ उत्कृष्ट एप",
			),
		).toBe(
			"कतारबाट-घर-पैसा-पठाउन-सबैभन्दा-सस्तो-तरिका-२०२६-मा-परीक्षण-गरिएका-५-उत्कृष्ट-एप",
		);
	});

	it("returns a fallback slug for empty input", () => {
		expect(generateCleanSlug("")).toMatch(/^post-\d+$/);
	});
});
