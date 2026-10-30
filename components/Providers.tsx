"use client";

import * as React from "react";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Client boundary for global providers.
 *
 * Only next-themes lives here. framer-motion used to be imported at this
 * level purely to configure `reducedMotion`, which pulled the whole
 * animation library into the bundle of every page — reduced motion is now
 * handled in CSS (globals.css §20), so the root bundle stays small.
 */
export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="data-theme"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange={false}
		>
			{children}
		</ThemeProvider>
	);
}
