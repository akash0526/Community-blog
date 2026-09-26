"use client";

import {
	motion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";

/**
 * Reading-progress indicator (plan §6) — a gradient bar under the
 * sticky header plus a circular percentage dial in the bottom-right.
 *
 * z-[110] (one above the sticky glass navbar's z-100) so the bar rides
 * along the top of the viewport above the header — the plan's z-50
 * would sit underneath it. The % dial reuses the same spring via
 * useTransform (MotionValue children), so the number tracks the bar
 * exactly.
 */
export function ScrollProgress() {
	const { scrollYProgress } = useScroll();

	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const percent = useTransform(scrollYProgress, (latest) =>
		`${Math.round(latest * 100)}%`,
	);

	const R = 20;
	const CIRC = 2 * Math.PI * R;

	return (
		<>
			<motion.div
				style={{ scaleX, opacity: scaleX }}
				className="fixed left-0 right-0 top-0 z-[110] h-[3px] origin-left bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"
			/>

			<motion.div
				style={{ opacity: scaleX }}
				className="fixed bottom-6 right-6 z-[110] h-14 w-14 rounded-full bg-white/10 shadow-lg backdrop-blur-md"
			>
				<svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
					<circle
						cx="24"
						cy="24"
						r={R}
						stroke="currentColor"
						strokeWidth="4"
						fill="transparent"
						className="stroke-white/20"
					/>
					<motion.circle
						cx="24"
						cy="24"
						r={R}
						stroke="url(#scroll-progress-gradient)"
						strokeWidth="4"
						fill="transparent"
						strokeLinecap="round"
						pathLength={scrollYProgress}
						strokeDasharray={CIRC}
						strokeDashoffset={0}
					/>
					<defs>
						<linearGradient
							id="scroll-progress-gradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#8b5cf6" />
							<stop offset="100%" stopColor="#3b82f6" />
						</linearGradient>
					</defs>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
					<motion.span>{percent}</motion.span>
				</div>
			</motion.div>
		</>
	);
}
