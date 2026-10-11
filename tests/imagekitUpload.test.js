import { describe, expect, it } from "vitest";
import {
	createImageUploadFileName,
	validateArticleImage,
} from "../lib/imagekitUpload.js";
import {
	createMarkdownImage,
	imageAltFromFileName,
	insertMarkdownBlockAtSelection,
} from "../lib/markdownImages.js";

describe("ImageKit upload helpers", () => {
	it("accepts supported high-resolution image files up to 20 MB", () => {
		expect(
			validateArticleImage({ type: "image/jpeg", size: 20 * 1024 * 1024 }),
		).toBe(true);
	});

	it("rejects unsupported formats and oversized files", () => {
		expect(() =>
			validateArticleImage({ type: "image/svg+xml", size: 200 }),
		).toThrow("Choose a JPEG, PNG, WebP, AVIF, or GIF image.");
		expect(() =>
			validateArticleImage({ type: "image/png", size: 20 * 1024 * 1024 + 1 }),
		).toThrow("Images must be 20 MB or smaller.");
	});

	it("creates a safe, unique filename while preserving the image format", () => {
		const first = createImageUploadFileName({
			name: "My Kathmandu photo.png",
			type: "image/png",
		});
		const second = createImageUploadFileName({
			name: "My Kathmandu photo.png",
			type: "image/png",
		});

		expect(first).toMatch(/^My-Kathmandu-photo-.+\.png$/);
		expect(second).not.toBe(first);
	});
});

describe("Markdown images", () => {
	it("builds Markdown that preserves alt text and an optional caption", () => {
		expect(
			createMarkdownImage({
				url: "https://ik.imagekit.io/account/photo.jpg",
				alt: "Evening light",
				caption: 'A reader\'s view of the city',
			}),
		).toBe(
			'![Evening light](<https://ik.imagekit.io/account/photo.jpg> "A reader\'s view of the city")',
		);
	});

	it("uses a readable filename as a useful default alt description", () => {
		expect(imageAltFromFileName("pokhara-sunrise_2026.jpg")).toBe(
			"pokhara sunrise 2026",
		);
	});

	it("inserts an image at the chosen selection between prose paragraphs", () => {
		const result = insertMarkdownBlockAtSelection(
			"Opening paragraph.\n\nClosing paragraph.",
			{ start: 20, end: 20 },
			"![A photo](<https://ik.imagekit.io/account/photo.jpg>)",
		);

		expect(result.content).toBe(
			"Opening paragraph.\n\n![A photo](<https://ik.imagekit.io/account/photo.jpg>)\n\nClosing paragraph.",
		);
		expect(result.cursorPosition).toBe(
			"Opening paragraph.\n\n![A photo](<https://ik.imagekit.io/account/photo.jpg>)\n\n".length,
		);
	});

	it("appends an image when no editor selection is available", () => {
		expect(
			insertMarkdownBlockAtSelection("Story text", null, "![Photo](<https://example.com/photo.jpg>)")
				.content,
		).toBe("Story text\n\n![Photo](<https://example.com/photo.jpg>)");
	});
});
