"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Closing call-to-action (plan §12) — word-revealed headline over a
 * gradient glass panel with a magnetic primary button. The button
 * routes to the real "/write-for-us" page (the plan's "#" placeholder
 * had no destination on this site).
 */
export function CTASection() {
	const router = useRouter();

	return (
		<section className="relative py-16 md:py-24">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<GlassCard className="relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-12 md:py-20">
					<motion.div
						aria-hidden="true"
						whileInView={{
							y: [0, -30, 0],
							opacity: [0.4, 0.7, 0.4],
						}}
						viewport={{ once: false, amount: 0.2 }}
						transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
						className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]"
					/>
					<motion.div
						aria-hidden="true"
						whileInView={{
							y: [0, 30, 0],
							opacity: [0.3, 0.6, 0.3],
						}}
						viewport={{ once: false, amount: 0.2 }}
						transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
						className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]"
					/>

					<div className="relative z-10">
						<FadeIn>
							<span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
								<Sparkles className="h-3.5 w-3.5 text-purple-400" />
								Ready to build?
							</span>
						</FadeIn>

						<h2 className="mt-6">
							<TextReveal
								text="Ready to Get Started?"
								className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
							/>
						</h2>

						<FadeIn delay={0.3}>
							<p className="mx-auto mt-4 max-w-xl text-lg text-muted">
								Join the fastest-growing tech community in
								Nepal — share a guide, flag a stale pick, or
								just keep exploring. It&rsquo;s free.
							</p>
						</FadeIn>

						<FadeIn delay={0.5}>
							<div className="mt-8 flex justify-center">
								<MagneticButton
									className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-shadow hover:shadow-xl hover:shadow-purple-500/40"
									onClick={() => router.push("/write-for-us")}
									ariaLabel="Write for us"
								>
									<span className="flex items-center gap-2">
										Write for us
										<ArrowRight className="h-5 w-5" />
									</span>
								</MagneticButton>
							</div>
						</FadeIn>
					</div>
				</GlassCard>
			</div>
		</section>
	);
}
