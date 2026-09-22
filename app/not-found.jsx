import Link from "next/link";

export const metadata = {
	title: "Page not found",
	description: "The page you are looking for does not exist on Apex.",
	robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
	return (
		<div className="flex-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex items-center">
			<div className="max-w-2xl mx-auto px-6 py-24 text-center">
				<div className="text-7xl font-black gradient-text mb-4">404</div>
				<h1 className="text-2xl sm:text-3xl font-black mb-3">This page wandered off.</h1>
				<p className="text-slate-600 dark:text-slate-400 mb-8">
					The link may be broken, or the story may have moved. Try the archive instead.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						href="/"
						className="btn btn-primary px-7 py-3.5 rounded-xl font-black text-sm"
					>
						← Back home
					</Link>
					<Link
						href="/blog"
						className="btn btn-secondary px-7 py-3.5 rounded-xl font-bold text-sm"
					>
						Browse all stories
					</Link>
				</div>
			</div>
		</div>
	);
}
