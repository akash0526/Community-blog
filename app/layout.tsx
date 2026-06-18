import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { SITE_URL } from "@/lib/articles";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteName = "Apex Community Platform";
const description =
	"Apex Community is an open publishing platform where creators share personal stories, technical guides, startup lessons, and culture writing with a global audience. Write, publish, and reach the world.";
const keywords = [
	"community blog",
	"write articles online",
	"developer blogging platform",
	"publish stories",
	"open community publishing",
	"multi-author blog",
	"tech articles",
	"personal stories",
];

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${siteName} — Write & Share Stories With the World`,
		template: `%s | ${siteName}`,
	},
	description,
	applicationName: siteName,
	keywords,
	authors: [{ name: "Apex Community" }],
	creator: "Apex Community",
	publisher: siteName,
	category: "technology",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		siteName,
		title: `${siteName} — Write & Share Stories With the World`,
		description,
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: siteName,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} — Write & Share Stories With the World`,
		description,
		images: ["/opengraph-image"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	// Uncomment and paste your verification tokens once you add the site
	// to Google Search Console / Bing Webmaster Tools:
	// verification: {
	//   google: "GOOGLE_SITE_VERIFICATION_CODE",
	//   other: { "msvalidate.01": "BING_SITE_VERIFICATION_CODE" },
	// },
};

export const viewport: Viewport = {
	themeColor: "#4f46e5",
	colorScheme: "light dark",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// JSON-LD structured data — helps Google show rich results (logo, site name,
	// breadcrumb eligibility). Read by crawlers, invisible to users.
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteName,
		url: SITE_URL,
		description,
		inLanguage: "en",
	};
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteName,
		url: SITE_URL,
		logo: `${SITE_URL}/icon.svg`,
		sameAs: [],
	};

	return (
		<html
			lang="en"
			className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-indigo-500 selection:text-white`}
		>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
				/>
			</head>
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
