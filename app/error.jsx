"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

/**
 * Route error boundary.
 *
 * Rendered *inside* the root layout, so it must not render <html>/<body>
 * (the previous version did, which nested a document in the page). Keep it
 * small, useful and quiet.
 */
export default function ErrorBoundary({ error, reset }) {
	return (
		<div className="flex flex-1 items-center justify-center px-6 py-24">
			<div className="max-w-lg text-center">
				<span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--sunken)] text-[var(--ink-muted)]">
					<AlertTriangle size={22} aria-hidden="true" />
				</span>

				<h1 className="text-2xl sm:text-3xl">Something went wrong</h1>

				<p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
					This page could not be loaded. Try again — if it keeps failing,
					the story may need a look from the editorial team.
				</p>

				<div className="mt-7 flex flex-wrap justify-center gap-2.5">
					<button type="button" onClick={() => reset()} className="btn btn--primary">
						<RotateCcw size={15} aria-hidden="true" />
						Try again
					</button>
					<Link href="/" className="btn btn--ghost">
						<Home size={15} aria-hidden="true" />
						Back home
					</Link>
				</div>

				{error?.message ? (
					<details className="mx-auto mt-10 max-w-md text-left">
						<summary className="cursor-pointer text-xs font-medium text-[var(--ink-faint)] hover:text-[var(--ink-muted)]">
							Technical details
						</summary>
						<pre className="mt-3 overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--hairline)] bg-[var(--sunken)] p-3 text-xs text-[var(--ink-muted)]">
							{error.message}
						</pre>
					</details>
				) : null}
			</div>
		</div>
	);
}
