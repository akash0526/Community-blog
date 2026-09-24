"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useHasHydrated } from "@/hooks/useHasHydrated";

interface PageTransitionProps {
	children: ReactNode;
}

const variants: Variants = {
	initial: { opacity: 0, y: 20 },
	enter: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.21, 0.47, 0.32, 0.98],
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: 0.3,
			ease: [0.21, 0.47, 0.32, 0.98],
		},
	},
};

/**
 * Per-route content transition (plan §1) — LCP-tuned.
 *
 * On the initial page load the wrapper renders fully visible
 * (`initial={false}` while `useHasHydrated()` is still false), so the
 * LCP element paints on the very first frame instead of waiting out a
 * 0.4s opacity ramp. From the first client-side navigation on, the
 * outgoing page slides up and fades (0.3s) and the incoming page
 * slides in from below (0.4s). `mode="wait"` keeps one page animating
 * at a time; `MotionConfig reducedMotion="user"` degrades transforms
 * to opacity fades for reduced-motion users.
 */
export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();
	const hydrated = useHasHydrated();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				variants={variants}
				initial={hydrated ? "initial" : false}
				animate="enter"
				exit="exit"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
