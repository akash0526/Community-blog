import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export const metadata = {
	title: "Page not found",
	description: "The page you are looking for does not exist on Apex.",
	robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
	return (
		<div className="flex flex-1 items-center px-6 py-24">
			<div className="mx-auto max-w-xl text-center">
				<p className="font-display text-[clamp(3.5rem,10vw,5.5rem)] font-semibold leading-none tracking-tight text-[var(--accent)]">
					404
				</p>
				<h1 className="mt-4 text-2xl sm:text-3xl">This page wandered off.</h1>
				<p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
					The link may be broken, or the story may have moved. The archive is
					the fastest way back.
				</p>
				<div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
					<Link href="/" className="btn btn--primary">
						<ArrowLeft size={15} aria-hidden="true" />
						Back home
					</Link>
					<Link href="/blog" className="btn btn--ghost">
						<Search size={15} aria-hidden="true" />
						Browse all stories
					</Link>
				</div>
			</div>
		</div>
	);
}
