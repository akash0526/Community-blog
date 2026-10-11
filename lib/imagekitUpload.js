const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

const FILE_EXTENSION_BY_TYPE = {
	"image/avif": "avif",
	"image/gif": "gif",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
};

export function validateArticleImage(file) {
	if (!file || !SUPPORTED_IMAGE_TYPES.has(file.type)) {
		throw new Error("Choose a JPEG, PNG, WebP, AVIF, or GIF image.");
	}

	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		throw new Error("Images must be 20 MB or smaller.");
	}

	return true;
}

export function createImageUploadFileName(file) {
	const baseName = String(file?.name || "photo")
		.replace(/\.[^.]*$/, "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9_-]+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^[-_]+|[-_]+$/g, "")
		.slice(0, 70);
	const uniqueId =
		globalThis.crypto?.randomUUID?.() ||
		`${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	const extension = FILE_EXTENSION_BY_TYPE[file?.type] || "jpg";

	return `${baseName || "photo"}-${uniqueId}.${extension}`;
}

async function readJsonResponse(response) {
	try {
		return await response.json();
	} catch {
		return {};
	}
}

/** Upload one image directly from the browser to ImageKit. The app server
 * only signs the short-lived upload request; image bytes never pass through
 * Next.js or Supabase. */
export async function uploadArticleImage(file) {
	validateArticleImage(file);

	const authResponse = await fetch("/api/imagekit/auth", {
		method: "POST",
		headers: { Accept: "application/json" },
	});
	const auth = await readJsonResponse(authResponse);

	if (!authResponse.ok) {
		throw new Error(
			auth.error || "Image uploads are not configured. Check the ImageKit setup.",
		);
	}

	const formData = new FormData();
	formData.append("file", file);
	formData.append("fileName", createImageUploadFileName(file));
	formData.append("folder", "/apex-community/blogs");
	formData.append("useUniqueFileName", "true");
	formData.append("publicKey", auth.publicKey);
	formData.append("signature", auth.signature);
	formData.append("expire", String(auth.expire));
	formData.append("token", auth.token);

	const uploadResponse = await fetch(
		"https://upload.imagekit.io/api/v1/files/upload",
		{ method: "POST", body: formData },
	);
	const uploadedImage = await readJsonResponse(uploadResponse);

	if (!uploadResponse.ok) {
		throw new Error(
			uploadedImage.message ||
				uploadedImage.help ||
				"ImageKit could not upload this image. Please try again.",
		);
	}

	if (!uploadedImage.url || !uploadedImage.fileId) {
		throw new Error("ImageKit returned an incomplete upload response.");
	}

	return uploadedImage;
}
