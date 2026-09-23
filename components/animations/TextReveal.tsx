"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
	text: string;
	className?: string;
	delay?: number;
}

const container: Variants = {
	hidden: { opacity: 0 },
	visible: (delay: number) => ({
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: delay,
		},
	}),
};

const word: Variants = {
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			damping: 12,
			stiffness: 100,
		},
	},
	hidden: {
		opacity: 0,
		y: 20,
	},
};

/**
 * Word-by-word spring reveal (plan §3). Words rise into place with a
 * 120ms stagger once the block scrolls into view.
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
