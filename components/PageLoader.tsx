"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Page-load curtain (plan §1) — a full-screen gradient veil with the
 * pulsing APEX wordmark and three bouncing dots that covers each route
 * change for ~800ms, then sweeps away from the top.
 *
 * Hydration note: the curtain starts hidden (matching SSR) and only
 * appears on client-side route changes — the first paint never waits
 * behind a veil (LCP-friendly). z-50 sits above page content but under
 * the sticky glass navbar (z-100), so the frosted header stays visible
 * over the veil, as the plan intends.
 */
export function PageLoader() {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();
	const isFirstRender = useRef(true);

	useEffect(() => {
		// Skip the curtain on the very first mount (initial page load).
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 800);

		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					key="page-loader"
					initial={{ y: "0%" }}
					animate={{ y: "0%" }}
					exit={{ y: "0%" }}
					className="fixed inset-0 z-50 overflow-hidden"
				>
					<motion.div
						initial={{ scaleY: 0, originY: 1 }}
						animate={{ scaleY: 1, originY: 0 }}
						exit={{ scaleY: 0, originY: 0 }}
						transition={{
							duration: 0.5,
							ease: [0.21, 0.47, 0.32, 0.98],
						}}
						className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c0a1d] via-[#1a0f35] to-[#0f172a]"
					>
						<div className="flex flex-col items-center gap-4">
							<motion.span
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{
									duration: 0.5,
									ease: [0.21, 0.47, 0.32, 0.98],
								}}
								className="gradient-text text-5xl font-black tracking-[0.4em]"
							>
								APEX
							</motion.span>
							<div className="flex gap-2">
								{[0, 1, 2].map((dot) => (
									<motion.span
										key={dot}
										animate={{
											y: [0, -8, 0],
											opacity: [0.5, 1, 0.5],
										}}
										transition={{
											duration: 1,
											delay: dot * 0.2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="h-2 w-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
									/>
								))}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
