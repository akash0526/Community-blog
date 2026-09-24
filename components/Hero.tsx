"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface HeroProps {
	resources: number;
	guides: number;
	categories: number;
}

/**
 * Glassmorphism hero (plan §5).
 *
 * Server-rendered shell: the stats come from the data layer (resource
 * directory + published article count) so the numbers are real, and the
 * photo/floating cards reuse the existing public/ assets. framer-motion
 * drives the ambient orbs and the floating cards; MotionConfig
 * (reducedMotion="user") disables the motion for users who ask.
 */
export default function Hero({ resources, guides, categories }: HeroProps) {
	const stats = [
		{ value: `${resources}+`, label: "Resources" },
		{ value: `${guides}+`, label: "Blog Posts" },
		{ value: `${categories}`, label: "Categories" },
	];

	// Parallax (plan §5): the orb field drifts down (0% → 50%) and
	// fades while the content recedes (y 0 → 20%, scale 1 → 0.8,
	// opacity 1 → 0) as the hero scrolls away. All transforms derive
	// from one useScroll() on the section.
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});
	const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
	const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
	const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
	const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
	const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

	return (
		<section ref={ref} className="relative overflow-hidden">
		{/* Animated Background Orbs */}
		<motion.div
			style={{ y: bgY, opacity: bgOpacity }}
			className="pointer-events-none absolute inset-0"
			aria-hidden="true"
		>
			<motion.div
				whileInView={{
					scale: [1, 1.2, 1],
					x: [0, 100, 0],
					y: [0, -100, 0],
				}}
				viewport={{ once: false, amount: 0.1 }}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
			/>

			<motion.div
				whileInView={{
					scale: [1, 1.3, 1],
					x: [0, -100, 0],
					y: [0, 100, 0],
				}}
				viewport={{ once: false, amount: 0.1 }}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
			/>
			</motion.div>

			{/* Hero Content */}
			<motion.div
				style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
				className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8"
			>
				<div className="grid min-h-[calc(100vh-14rem)] items-center gap-12 lg:grid-cols-2">
					{/* Left Column */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-8"
					>
						{/* Badge */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
								<Sparkles size={16} className="text-purple-400" />
								<span>Welcome to Apex Nepal</span>
							</span>
						</motion.div>

						{/* Heading */}
						<div className="space-y-4">
							<h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
								Build Your
								<span className="gradient-text block">
									Digital Future
								</span>
							</h1>

							<p className="text-xl leading-relaxed text-[var(--ink-muted)]">
								Join Nepal&rsquo;s fastest-growing tech community.
								Share knowledge, collaborate on projects, and grow
								together.
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/resources"
									className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 font-medium text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-purple-500/50"
								>
									Get Started
									<ArrowRight
										size={20}
										className="transition-transform group-hover:translate-x-1"
									/>
								</Link>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/about"
									className="glass rounded-full px-8 py-4 font-medium transition-all hover:glass-strong"
								>
									Learn More
								</Link>
							</motion.div>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-6 pt-8">
							{stats.map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 + index * 0.1 }}
									className="text-center"
								>
									<div className="gradient-text font-display text-3xl font-bold">
										{stat.value}
									</div>
									<div className="mt-1 text-sm text-[var(--ink-muted)]">
										{stat.label}
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Right Column - Floating Cards */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="relative hidden lg:block"
					>
						{/* Main Card */}
						<motion.div
							animate={{ y: [0, -10, 0] }}
							transition={{
								duration: 6,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<GlassCard gradient className="p-6 xl:p-8">
								<div className="relative aspect-square overflow-hidden rounded-xl">
									<Image
										src="/redesign/hero-builder.jpg"
										alt="A Nepali developer writing code on a laptop at a wooden table in a brick-and-timber Kathmandu cafe"
										fill
										sizes="(min-width: 1280px) 40vw, 0px"
										className="object-cover object-[70%_50%]"
										priority
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
								</div>
								<div className="mt-6 space-y-2">
									<h3 className="text-xl font-bold">Latest in Tech</h3>
									<p className="text-[var(--ink-muted)]">
										Discover cutting-edge articles and tutorials
									</p>
								</div>
							</GlassCard>
						</motion.div>

						{/* Floating Card 1 */}
						<motion.div
							animate={{
								y: [0, -15, 0],
								rotate: [0, 2, 0],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute -right-8 -top-8 w-48"
						>
							<GlassCard className="p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
										<ShieldCheck size={20} className="text-white" />
									</div>
									<div>
										<div className="text-sm font-medium">
											Verified picks
										</div>
										<div className="text-xs text-[var(--ink-muted)]">
											Tested from Nepal
										</div>
									</div>
								</div>
							</GlassCard>
						</motion.div>

						{/* Floating Card 2 */}
						<motion.div
							animate={{
								y: [0, 10, 0],
								rotate: [0, -2, 0],
							}}
							transition={{
								duration: 7,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute -bottom-8 -left-8 w-56"
						>
							<GlassCard className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<div className="gradient-text font-display text-2xl font-bold">
											{guides}+
										</div>
										<div className="text-sm text-[var(--ink-muted)]">
											Guides and growing
										</div>
									</div>
									<div className="text-3xl" aria-hidden="true">
										📝
									</div>
								</div>
							</GlassCard>
						</motion.div>
					</motion.div>
				</div>
			</motion.div>

			{/* Scroll indicator (plan §5) — fades out as you start scrolling */}
			<motion.div
				style={{ opacity: indicatorOpacity }}
				className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block"
				aria-hidden="true"
			>
				<div className="flex flex-col items-center gap-1.5">
					<span className="text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-[var(--ink-muted)]">
						Scroll to explore
					</span>
					<motion.span
						animate={{ y: [0, 8, 0] }}
						transition={{
							duration: 1.8,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<ArrowDown size={18} className="text-purple-400" />
					</motion.span>
				</div>
			</motion.div>
		</section>
	);
}
