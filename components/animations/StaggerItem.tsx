"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerItemProps {
	children: ReactNode;
	className?: string;
}

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.21, 0.47, 0.32, 0.98],
		},
	},
};

/** Stagger child (plan §2) — pair with <StaggerContainer/>. */
export function StaggerItem({ children, className = "" }: StaggerItemProps) {
	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}
