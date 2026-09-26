"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Client boundary for global providers.
 *
 * - MotionConfig: honour prefers-reduced-motion for every framer-motion
 *   animation on the site (transforms are disabled, not just sped up).
 * - ThemeProvider: next-themes, dark-first, writing `data-theme` (the
 *   attribute the whole CSS token system reads).
 */
export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MotionConfig reducedMotion="user">
			<ThemeProvider
				attribute="data-theme"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange={false}
			>
				{children}
			</ThemeProvider>
		</MotionConfig>
	);
}
