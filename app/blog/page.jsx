import Link from "next/link";
import { getPaginatedArticles, SITE_URL } from "@/lib/articles";

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
		<main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-12">
			<div className="max-w-4xl mx-auto px-6">
				<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
					Archive
				</span>
				<h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3 mb-4">
					All stories
				</h1>
				<p className="text-slate-600 dark:text-slate-300 mb-10 max-w-2xl">
					Every published story on Apex, newest first.{" "}
					<Link href="/#feed" className="underline font-bold text-indigo-600 dark:text-indigo-400">
						Or filter by topic on the homepage →
					</Link>
				</p>

				{articles.length === 0 ? (
					<div className="glass rounded-3xl p-10 text-center">
						<p className="font-black text-lg mb-2">No stories yet</p>
						<p className="text-sm text-slate-500">Check back soon.</p>
					</div>
				) : (
					<ol className="space-y-4">
						{articles.map((art) => (
							<li key={art.id}>
								<Link
									href={`/blog/${art.slug}`}
									className="block p-5 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
								>
									<div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex-wrap">
										<span className="text-indigo-600 dark:text-indigo-400">{art.category}</span>
										<span aria-hidden="true">•</span>
										<time dateTime={art.published_at || art.created_at}>
											{art.published_at
												? new Date(art.published_at).toLocaleDateString("en-GB", {
														year: "numeric",
														month: "short",
														day: "numeric",
													})
												: "Recently"}
										</time>
										{art.profiles?.full_name && (
											<>
												<span aria-hidden="true">•</span>
												<span className="normal-case tracking-normal font-semibold">
													{art.profiles.full_name}
												</span>
											</>
										)}
									</div>
									<div className="font-black text-lg sm:text-xl leading-snug mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
										{String(art.title || "").replace(/\s*Slug:.*$/i, "").trim()}
									</div>
									{art.meta_description && (
										<p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
											{art.meta_description}
										</p>
									)}
								</Link>
							</li>
						))}
					</ol>
				)}
			</div>
		</main>
	);
}
