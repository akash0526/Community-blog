"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Navigation feedback without a blocking curtain.
 *
 * The old page loader covered the whole screen for ~350 ms on every route
 * change, which made the site feel *slower* than it is. This renders a
 * 2px progress line instead: it only appears if a navigation is still
 * pending after 120 ms (prefetched routes never show it), and disappears
 * the instant the new route paints — so fast pages stay invisible-fast and
 * slow ones still acknowledge the tap immediately.
 */
export function NavigationProgress() {
	const pathname = usePathname();
	const barRef = useRef<HTMLDivElement | null>(null);
	const timer = useRef<number | null>(null);

	const show = (value: boolean) => {
		barRef.current?.setAttribute("data-active", value ? "true" : "false");
	};

	useEffect(() => {
		const clear = () => {
			if (timer.current !== null) {
				window.clearTimeout(timer.current);
				timer.current = null;
			}
		};

		const onClick = (event: MouseEvent) => {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const anchor = (event.target as Element | null)?.closest?.("a");
			if (!anchor) return;
			if (anchor.target && anchor.target !== "_self") return;
			if (anchor.hasAttribute("download")) return;

			const href = anchor.getAttribute("href");
			if (!href || !href.startsWith("/") || href.startsWith("//")) return;

			// Same route (only the hash changed): no navigation, no bar.
			const next = new URL(href, window.location.href);
			if (
				next.pathname === window.location.pathname &&
				next.search === window.location.search
			) {
				return;
			}

			clear();
			// Only surface the bar if the navigation is actually slow.
			timer.current = window.setTimeout(() => {
				show(true);
			}, 120);
		};

		document.addEventListener("click", onClick, true);
		return () => {
			document.removeEventListener("click", onClick, true);
			clear();
		};
	}, []);

	useEffect(() => {
		// A route change means the wait is over. Written straight to the
		// DOM: this is a decorative external-system update, not app state.
		if (timer.current !== null) {
			window.clearTimeout(timer.current);
			timer.current = null;
		}
		barRef.current?.setAttribute("data-active", "false");
	}, [pathname]);

	return <div ref={barRef} className="nav-progress" aria-hidden="true" />;
}
