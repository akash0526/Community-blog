"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
	text: string;
	className?: string;
	delay?: number;
}

const container: Variants = {
	// No opacity here: the block is visible from first paint (LCP
	// safe) and only the words animate.
	hidden: {},
	visible: (delay: number) => ({
		transition: {
			staggerChildren: 0.12,
			delayChildren: delay,
		},
	}),
};

// Transform-only word reveal: words start 24px low and spring into
// place. Starting at opacity 0 would hide the heading until the
// animation finishes — on a first-paint heading (LCP element) that
// directly delays LCP by the full reveal duration.
const word: Variants = {
	hidden: { y: 24 },
	visible: {
		y: 0,
		transition: {
			type: "spring",
			damping: 12,
			stiffness: 100,
		},
	},
};

/**
 * Word-by-word spring reveal (plan §3), LCP-tuned — see the variant
 * comments: fully visible from first paint, transform-only.
 */
export function TextReveal({
	text,
	className = "",
	delay = 0,
}: TextRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const words = text.split(" ");

	return (
		<motion.div
			ref={ref}
			variants={container}
			custom={delay}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			className={className}
		>
			{words.map((w, index) => (
				<motion.span
					key={`${w}-${index}`}
					variants={word}
					className="mr-[0.25em] inline-block"
				>
					{w}
				</motion.span>
			))}
		</motion.div>
	);
}
