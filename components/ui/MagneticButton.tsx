"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";

interface MagneticButtonProps {
	children: ReactNode;
	/** How strongly the button follows the cursor (0–1). */
	strength?: number;
	className?: string;
	onClick?: () => void;
	ariaLabel?: string;
}

/**
 * Magnetic hover (plan §7) — the button springs toward the cursor with
 * `strength * 15px` max offset and springs back on mouse leave.
 */
export function MagneticButton({
	children,
	strength = 0.3,
	className = "",
	onClick,
	ariaLabel,
}: MagneticButtonProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springX = useSpring(x, {
		stiffness: 150,
		damping: 15,
		restDelta: 0.001,
	});
	const springY = useSpring(y, {
		stiffness: 150,
		damping: 15,
		restDelta: 0.001,
	});

	function handleMouseMove(event: React.MouseEvent) {
		const bounds = event.currentTarget.getBoundingClientRect();
		const centerX = bounds.left + bounds.width / 2;
		const centerY = bounds.top + bounds.height / 2;
		x.set((event.clientX - centerX) * strength);
		y.set((event.clientY - centerY) * strength);
	}

	function handleMouseLeave() {
		x.set(0);
		y.set(0);
	}

	return (
		<motion.button
			style={{ x: springX, y: springY }}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={className}
			onClick={onClick}
			aria-label={ariaLabel}
		>
			{children}
		</motion.button>
	);
}
