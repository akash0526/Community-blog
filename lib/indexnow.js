// lib/indexnow.js
// IndexNow (playbook §5.6): notifies Bing/Yandex the moment a post is
// published or updated — Bing's index also feeds ChatGPT search/Copilot.
// The key is public by design: it must be served from /<key>.txt
// (public/783775f8cca553bfd358bf2c9497384f.txt). Override with
// NEXT_PUBLIC_INDEXNOW_KEY if you ever rotate it (then rename the file).
//
// Two entry points:
//   submitIndexNow(urls) — SERVER ONLY. IndexNow is a server-to-server
//     API with no CORS support, so calling it from the browser silently
//     fails on the JSON preflight. (That was the first implementation's
//     bug — the catch hid it.) Used by app/api/indexnow/route.ts.
//   pingIndexNow(urls) — client-safe fire-and-forget: POSTs to our own
//     /api/indexnow route, which validates + submits server-side.

export const INDEXNOW_KEY =
	process.env.NEXT_PUBLIC_INDEXNOW_KEY || "783775f8cca553bfd358bf2c9497384f";

/** SERVER ONLY. Returns true if IndexNow accepted the submission. */
export async function submitIndexNow(urls) {
	const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
	if (!list.length || !INDEXNOW_KEY) return false;
	try {
		const host = new URL(list[0]).host;
		const res = await fetch("https://api.indexnow.org/indexnow", {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify({
				host,
				key: INDEXNOW_KEY,
				keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
				urlList: list,
			}),
		});
		// 200 = received, 202 = received & key validation pending.
		return res.status === 200 || res.status === 202;
	} catch {
		return false;
	}
}

/** Client-safe, fire-and-forget: never blocks or fails a publish. */
export async function pingIndexNow(urls) {
	const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
	if (!list.length) return;
	try {
		await fetch("/api/indexnow", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ urls: list }),
			keepalive: true,
		});
	} catch {
		// best effort only
	}
}
