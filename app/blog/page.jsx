import { getPaginatedArticles, SITE_URL } from "@/lib/articles";
import { fallbackArticles } from "@/lib/seedData";
import { BlogGrid } from "@/components/BlogGrid";

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

/**
 * Blog archive (animation plan §4, adapted) — the server fetches the
 * real published articles (Supabase, or the seeded fallback when no
 * credentials are set) and hands them to <BlogGrid/>, which layers the
 * animated search box, category pills and staggered card grid on top.
 * No mock data: everything rendered is a published article.
 */
export default async function BlogArchivePage() {
	const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

	let articles = await getPaginatedArticles(ARCHIVE_SIZE, 0);
	if (!hasSupabase) {
		articles = fallbackArticles;
	}

	return (
		<div className="flex-1">
			<BlogGrid articles={articles} />
		</div>
	);
}
