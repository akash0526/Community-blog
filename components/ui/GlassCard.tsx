import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
	children: ReactNode;
	className?: string;
	/** Kept for API compatibility; hover is handled by the surface classes. */
	hover?: boolean;
	/** Kept for API compatibility; the gradient ring is retired. */
	gradient?: boolean;
}

/**
 * Generic surface card.
 *
 * This used to be a glassmorphism panel (`backdrop-filter: blur(24px)` plus
 * two translucent overlays and a noise texture). On long pages that cost a
 * repaint of the blurred region on every scroll frame, and it fought the
 * light theme. It is now the same flat surface used everywhere else —
 * call sites keep working unchanged.
 */
export function GlassCard({
	children,
	className,
	hover = true,
}: GlassCardProps) {
	return (
		<div
			className={cn(
				"relative rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--surface)]",
				hover &&
					"transition-colors duration-200 hover:border-[var(--hairline-strong)]",
				className,
			)}
		>
			{children}
		</div>
	);
}
