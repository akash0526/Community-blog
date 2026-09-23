"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { CountUp } from "@/components/animations/CountUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

export interface Stat {
	value: number;
	suffix?: string;
	label: string;
}

interface StatsSectionProps {
	stats: Stat[];
}

/**
 * Animated stats band (plan §11) — a glass-strong rounded-3xl panel
 * with a soft gradient wash; each stat counts up once on scroll
 * (values are passed in from the page, so they stay real site data —
 * not the plan's placeholder numbers).
 */
export function StatsSection({ stats }: StatsSectionProps) {
	return (
		<section className="relative py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 p-[1px]">
					<div className="glass-strong rounded-3xl px-6 py-12 md:px-12 md:py-16">
						<div className="mx-auto mb-10 max-w-2xl text-center">
							<FadeIn>
								<span className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
									Community in numbers
								</span>
							</FadeIn>
							<FadeIn delay={0.1}>
								<h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
									Growing fast across Nepal
								</h2>
							</FadeIn>
						</div>

						<StaggerContainer
							className="grid grid-cols-2 gap-8 md:grid-cols-4"
							staggerDelay={0.1}
						>
							{stats.map((stat) => (
								<StaggerItem key={stat.label}>
									<div className="text-center">
										<div className="gradient-text text-5xl font-black tracking-tight md:text-6xl">
											<CountUp
												end={stat.value}
												suffix={stat.suffix ?? ""}
											/>
										</div>
										<div className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-muted md:text-base">
											{stat.label}
										</div>
									</div>
								</StaggerItem>
							))}
						</StaggerContainer>
					</div>
				</div>
			</div>
		</section>
	);
}
