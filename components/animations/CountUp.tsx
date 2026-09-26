"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
	end: number;
	/** Seconds for the full count. */
	duration?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
}

/**
 * Animated number counter (plan §10) — starts when scrolled into view,
 * runs exactly once, and always lands on the exact value (no drift).
 */
export function CountUp({
	end,
	duration = 2,
	suffix = "",
	prefix = "",
	className = "",
}: CountUpProps) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true });

	useEffect(() => {
		if (!isInView) return;

		let startTime: number | undefined;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (startTime === undefined) startTime = timestamp;
			const progress = Math.min(
				(timestamp - startTime) / (duration * 1000),
				1,
			);

			// Ease-out so the count decelerates into the final value.
			const eased = 1 - Math.pow(1 - progress, 3);

			setCount(Math.round(end * eased));
			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(animationFrame);
	}, [end, duration, isInView]);

	return (
		<span ref={ref} className={className}>
			{prefix}
			{count.toLocaleString()}
			{suffix}
		</span>
	);
}
