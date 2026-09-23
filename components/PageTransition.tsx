"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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
 * Per-route content transition (plan §1).
 *
 * AnimatePresence keyed on the pathname: the outgoing page slides up
 * and fades (0.3s), the incoming page slides in from below (0.4s).
 * `mode="wait"` guarantees only one page animates at a time.
 * `MotionConfig reducedMotion="user"` in Providers degrades every
 * transform to a simple opacity fade for reduced-motion users.
 */
export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				variants={variants}
				initial="initial"
				animate="enter"
				exit="exit"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
