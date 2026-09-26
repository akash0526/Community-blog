import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-triggered animation hook (plan §2).
 *
 * Returns a ref to attach to any element plus an `isInView` flag that
 * flips once when the element scrolls into the viewport (`once: true`
 * — elements never re-animate, per the plan's performance notes).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);
	const isInView = useInView(ref, {
		once: true,
		margin: "-100px",
	});

	return { ref, isInView };
}
