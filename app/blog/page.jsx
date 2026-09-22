import Link from "next/link";
import { getPaginatedArticles, SITE_URL } from "@/lib/articles";
import { cleanExcerpt } from "@/lib/seoUtils";

export const revalidate = 60;

export const metadata = {
	title: "All stories",
	description:
		"Browse every published story on Apex — tested guides, personal essays, and community reporting, newest first.",
	alternates: { canonical: "/blog" },
	openGraph: {
		title: "All stories | Apex",
		description:
			"Browse every published story on Apex — tested guides, personal essays, and community reporting.",
		url: `${SITE_URL}/blog`,
		type: "website",
	},
};

const ARCHIVE_SIZE = 100;

export default async function BlogArchivePage() {
	const articles = await getPaginatedArticles(ARCHIVE_SIZE, 0);

	return (
		<div className="flex-1">
			<section className="hero" style={{ paddingBottom: "3rem" }}>
				<div className="wrap" style={{ maxWidth: "760px" }}>
					<p className="eyebrow">
						<span className="num">01</span> Archive
					</p>
					<h1>All stories</h1>
					<p className="lede" style={{ marginTop: "1.25rem" }}>
						Every published story on Apex, newest first.{" "}
						<Link href="/resources" className="link">
							Or browse the tools directory
						</Link>
						.
					</p>
				</div>
			</section>
			<div className="wrap pb-24" style={{ maxWidth: "760px" }}>
				{articles.length === 0 ? (
					<div className="card !p-10">
						<h2 className="!text-[1.25rem]">No stories yet</h2>
						<p className="mt-2 text-[var(--ink-muted)]">Check back soon.</p>
					</div>
				) : (
					<ol className="grid gap-4">
						{articles.map((art) => (
							<li key={art.id}>
								<Link href={`/blog/${art.slug}`} className="card !block !p-6">
									<div className="mb-2 flex flex-wrap items-center gap-3 text-[0.75rem] text-[var(--ink-faint)]">
										<span className="card__tag">{art.category}</span>
										<time dateTime={art.published_at || art.created_at}>
											{art.published_at
												? new Date(art.published_at).toLocaleDateString("en-GB", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})
												: "Recently"}
										</time>
										{art.profiles?.full_name && <span>{art.profiles.full_name}</span>}
									</div>
									<h2 className="!text-[1.25rem] !leading-snug">
										{String(art.title || "").replace(/\s*Slug:.*$/i, "").trim()}
									</h2>
									{art.meta_description && (
										<p className="mt-2 line-clamp-2 text-[0.9375rem] text-[var(--ink-muted)]">
											{cleanExcerpt(art.meta_description)}
										</p>
									)}
								</Link>
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}
