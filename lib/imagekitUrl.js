const DEFAULT_IMAGE_WIDTH = 1600;
const DEFAULT_IMAGE_QUALITY = 85;

function getConfiguredImageKitHost() {
	const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
	if (!endpoint) return null;

	try {
		const parsedEndpoint = new URL(endpoint);
		return parsedEndpoint.protocol === "https:" ? parsedEndpoint.hostname : null;
	} catch {
		return null;
	}
}

/** Build a high-resolution, format-aware ImageKit delivery URL for article
 * photos. Other image hosts are returned untouched. */
export function imageKitDeliveryUrl(
	source,
	{ width = DEFAULT_IMAGE_WIDTH, quality = DEFAULT_IMAGE_QUALITY } = {},
) {
	if (!source) return source;

	try {
		const url = new URL(source);
		const isImageKitHost =
			url.protocol === "https:" &&
			(url.hostname === "ik.imagekit.io" ||
				url.hostname === getConfiguredImageKitHost());
		if (!isImageKitHost) return source;

		const transformations = (url.searchParams.get("tr") || "")
			.split(",")
			.map((transformation) => transformation.trim())
			.filter(Boolean);
		if (!transformations.some((transformation) => /^w-\d+$/i.test(transformation))) {
			transformations.push(`w-${Math.max(1, Math.round(width))}`);
		}
		if (!transformations.some((transformation) => /^q-\d+$/i.test(transformation))) {
			transformations.push(`q-${Math.max(1, Math.min(100, Math.round(quality)))}`);
		}
		if (!transformations.some((transformation) => /^f-/i.test(transformation))) {
			transformations.push("f-auto");
		}

		url.searchParams.set("tr", transformations.join(","));
		return url.toString();
	} catch {
		return source;
	}
}
