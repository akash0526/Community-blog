import Link from "next/link";
import { ArrowLeft, FileQuestion, Pen } from "lucide-react";

export default function BlogArticleNotFound() {
	return (
		<div className="flex flex-1 items-start px-6 py-24">
			<div className="mx-auto max-w-xl text-center">
				<span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--sunken)] text-[var(--ink-muted)]">
					<FileQuestion size={22} aria-hidden="true" />
				</span>

				<h1 className="text-2xl sm:text-3xl">This story isn&rsquo;t here</h1>

				<p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-muted)]">
					It doesn&rsquo;t exist, or the author removed it. Want to be the
					first to write about this topic?
				</p>

				<div className="mt-7 flex flex-wrap justify-center gap-2.5">
					<Link href="/studio" className="btn btn--primary">
						<Pen size={15} aria-hidden="true" />
						Write your story
					</Link>
					<Link href="/blog" className="btn btn--ghost">
						<ArrowLeft size={15} aria-hidden="true" />
						Back to the archive
					</Link>
				</div>
			</div>
		</div>
	);
}
