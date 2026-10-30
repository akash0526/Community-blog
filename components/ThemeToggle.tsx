"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useHasHydrated } from "@/hooks/useHasHydrated";

/**
 * Theme toggle. CSS-only transition (no framer-motion) so the control
 * costs nothing beyond the two icons.
 *
 * Uses `resolvedTheme` rather than `theme` so the toggle is correct while
 * the site follows the system setting (where `theme` is the string
 * "system" and a naive `theme === "dark"` check mislabels).
 */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useHasHydrated();

	// Reserve the slot before hydration so the header never shifts (CLS).
	if (!mounted) {
		return <span aria-hidden="true" className="block h-[38px] w-[38px]" />;
	}

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="icon-btn"
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			title={isDark ? "Light theme" : "Dark theme"}
		>
			{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
		</button>
	);
}
