"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface SplitTextProps {
	text: string;
	className?: string;
	delay?: number;
}

const container: Variants = {
	hidden: { opacity: 0 },
	visible: (delay: number) => ({
		opacity: 1,
		transition: {
			staggerChildren: 0.03,
			delayChildren: delay,
		},
	}),
};

const letter: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
		rotateX: -90,
	},
	visible: {
		opacity: 1,
		y: 0,
		rotateX: 0,
		transition: {
			duration: 0.4,
		},
	},
};

/**
 * Letter-by-letter 3D flip reveal (plan §3). Each letter flips up from
 * -90° with a 30ms stagger; spaces render as non-breaking spaces so the
 * inline-block letters keep their gaps.
 */
export function SplitText({
	text,
	className = "",
	delay = 0,
}: SplitTextProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true });

	const letters = Array.from(text);

	return (
		<motion.div
			ref={ref}
			variants={container}
			custom={delay}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			className={className}
			style={{ perspective: "1000px" }}
		>
			{letters.map((char, index) => (
				<motion.span
					key={`${char}-${index}`}
					variants={letter}
					className="inline-block"
					style={{ transformOrigin: "50% 50% -50px" }}
				>
					{char === " " ? "\u00A0" : char}
				</motion.span>
			))}
		</motion.div>
	);
}
