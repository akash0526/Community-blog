import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Apex Community Platform — Live Multi-User Developer Blogging",
	description:
		"An open software engineering blogging and expert CMS platform tailored for technical SEO dominance, long-tail keyword clusters, and flawless Core Web Vitals.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-indigo-500 selection:text-white`}
		>
			<body className="font-sans flex flex-col min-h-screen">
				<Navbar />

				<div className="flex-1 flex flex-col">{children}</div>

				{/* Universal Community Footer */}
				<footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800 mt-auto transition">
					<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
						<div className="flex items-center gap-3 text-white font-black text-xl">
							<span className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs flex items-center justify-center font-black shadow-lg shadow-indigo-500/30">
								⚡
							</span>
							<span>
								Apex
								<span className="text-indigo-400 font-black">Community</span>
							</span>
						</div>

						<div className="flex flex-wrap items-center gap-8 text-sm font-extrabold text-slate-300">
							<a href="/" className="hover:text-white transition">
								Explore Ledger
							</a>
							<a href="/studio" className="hover:text-white transition">
								Author Studio
							</a>
						</div>

						<div className="text-xs text-slate-500 font-extrabold">
							© 2026 Open Engineering Community. Built with Next.js & Supabase.
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}
