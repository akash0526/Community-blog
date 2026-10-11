import { describe, expect, it } from "vitest";
import { imageKitDeliveryUrl } from "../lib/imagekitUrl.js";

describe("ImageKit article image delivery", () => {
	it("requests responsive-width, high-quality, automatic-format delivery", () => {
		const result = new URL(
			imageKitDeliveryUrl("https://ik.imagekit.io/account/blog/photo.jpg"),
		);

		expect(result.searchParams.get("tr")).toBe("w-1600,q-85,f-auto");
	});

	it("keeps existing width and quality transformations", () => {
		const result = new URL(
			imageKitDeliveryUrl(
				"https://ik.imagekit.io/account/blog/photo.jpg?tr=w-800,q-70",
			),
		);

		expect(result.searchParams.get("tr")).toBe("w-800,q-70,f-auto");
	});

	it("does not rewrite images from other CDNs", () => {
		const source = "https://images.unsplash.com/photo.jpg";
		expect(imageKitDeliveryUrl(source)).toBe(source);
	});
});
