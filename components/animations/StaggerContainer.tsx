"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface StaggerContainerProps {
	children: ReactNode;
	staggerDelay?: number;
	className?: string;
}

const containerVariants: Variants = {
	hidden: { opacity: 1 },
	visible: (stagger: number) => ({
		opacity: 1,
		transition: {
			staggerChildren: stagger,
			delayChildren: 0.2,
		},
	}),
};

/**
 * Stagger parent (plan §2). Children should be wrapped in
 * <StaggerItem/>; each one animates in with an offset once the
 * container scrolls into view.
 *
 * (The container itself stays at opacity 1 — only the children
 * stagger — so content is never hidden if a child fails to mount.)
 */
export function StaggerContainer({
	children,
	staggerDelay = 0.1,
	className = "",
}: StaggerContainerProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			custom={staggerDelay}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			className={className}
		>
			{children}
		</motion.div>
	);
}
