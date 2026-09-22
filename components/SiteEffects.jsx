"use client";

// Brief §2.6 + §19 — scroll reveal, and §4 — the sticky header hairline.
// Deliberately vanilla: IntersectionObserver + one passive scroll listener,
// no new dependencies (§17).

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteEffects() {
	const pathname = usePathname();

	useEffect(() => {
		const header = document.getElementById("header");
		const onScroll = () => {
			header?.classList.toggle("is-stuck", window.scrollY > 8);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const revealNow = () => {
			document
				.querySelectorAll(".reveal:not(.in)")
				.forEach((el) => el.classList.add("in"));
		};

		if (reduceMotion || typeof IntersectionObserver === "undefined") {
			revealNow();
			return () => window.removeEventListener("scroll", onScroll);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				let index = 0;
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const target = entry.target;
					// Stagger by 60ms per index within the batch that just entered.
					window.setTimeout(
						() => target.classList.add("in"),
						index * 60,
					);
					index += 1;
					observer.unobserve(target);
				});
			},
			{ threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
		);

		const observeAll = () => {
			const pending = document.querySelectorAll(".reveal:not(.in)");
			pending.forEach((el) => observer.observe(el));
			// Anything already on screen at observe-time fires immediately; content
			// that mounts later (pagination, client-side filters) is picked up below.
			if (pending.length === 0) return;
		};

		observeAll();

		// Newly rendered nodes (e.g. "Load more" cards) also need observing.
		let frame = 0;
		const mutationObserver = new MutationObserver(() => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(observeAll);
		});
		mutationObserver.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.cancelAnimationFrame(frame);
			mutationObserver.disconnect();
			observer.disconnect();
		};
	}, [pathname]);

	return null;
}
