"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxSectionProps {
	children: ReactNode;
	/** 0.5 = the section drifts 50px against the scroll direction. */
	speed?: number;
	className?: string;
}

/**
 * Parallax drift (plan §2) — the inner content moves at a fraction of
 * scroll speed while the section occupies normal layout space.
 */
export function ParallaxSection({
	children,
	speed = 0.5,
	className = "",
}: ParallaxSectionProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

	return (
		<div ref={ref} className={className}>
			<motion.div style={{ y }}>{children}</motion.div>
		</div>
	);
}
