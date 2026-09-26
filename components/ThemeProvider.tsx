"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * Theme provider wrapper (plan §3).
 *
 * The site drives its light/dark token swap from `<html data-theme="…">`
 * (see globals.css), so we tell next-themes to write `data-theme` instead
 * of a `dark` class. The inline bootstrap in app/layout.tsx paints the
 * attribute before first paint (no flash); next-themes then owns the
 * state and persists the choice under localStorage "theme".
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
