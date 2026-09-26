"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypeWriterProps {
	text: string;
	/** Seconds before typing starts. */
	delay?: number;
	/** Seconds per character. */
	speed?: number;
	className?: string;
}

/**
 * Typewriter effect with a blinking caret (plan §3).
 */
export function TypeWriter({
	text,
	delay = 0,
	speed = 0.05,
	className = "",
}: TypeWriterProps) {
	const [displayedText, setDisplayedText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (currentIndex >= text.length) return;
		const timeout = setTimeout(() => {
			setDisplayedText(text.substring(0, currentIndex + 1));
			setCurrentIndex((i) => i + 1);
		}, (delay + currentIndex * speed) * 1000);

		return () => clearTimeout(timeout);
	}, [currentIndex, text, delay, speed]);

	return (
		<div className={className}>
			{displayedText}
			<motion.span
				animate={{ opacity: [1, 0, 1] }}
				transition={{ duration: 0.8, repeat: Infinity }}
				className="ml-1 inline-block h-[1em] w-[2px] bg-current"
				aria-hidden="true"
			/>
		</div>
	);
}
