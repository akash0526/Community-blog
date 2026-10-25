import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/articles";
import { submitIndexNow } from "@/lib/indexnow";

// IndexNow submission proxy (playbook §5.6). The Studio calls this after a
// successful publish; the browser can't call api.indexnow.org directly
// (no CORS). Only URLs on our own host are accepted — IndexNow verifies
// ownership via the key file anyway, this just stops the route being used
// as a generic ping relay.
export async function POST(request: Request) {
	let urls: string[] = [];
	try {
		const body = (await request.json()) as { urls?: unknown; url?: unknown };
		const raw = Array.isArray(body?.urls) ? body.urls : [body?.url ?? body?.urls];
		urls = raw.filter((u): u is string => typeof u === "string" && u.length > 0);
	} catch {
		return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
	}

	if (!urls.length || urls.length > 100) {
		return NextResponse.json(
			{ ok: false, error: "provide 1-100 urls" },
			{ status: 400 },
		);
	}

	const siteHost = new URL(SITE_URL).host;
	for (const url of urls) {
		let parsed: URL;
		try {
			parsed = new URL(url);
		} catch {
			return NextResponse.json(
				{ ok: false, error: `invalid url: ${url}` },
				{ status: 400 },
			);
		}
		if (parsed.host !== siteHost) {
			return NextResponse.json(
				{ ok: false, error: `foreign host: ${parsed.host}` },
				{ status: 400 },
			);
		}
	}

	const delivered = await submitIndexNow(urls);
	// 202 either way from the client's perspective: publishing must never
	// fail because an indexing ping did. `delivered` is for debugging.
	return NextResponse.json(
		{ ok: true, delivered, count: urls.length },
		{ status: 202 },
	);
}
