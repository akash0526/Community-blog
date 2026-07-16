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
  const articles = await getPaginatedArticles(PAGE_SIZE, 0);
  const totalCount = await getPublishedArticleCount();
  const featured = articles[0] || null;
  const rest = articles.slice(1);
  const hasMore = totalCount > PAGE_SIZE;

  return (
    <main className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* ─── Glassmorphic Hero ─── */}
        <div className="glass rounded-3xl p-8 sm:p-14 shadow-lg mb-12 fade-up relative overflow-hidden">
          {/* Subtle gradient orb behind hero */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap text-[11px] font-black uppercase tracking-wider">
              <span className="text-emerald-600 dark:text-emerald-400">Apex • Global Blog</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Est. 2025 • Doha, Qatar</span>
            </div>

            {/* Gradient animated heading */}
            <h1 className="text-[32px] sm:text-[52px] font-black tracking-tight leading-[1.05] mb-5 gradient-text">
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
                className="btn btn-primary px-7 py-3.5 rounded-xl font-black text-sm text-center"
              >
                Explore stories <span className="arrow-bounce">→</span>
              </Link>
              <Link
                href="/studio"
                className="btn btn-secondary px-7 py-3.5 rounded-xl font-bold text-sm text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                Write a story
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mt-8 font-semibold">
              <Link href="/about" className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition">About Apex</Link>
              <Link href="/editorial" className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition">Editorial Policy</Link>
              <Link href="/corrections" className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition">Corrections</Link>
              <Link href="/contact" className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition">Contact</Link>
            </div>
          </div>
        </div>

        {featured ? (
          <>
            <div id="feed" className="mb-10 fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-black">Featured</h2>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 badge-glow px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50">Editor&apos;s pick</span>
              </div>

              {/* Featured card with gradient animated border */}
              <Link
                href={`/blog/${featured.slug}`}
                className="gradient-border bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col lg:flex-row card-hover"
              >
                {/* Featured image with zoom on hover */}
                <div className="lg:w-[48%] h-64 lg:h-auto min-h-[320px] relative bg-slate-100 dark:bg-slate-800 img-zoom">
                  <Image
                    src={featured.image_url || "/icon.svg"}
                    alt={featured.title?.replace(/Slug:.*$/i, '').trim() || "Featured story"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover img-zoom-target"
                    priority
                  />
                  <div className="m-4 inline-block glass px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 relative z-10">
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

                  <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
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
                      className="rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
                    />
                    <div>
                      <div className="text-sm font-bold">{featured.profiles?.full_name || 'Apex Editorial'}</div>
                      <div className="text-xs text-slate-500">{featured.profiles?.professional_role || 'Contributing Writer'}</div>
                    </div>
                    <div className="ml-auto text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
                      Read →
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <CommunityFeed initialArticles={rest} hasMore={hasMore} initialOffset={PAGE_SIZE} />
          </>
        ) : (
          <div className="glass rounded-3xl p-10 text-center fade-up">
            <h2 className="text-2xl font-black mb-3">No published stories yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Be the first to publish on Apex.</p>
            <Link href="/studio" className="btn btn-primary px-6 py-3 rounded-xl font-black">Create first story</Link>
            <div className="mt-10"><CommunityFeed initialArticles={[]} hasMore={false} initialOffset={0} /></div>
          </div>
        )}
      </div>
    </main>
  );
}
