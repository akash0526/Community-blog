"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	Rocket,
	ShieldCheck,
	Users,
	Zap,
	type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { TextReveal } from "@/components/animations/TextReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface Feature {
	icon: LucideIcon;
	gradient: string;
	title: string;
	description: string;
}

const FEATURES: Feature[] = [
	{
		icon: Zap,
		gradient: "from-purple-500 to-blue-500",
		title: "Tested from Nepal",
		description:
			"Every tool is verified on Nepali internet — NTC, Ncell and WiMAX speeds, eSewa, Khalti and Payoneer. If it doesn't work here, we say so.",
	},
	{
		icon: Users,
		gradient: "from-blue-500 to-cyan-500",
		title: "Community Driven",
		description:
			"Built by Nepal's maker community and kept honest by it. Share your picks, flag stale picks, and watch real people use the tools.",
	},
	{
		icon: Rocket,
		gradient: "from-cyan-500 to-purple-500",
		title: "Fresh Weekly",
		description:
			"New guides, field tests and picks land every single week — written for Nepali internet speeds, prices and payment rails.",
	},
	{
		icon: ShieldCheck,
		gradient: "from-purple-500 to-pink-500",
		title: "Open & Honest",
		description:
			"Cited sources, public corrections, no affiliate surprises. When a pick changes, you can read exactly why it changed.",
	},
];

/**
 * "Why APEX" feature grid (plan §9) — parallax ambient blobs behind a
 * 4-up grid of glass cards, each with a gradient icon tile. Copy is
 * site-specific (not the plan's placeholder text).
 */
export function FeaturesSection() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24">
			<ParallaxBlobs />

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<FadeIn delay={0.1}>
						<span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
							<Zap className="h-3.5 w-3.5 text-purple-400" />
							Why APEX?
						</span>
					</FadeIn>
					<h2 className="mt-6">
						<TextReveal
							text="Built for Nepal's tech community"
							className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl"
						/>
					</h2>
					<FadeIn delay={0.3}>
						<p className="mx-auto mt-4 max-w-2xl text-muted">
							The tools, guides and community you need to build —
							tested where you actually are.
						</p>
					</FadeIn>
				</div>

				<StaggerContainer
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
					staggerDelay={0.15}
				>
					{FEATURES.map((feature) => (
						<StaggerItem key={feature.title}>
							<FeatureCard feature={feature} />
						</StaggerItem>
					))}
				</StaggerContainer>
			</div>
		</section>
	);
}

function FeatureCard({ feature }: { feature: Feature }) {
	const Icon = feature.icon;

	return (
		<GlassCard className="group h-full rounded-2xl p-6">
			<motion.div
				whileHover={{ scale: 1.1, rotate: 5 }}
				transition={{ type: "spring", stiffness: 300, damping: 15 }}
				className={cn(
					"flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
					feature.gradient,
				)}
			>
				<Icon className="h-6 w-6 text-white" />
			</motion.div>
			<h3 className="mt-4 text-xl font-semibold tracking-tight">
				{feature.title}
			</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted">
				{feature.description}
			</p>
			<div className="mt-4 flex items-center gap-1 text-sm font-medium text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				Learn more
				<ArrowRight className="h-3.5 w-3.5" />
			</div>
		</GlassCard>
	);
}

/** Two large blurred orbs that drift at different scroll speeds (plan §9).
 *  `whileInView` (once: false) so the blur filters stop rendering entirely
 *  when the section is off-screen — constant blur re-paints are the main
 *  GPU cost of these decorations. */
function ParallaxBlobs() {
	return (
		<div aria-hidden="true" className="absolute inset-0">
			<motion.div
				aria-hidden="true"
				whileInView={{ y: [0, -40, 0], x: [0, 20, 0] }}
				viewport={{ once: false, amount: 0.2 }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
				className="absolute left-[10%] top-[20%] h-[320px] w-[320px] rounded-full bg-purple-500/20 blur-[90px]"
			/>
			<motion.div
				aria-hidden="true"
				whileInView={{ y: [0, 40, 0], x: [0, -20, 0] }}
				viewport={{ once: false, amount: 0.2 }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
				className="absolute right-[10%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[80px]"
			/>
		</div>
	);
}
