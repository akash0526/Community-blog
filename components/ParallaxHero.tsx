"use client";

import {
	motion,
	useScroll,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ParallaxHeroProps {
	children: ReactNode;
	/** Orbs drift behind the content; pass false to render none. */
	background?: boolean;
	className?: string;
}

/** Drift paths for the five ambient orbs. Fixed (deterministic) values
 *  — the plan's Math.random() would be an impure render and would also
 *  differ between SSR and the first client render; a hand-tuned set
 *  reads the same and is stable across renders/hydration. */
const ORB_DRIFTS: { x: number; y: number }[] = [
	{ x: 120, y: -80 },
	{ x: -140, y: 90 },
	{ x: 80, y: 140 },
	{ x: -90, y: -120 },
	{ x: 150, y: 60 },
];

/**
 * Full-viewport parallax hero (plan §5) — five ambient gradient orbs
 * drifting on their own loops, a background layer that translates down
 * (0% → 50%) and fades as you scroll, and content that recedes
 * (scale 1 → 0.8, opacity 1 → 0) while scrolling away.
 *
 * The scroll transforms all derive from one useScroll() on the hero
 * element, offset start→end, so everything is in sync.
 */
export function ParallaxHero({
	children,
	background = true,
	className = "",
}: ParallaxHeroProps) {
	const ref = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	const bgY: MotionValue<string> = useTransform(
		scrollYProgress,
		[0, 1],
		["0%", "50%"],
	);
	const bgOpacity: MotionValue<number> = useTransform(
		scrollYProgress,
		[0, 1],
		[1, 0.4],
	);
	const contentY: MotionValue<string> = useTransform(
		scrollYProgress,
		[0, 1],
		["0%", "20%"],
	);
	const contentScale: MotionValue<number> = useTransform(
		scrollYProgress,
		[0, 1],
		[1, 0.8],
	);
	const contentOpacity: MotionValue<number> = useTransform(
		scrollYProgress,
		[0, 1],
		[1, 0],
	);

	return (
		<section
			ref={ref}
			className={`relative flex min-h-screen items-center overflow-hidden ${className}`}
		>
			{background && (
				<motion.div
					aria-hidden="true"
					style={{ y: bgY, opacity: bgOpacity }}
					className="absolute inset-0"
				>
					{ORB_DRIFTS.map((d, i) => (
						<motion.div
							key={i}
							animate={{
								x: [0, d.x, 0],
								y: [0, d.y, 0],
								opacity: [0.4, 0.8, 0.4],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 10 + i * 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className={`absolute ${
								i % 2 === 0
									? "bg-purple-600/30"
									: "bg-blue-600/30"
							} rounded-full blur-3xl`}
							style={{
								width: 200 + i * 100,
								height: 200 + i * 100,
								top: `${(i * 17) % 80}%`,
								left: `${(i * 23) % 80}%`,
							}}
						/>
					))}
				</motion.div>
			)}

			<motion.div
				style={{
					y: contentY,
					scale: contentScale,
					opacity: contentOpacity,
				}}
				className="relative z-10"
			>
				{children}
			</motion.div>
		</section>
	);
}
