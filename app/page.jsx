import Link from "next/link";
import Image from "next/image";
import { getPaginatedArticles, getPublishedArticleCount } from "@/lib/articles";
import CommunityFeed from "@/components/CommunityFeed";
import { monthlyPicks } from "@/lib/resources";

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
							<span className="text-emerald-600 dark:text-emerald-400">
								Apex Nepal • Tested resources
							</span>
							<span className="text-slate-400">•</span>
							<span className="text-slate-500">Updated Sept 2026 • Nepal-first</span>
						</div>

						{/* Gradient animated heading */}
						<h1 className="text-[32px] sm:text-[52px] font-black tracking-tight leading-[1.05] mb-5 gradient-text">
							Tested tools for
							<br />
							Nepali builders.
						</h1>

						<p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
						Free and affordable AI, freelancing, hosting, payment, and business tools — checked for Nepali internet, Nepali payments, and realistic NPR budgets.
						</p>

						<div className="flex flex-col sm:flex-row gap-3">
							<Link
								href="/resources"
								className="btn btn-primary px-7 py-3.5 rounded-xl font-black text-sm text-center"
							>
								Start with resources <span className="arrow-bounce">→</span>
							</Link>
							<Link
								href="/write-for-us"
								className="btn btn-secondary px-7 py-3.5 rounded-xl font-bold text-sm text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
							>
								Suggest a tool
							</Link>
						</div>

						<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mt-8 font-semibold">
							<Link
								href="/how-we-test"
								className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition"
							>
								How we test
							</Link>
							<Link
								href="/editorial"
								className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition"
							>
								Editorial Policy
							</Link>
							<Link
								href="/corrections"
								className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition"
							>
								Corrections
							</Link>
							<Link
								href="/contact"
								className="link-underline hover:text-slate-700 dark:hover:text-slate-300 transition"
							>
								Contact
							</Link>
						</div>
					</div>
				</div>


				{/* Start-here kits */}
				<section className="mb-12 fade-up" style={{ animationDelay: "0.05s" }}>
					<div className="flex items-end justify-between gap-4 mb-5">
						<div>
							<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Start here</span>
							<h2 className="text-2xl sm:text-3xl font-black mt-2">Pick your Nepal-ready kit</h2>
						</div>
						<Link href="/resources" className="hidden sm:inline text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline">View all resources →</Link>
					</div>
					<div className="grid md:grid-cols-3 gap-4">
						{[
							{ title: "🎓 Student Starter Kit", copy: "Free courses, free AI study help, free books. NPR 0 to start learning.", href: "/resources#students", post: "MIT + Khan Academy guide" },
							{ title: "💼 First-Client Freelancer Kit", copy: "Profile, proposals, portfolio and payments — everything to earn your first $100.", href: "/resources#freelancing", post: "First client on Upwork" },
							{ title: "🏪 Shop Owner Kit", copy: "Free design, free billing tools and online visibility for your pasal.", href: "/resources#business", post: "Free tools for a shop" },
						].map((kit) => (
							<Link key={kit.title} href={kit.href} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition card-hover">
								<h3 className="text-xl font-black mb-3">{kit.title}</h3>
								<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{kit.copy}</p>
								<p className="text-xs font-black text-indigo-600 dark:text-indigo-400">Includes: {kit.post} →</p>
							</Link>
						))}
					</div>
				</section>

				{/* Monthly picks */}
				<section className="mb-8 fade-up" style={{ animationDelay: "0.08s" }}>
					<div className="flex items-end justify-between gap-4 mb-5">
						<div>
							<span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">This month&apos;s picks</span>
							<h2 className="text-2xl sm:text-3xl font-black mt-2">Useful now in Nepal</h2>
						</div>
						<span className="text-xs font-bold text-slate-500">Rotated monthly</span>
					</div>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{monthlyPicks.map((pick) => (
							<Link key={pick.name} href={`/resources#${pick.categoryId}`} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition">
								<div className="flex justify-between gap-3 mb-2">
									<h3 className="font-black">{pick.name}</h3>
									<span className="rounded-full bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-black text-slate-700 dark:text-slate-200">{pick.badge}</span>
								</div>
								<p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{pick.what}</p>
								<p className="text-xs text-slate-500 dark:text-slate-400"><strong>Why Nepal:</strong> {pick.why}</p>
							</Link>
						))}
					</div>
				</section>

				<div className="mb-12 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-4 text-sm text-emerald-900 dark:text-emerald-200 font-bold">
					Every tool tested from Nepal · Prices verified Sept 2026 · <Link href="/how-we-test" className="underline">How we test</Link> · <Link href="/editorial" className="underline">Editorial policy</Link>
				</div>

				<section className="mb-12 rounded-3xl bg-slate-950 text-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
					<div>
						<h2 className="text-2xl font-black mb-2">One email a month: new free tools + price drops. No spam.</h2>
						<p className="text-slate-300 text-sm">Newsletter embed is ready for Buttondown, Substack, or your provider of choice.</p>
					</div>
					<form action="https://buttondown.email/" method="get" className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
						<input type="email" name="email" required placeholder="you@example.com" className="min-w-0 lg:min-w-[280px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400" />
						<button className="btn btn-primary px-6 py-3 rounded-xl text-sm" type="submit">Join free</button>
					</form>
				</section>

				{featured ? (
					<>
						<div
							id="feed"
							className="mb-10 fade-up"
							style={{ animationDelay: "0.1s" }}
						>
							<div className="flex items-center justify-between mb-5">
							<h2 className="text-xl sm:text-2xl font-black">Latest</h2>
							<span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 badge-glow px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
								Fresh off the press
							</span>
							</div>

							{/* Featured card with gradient animated border */}
							<Link
								href={`/blog/${featured.slug}`}
								className="gradient-border bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col lg:flex-row card-hover"
							>
								{/* Featured image with zoom on hover */}
								<div className="lg:w-[48%] h-64 lg:h-auto min-h-[320px] relative bg-slate-100 dark:bg-slate-800 img-zoom">
								<Image
									src={featured.image_url || "/opengraph-image"}
										alt={
											featured.title?.replace(/Slug:.*$/i, "").trim() ||
											"Featured story"
										}
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
										<span>
											{new Date(
												featured.published_at || featured.created_at,
											).toLocaleDateString("en-GB", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</span>
										{featured.updated_at &&
											featured.updated_at !== featured.created_at && (
												<>
													<span>•</span>
													<span>
														Updated{" "}
														{new Date(featured.updated_at).toLocaleDateString(
															"en-GB",
															{ month: "short", day: "numeric" },
														)}
													</span>
												</>
											)}
									</div>

									<h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
										{featured.title.replace(/Slug:.*$/i, "").trim()}
									</h3>

									<p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed line-clamp-3 mb-6">
										{featured.meta_description}
									</p>

									<div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
										<Image
											src={
												featured.profiles?.avatar_url &&
												!featured.profiles.avatar_url.includes("dicebear") &&
												!featured.profiles.avatar_url.includes("bottts")
													? featured.profiles.avatar_url
													: `https://ui-avatars.com/api/?name=${encodeURIComponent(featured.profiles?.full_name || "Apex")}&background=4f46e5&color=fff&size=80`
											}
											alt={featured.profiles?.full_name || "Author"}
											width={40}
											height={40}
											className="rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
										/>
										<div>
											<div className="text-sm font-bold">
												{featured.profiles?.full_name || "Apex Editorial"}
											</div>
											<div className="text-xs text-slate-500">
												{featured.profiles?.professional_role ||
													"Contributing Writer"}
											</div>
										</div>
										<div className="ml-auto text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
											Read →
										</div>
									</div>
								</div>
							</Link>
						</div>

						<CommunityFeed
							initialArticles={rest}
							hasMore={hasMore}
							initialOffset={PAGE_SIZE}
						/>
					</>
				) : (
					<div className="glass rounded-3xl p-10 text-center fade-up">
						<h2 className="text-2xl font-black mb-3">
							No published stories yet
						</h2>
						<p className="text-slate-600 dark:text-slate-400 mb-6">
							Be the first to publish on Apex.
						</p>
						<Link
							href="/studio"
							className="btn btn-primary px-6 py-3 rounded-xl font-black"
						>
							Create first story
						</Link>
						<div className="mt-10">
							<CommunityFeed
								initialArticles={[]}
								hasMore={false}
								initialOffset={0}
							/>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
