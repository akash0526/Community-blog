"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScaleInProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

/** Scale-up reveal on scroll (plan §2). */
export function ScaleIn({
	children,
	delay = 0,
	className = "",
}: ScaleInProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={
				isInView
					? {
							opacity: 1,
							scale: 1,
					  }
					: {}
			}
			transition={{
				duration: 0.6,
				delay,
				ease: [0.21, 0.47, 0.32, 0.98],
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
