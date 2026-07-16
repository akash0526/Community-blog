import Link from "next/link";
import Image from "next/image";
import { getPaginatedArticles, getPublishedArticleCount } from "@/lib/articles";
import CommunityFeed from "@/components/CommunityFeed";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: "/" },
};

const PAGE_SIZE = 12;

export default async function Homepage() {
  // Fetch featured (1) + first batch of cards in one paginated call
  const articles = await getPaginatedArticles(PAGE_SIZE, 0);
  const totalCount = await getPublishedArticleCount();
  const featured = articles[0] || null;
  const rest = articles.slice(1);
  const hasMore = totalCount > PAGE_SIZE;

  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Clean Hero – Trust First */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-14 shadow-sm mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5 flex-wrap text-[11px] font-black uppercase tracking-wider">
              <span className="text-emerald-600 dark:text-emerald-400">Apex • Global Blog</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Est. 2025 • Doha, Qatar</span>
            </div>

            <h1 className="text-[32px] sm:text-[52px] font-black tracking-tight leading-[1.05] mb-5">
              Open stories from<br />
              around the world.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
              Apex is an open global publishing platform where independent writers share tested, cited stories.
              Real authors. Real evidence. No AI farms.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#feed"
                className="px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm shadow-sm hover:opacity-90 transition text-center"
              >
                Explore stories →
              </Link>
              <Link
                href="/studio"
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition text-center"
              >
                Write a story
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mt-8 font-semibold">
              <Link href="/about" className="underline hover:text-slate-700 dark:hover:text-slate-300">About Apex</Link>
              <Link href="/editorial" className="underline hover:text-slate-700 dark:hover:text-slate-300">Editorial Policy</Link>
              <Link href="/corrections" className="underline hover:text-slate-700 dark:hover:text-slate-300">Corrections</Link>
              <Link href="/contact" className="underline hover:text-slate-700 dark:hover:text-slate-300">Contact</Link>
            </div>
          </div>
        </div>

        {featured ? (
          <>
            <div id="feed" className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-black">Featured</h2>
                <span className="text-xs font-bold text-slate-500">Editor&apos;s pick</span>
              </div>

              <Link
                href={`/blog/${featured.slug}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col lg:flex-row"
              >
                {/* Featured image — uses next/image for auto WebP, responsive sizes, priority preload */}
                <div className="lg:w-[48%] h-64 lg:h-auto min-h-[320px] relative bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={featured.image_url || "/icon.svg"}
                    alt={featured.title?.replace(/Slug:.*$/i, '').trim() || "Featured story"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                    priority
                  />
                  <div className="m-4 inline-block bg-white/95 dark:bg-slate-950/90 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 relative z-10">
                    {featured.category}
                  </div>
                </div>

                <div className="lg:w-[52%] p-7 sm:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-semibold">
                    <span>{new Date(featured.published_at || featured.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    {featured.updated_at && featured.updated_at !== featured.created_at && (
                      <>
                        <span>•</span>
                        <span>Updated {new Date(featured.updated_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {featured.title.replace(/Slug:.*$/i, '').trim()}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed line-clamp-3 mb-6">
                    {featured.meta_description}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Image
                      src={
                        featured.profiles?.avatar_url &&
                        !featured.profiles.avatar_url.includes('dicebear') &&
                        !featured.profiles.avatar_url.includes('bottts')
                          ? featured.profiles.avatar_url
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(featured.profiles?.full_name || 'Apex')}&background=4f46e5&color=fff&size=80`
                      }
                      alt={featured.profiles?.full_name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-bold">{featured.profiles?.full_name || 'Apex Editorial'}</div>
                      <div className="text-xs text-slate-500">{featured.profiles?.professional_role || 'Contributing Writer'}</div>
                    </div>
                    <div className="ml-auto text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      Read →
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <CommunityFeed initialArticles={rest} hasMore={hasMore} initialOffset={PAGE_SIZE} />
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-black mb-3">No published stories yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Be the first to publish on Apex.</p>
            <Link href="/studio" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-black">Create first story</Link>
            <div className="mt-10"><CommunityFeed initialArticles={[]} hasMore={false} initialOffset={0} /></div>
          </div>
        )}
      </div>
    </main>
  );
}
