import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const UPLOAD_AUTH_LIFETIME_SECONDS = 60 * 60;

export async function POST(request: Request) {
	const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
	const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();

	if (!publicKey || !privateKey) {
		return NextResponse.json(
			{
				error:
					"ImageKit is not configured. Add IMAGEKIT_PUBLIC_KEY and IMAGEKIT_PRIVATE_KEY to the server environment.",
			},
			{ status: 503, headers: { "Cache-Control": "no-store" } },
		);
	}

	// This endpoint is called only by the same-site writing studio. Reject
	// browser cross-origin requests while still supporting reverse proxies.
	const origin = request.headers.get("origin");
	const forwardedHosts = (request.headers.get("x-forwarded-host") || "")
		.split(",")
		.map((host) => host.trim().toLowerCase())
		.filter(Boolean);
	const requestHosts = [
		...forwardedHosts,
		(request.headers.get("host") || "").trim().toLowerCase(),
	].filter(Boolean);
	if (origin && requestHosts.length > 0) {
		try {
			const originHost = new URL(origin).host.toLowerCase();
			if (!requestHosts.includes(originHost)) {
				return NextResponse.json(
					{ error: "Image upload authorization must be requested from this site." },
					{ status: 403, headers: { "Cache-Control": "no-store" } },
				);
			}
		} catch {
			return NextResponse.json(
				{ error: "The image upload request has an invalid origin." },
				{ status: 403, headers: { "Cache-Control": "no-store" } },
			);
		}
	}

	const token = randomUUID();
	const expire = Math.floor(Date.now() / 1000) + UPLOAD_AUTH_LIFETIME_SECONDS;
	const signature = createHmac("sha1", privateKey)
		.update(`${token}${expire}`)
		.digest("hex");

	return NextResponse.json(
		{ token, expire, signature, publicKey },
		{ headers: { "Cache-Control": "no-store" } },
	);
}
