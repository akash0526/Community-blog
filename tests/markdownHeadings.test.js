import { describe, expect, it } from "vitest";
import {
	extractHeadings,
	headingPlainText,
	readingTimeMinutes,
	slugifyHeading,
} from "../lib/markdownHeadings.js";

describe("markdown headings", () => {
	it("strips inline formatting for TOC labels", () => {
		expect(headingPlainText("**Bold** and `code` [link](https://x.dev)")).toBe(
			"Bold and code link",
		);
	});

	it("slugifies punctuation while keeping Nepali letters", () => {
		expect(slugifyHeading("1. Getting Started!")).toBe("1-getting-started");
		expect(slugifyHeading("नेपालमा फ्रील्यान्सिङ")).toBe("नेपालमा-फ्रील्यान्सिङ");
		expect(slugifyHeading("!!!")).toBe("section");
	});

	it("extracts h2/h3 in order and ignores fenced code", () => {
		const md = [
			"# Title",
			"## First Section",
			"text",
			"```md",
			"## not a heading",
			"```",
			"### A *Sub* Section",
			"## First Section",
		].join("\n");

		expect(extractHeadings(md)).toEqual([
			{ id: "first-section", text: "First Section", level: 2 },
			{ id: "a-sub-section", text: "A Sub Section", level: 3 },
			{ id: "first-section-2", text: "First Section", level: 2 },
		]);
	});

	it("never estimates less than a one minute read", () => {
		expect(readingTimeMinutes("hello world")).toBe(1);
		expect(readingTimeMinutes(Array(401).fill("word").join(" "))).toBe(2);
	});
});
