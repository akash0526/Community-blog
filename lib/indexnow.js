// lib/indexnow.js
// IndexNow (playbook §5.6): pings Bing/Yandex the moment a post is
// published or updated, so it can be indexed in minutes — Bing's index also
// feeds ChatGPT search and Copilot. The key is public by design: it must be
// served from /<key>.txt (public/783775f8cca553bfd358bf2c9497384f.txt).
// Override with NEXT_PUBLIC_INDEXNOW_KEY if you ever rotate it (then rename
// the file in public/ to match).

export const INDEXNOW_KEY =
	process.env.NEXT_PUBLIC_INDEXNOW_KEY || "783775f8cca553bfd358bf2c9497384f";

/** Fire-and-forget: never block or fail a publish because IndexNow is down. */
export async function pingIndexNow(urls) {
	const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
	if (!list.length || !INDEXNOW_KEY) return;
	try {
		const host = new URL(list[0]).host;
		await fetch("https://api.indexnow.org/indexnow", {
			method: "POST",
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify({
				host,
				key: INDEXNOW_KEY,
				keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
				urlList: list,
			}),
		});
	} catch {
		// best effort only
	}
}
