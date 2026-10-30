import Link from "next/link";
import { ArrowRight, Pen } from "lucide-react";

/**
 * Closing call to action — one bordered band, two clear next steps.
 * Real links (not router.push handlers) so they are prefetched,
 * middle-clickable and keyboard-native.
 */
export function CTASection() {
	return (
		<section className="section">
			<div className="wrap">
				<div className="glass flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
					<div className="max-w-xl">
						<h2 className="text-[clamp(1.5rem,2.6vw,2rem)]">
							Know a tool that works from Nepal?
						</h2>
						<p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
							Publish a guide, correct a stale pick, or add the resource you
							wish you had found first. Publishing is open to everyone and
							takes about ten minutes.
						</p>
					</div>

					<div className="flex flex-wrap gap-2.5">
						<Link href="/write-for-us" className="btn btn--primary">
							<Pen size={15} aria-hidden="true" />
							Write for us
						</Link>
						<Link href="/studio" className="btn btn--ghost">
							Open the studio
							<ArrowRight className="arrow" aria-hidden="true" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
