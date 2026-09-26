"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useHasHydrated } from "@/hooks/useHasHydrated";


/**
 * Animated theme toggle (plan §3).
 *
 * Uses `resolvedTheme` rather than `theme` so the toggle works correctly
 * while the site is in "system" mode (theme can then be the string
 * "system", which a naive `theme === "dark"` check mishandles).
 */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useHasHydrated();

	// Avoid hydration mismatch: the icon depends on the resolved theme,
	// which only exists on the client. Reserve the 44px slot with an
	// invisible placeholder instead of unmounting — appearing after
	// hydration would shift the neighbouring auth buttons (CLS).
	if (!mounted) {
		return <span aria-hidden="true" className="block h-11 w-11" />;
	}

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="glass group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:glass-strong"
			aria-label="Toggle theme"
		>
			{/* Animated background */}
			<motion.div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
				animate={{
					scale: isDark ? 1 : 0,
					opacity: isDark ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
			/>

			<AnimatePresence mode="wait">
				{isDark ? (
					<motion.div
						key="moon"
						initial={{ rotate: -90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: 90, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Moon className="h-5 w-5 text-purple-400" />
					</motion.div>
				) : (
					<motion.div
						key="sun"
						initial={{ rotate: 90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: -90, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Sun className="h-5 w-5 text-yellow-400" />
					</motion.div>
				)}
			</AnimatePresence>
		</button>
	);
}
