"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function BlogArticleError({ error, reset }) {
	return (
		<div className="flex flex-1 items-start px-6 py-24">
			<div className="mx-auto max-w-xl text-center">
				<span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--sunken)] text-[var(--ink-muted)]">
					<AlertCircle size={22} aria-hidden="true" />
				</span>

				<h1 className="text-2xl sm:text-3xl">This story didn&rsquo;t load</h1>

				<p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
					It might be a temporary network issue. Try again, or head back to
					the archive.
				</p>

				<div className="mt-7 flex flex-wrap justify-center gap-2.5">
					<button type="button" onClick={() => reset()} className="btn btn--primary">
						<RotateCcw size={15} aria-hidden="true" />
						Try again
					</button>
					<Link href="/blog" className="btn btn--ghost">
						<ArrowLeft size={15} aria-hidden="true" />
						Back to the archive
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
