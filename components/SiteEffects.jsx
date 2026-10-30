"use client";

// Scroll reveal + the sticky-header hairline, in vanilla JS: one passive
// scroll listener (rAF-throttled) and one IntersectionObserver. No animation
// library, no per-frame layout reads.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = ".reveal";

export default function SiteEffects() {
	const pathname = usePathname();

	useEffect(() => {
		const header = document.getElementById("header");
		let frame = 0;

		const syncHeader = () => {
			frame = 0;
			header?.classList.toggle("is-stuck", window.scrollY > 4);
		};

		const onScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(syncHeader);
		};

		syncHeader();
		window.addEventListener("scroll", onScroll, { passive: true });

		const cleanupScroll = () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const revealAll = () => {
			document
				.querySelectorAll(`${REVEAL_SELECTOR}:not(.in)`)
				.forEach((el) => el.classList.add("in"));
		};

		if (reduceMotion || typeof IntersectionObserver === "undefined") {
			revealAll();
			return cleanupScroll;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add("in");
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
		);

		const observe = (root) => {
			if (root.nodeType !== 1) return;
			const element = root;
			if (element.matches?.(REVEAL_SELECTOR) && !element.classList.contains("in")) {
				observer.observe(element);
			}
			element
				.querySelectorAll?.(`${REVEAL_SELECTOR}:not(.in)`)
				.forEach((el) => observer.observe(el));
		};

		observe(document.body);

		// Cards rendered later (filters, "load more") are picked up by
		// inspecting only the nodes that were actually added.
		const mutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) observe(node);
			}
		});
		mutationObserver.observe(document.body, { childList: true, subtree: true });

		return () => {
			cleanupScroll();
			mutationObserver.disconnect();
			observer.disconnect();
		};
	}, [pathname]);

	return null;
}
