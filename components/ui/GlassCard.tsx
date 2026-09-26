import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
	children: ReactNode;
	className?: string;
	hover?: boolean;
	gradient?: boolean;
}

/**
 * Glassmorphism card (plan §1).
 *
 * - Base glass: backdrop blur + translucent white surface + hairline
 *   border (theme-aware via the --glass-* tokens in globals.css).
 * - `gradient`: wraps the card in a 1px purple→blue gradient ring
 *   (padding-box trick on the ::before layer).
 * - A near-invisible noise texture overlay keeps large glass surfaces
 *   from banding (public/noise.svg).
 */
export function GlassCard({
	children,
	className,
	hover = true,
	gradient = false,
}: GlassCardProps) {
	return (
		<div
			className={cn(
				// Base glass effect
				"relative backdrop-blur-md bg-white/5 border border-white/10",
				"rounded-2xl p-6 shadow-2xl",

				// Gradient border option
				gradient &&
					"before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-purple-500 before:to-blue-500",

				// Hover effects
				hover &&
					"transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-purple-500/20",

				className
			)}
		>
			{/* Noise texture overlay */}
			<div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.015] mix-blend-soft-light">
				<div className="h-full w-full bg-[url('/noise.svg')] bg-repeat" />
			</div>

			{children}
		</div>
	);
}
