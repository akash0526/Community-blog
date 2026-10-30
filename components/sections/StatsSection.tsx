export interface Stat {
	value: number;
	suffix?: string;
	label: string;
}

interface StatsSectionProps {
	stats: Stat[];
}

/**
 * Stats band — real numbers, server-rendered, no count-up animation.
 * Values are already in the HTML, so they read correctly before (and
 * without) hydration.
 */
export function StatsSection({ stats }: StatsSectionProps) {
	return (
		<section className="section">
			<div className="wrap">
				<div className="stats-band">
					{stats.map((stat) => (
						<div key={stat.label}>
							<span className="stat__n text-[2rem]">
								{stat.value}
								{stat.suffix ?? ""}
							</span>
							<span className="stat__l">{stat.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
