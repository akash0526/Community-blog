import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import LazyCookieConsent from "@/components/LazyCookieConsent";
import CookieSettingsButton from "@/components/CookieSettingsButton";
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

const siteName = "Apex";
const siteTagline = "Open stories from around the world";
const description =
	"Apex is an open global publishing platform where independent writers share tested, cited stories. Personal essays, tech guides, Qatar expat resources, and cultural reporting – by real authors.";
const keywords = [
	"apex",
	"global blog",
	"community publishing",
	"write articles online",
	"qatar expat guide",
	"tech articles",
	"personal stories",
	"remittance guides",
	"doha",
	"nepal community",
];

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${siteName} — ${siteTagline}`,
		template: `%s | ${siteName}`,
	},
	description,
	applicationName: siteName,
	keywords,
	authors: [{ name: "Apex Editorial", url: SITE_URL }],
	creator: "Apex",
	publisher: siteName,
	category: "technology",
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
		shortcut: ["/icon.svg"],
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: SITE_URL,
		siteName,
		title: `${siteName} — ${siteTagline}`,
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
		title: `${siteName} — ${siteTagline}`,
		description,
		images: [`${SITE_URL}/opengraph-image`],
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
	verification: {
		google: "3UGsGsVEXIWpZW81U1Zs9cJnMPPVOAiUeqp5Jr_1P-0",
		//   other: { "msvalidate.01": "BING_SITE_VERIFICATION_CODE" },
	},
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
		"name": siteName,
		"alternateName": ["Apex Community", "Apex Blog"],
		"url": SITE_URL,
		description,
		"inLanguage": ["en", "ne"],
		"potentialAction": {
			"@type": "SearchAction",
			"target": `${SITE_URL}/?q={search_term_string}`,
			"query-input": "required name=search_term_string"
		},
		"publisher": {
			"@type": "Organization",
			"name": siteName,
			"logo": {
				"@type": "ImageObject",
				"url": `${SITE_URL}/icon.svg`
			}
		}
	};
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": siteName,
		"url": SITE_URL,
		"logo": `${SITE_URL}/icon.svg`,
		"sameAs": [
			"https://github.com/akash0526"
		],
		"foundingDate": "2025-11-01",
		"founders": [{
			"@type": "Person",
			"name": "Akash Adhikari",
			"url": `${SITE_URL}/authors/akash-adhikari`
		}],
		"description": description,
	};

	return (
		<html
			lang="en"
			className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-indigo-500 selection:text-white`}
		>
			<head>
				{/* Preconnect to external origins — saves DNS + TLS round-trip */}
				<link rel="preconnect" href="https://images.unsplash.com" />
				<link rel="preconnect" href="https://avatars.githubusercontent.com" />
				<link rel="preconnect" href="https://xytyivccxndygcgpqeiu.supabase.co" />
				<link rel="preconnect" href="https://i.ibb.co" />
				<link rel="dns-prefetch" href="https://ui-avatars.com" />
				{/* Apply saved theme before first paint — prevents dark/light flash.
				    Runs synchronously; the Navbar toggle keeps localStorage in sync. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem("apex_theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`,
					}}
				/>

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
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
				>
					Skip to content
				</a>
				<Navbar />

				<div id="main-content" className="flex-1 flex flex-col">{children}</div>

				<LazyCookieConsent />

			{/* Trust Footer */}
			<footer className="bg-slate-950 text-slate-300 py-16 mt-auto transition">
				<div className="gradient-line mb-0" />
				<div className="max-w-7xl mx-auto px-6 pt-16">
					<div className="grid gap-10 md:grid-cols-4 text-left text-sm mb-12">
						<div className="md:col-span-2">
							<div className="flex items-center gap-3 text-white font-black text-xl mb-4">
								<img
									src="/apex-community-logo.svg"
									alt="Apex logo"
									className="w-36 sm:w-44 h-auto max-h-10 object-contain brightness-0 invert"
								/>
								<span className="text-lg">Apex</span>
							</div>
							<p className="text-slate-400 max-w-md leading-relaxed">
								Apex is an open global publishing platform where independent writers share tested, cited stories.
							</p>
							<p className="text-xs text-slate-500 mt-3">Editorial base: Doha, Qatar • Founded Nov 2025</p>
						</div>

						<div>
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Platform</div>
							<ul className="space-y-2 font-bold">
								<li><Link href="/about" className="link-underline hover:text-white transition">About</Link></li>
								<li><Link href="/contact" className="link-underline hover:text-white transition">Contact</Link></li>
								<li><Link href="/editorial" className="link-underline hover:text-white transition">Editorial Policy</Link></li>
								<li><Link href="/corrections" className="link-underline hover:text-white transition">Corrections</Link></li>
								<li><Link href="/studio" className="link-underline hover:text-white transition">Write a story</Link></li>
							</ul>
						</div>

						<div>
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Legal</div>
							<ul className="space-y-2 font-bold">
								<li><Link href="/privacy" className="link-underline hover:text-white transition">Privacy Policy</Link></li>
								<li><Link href="/terms" className="link-underline hover:text-white transition">Terms of Service</Link></li>
								<li><Link href="/disclaimer" className="link-underline hover:text-white transition">Disclaimer</Link></li>
								<li><a href="mailto:editor@apex-nepal.com" className="link-underline hover:text-white transition">editor@apex-nepal.com</a></li>
							</ul>
						</div>
					</div>

					<div className="gradient-line mb-8" />

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
						<div className="font-bold">
							© {new Date().getFullYear()} Apex. All rights reserved. • <span className="text-slate-400">Open stories from around the world.</span>
						</div>
						<div className="flex items-center gap-5 font-bold flex-wrap justify-center">
							<Link href="/" className="link-underline hover:text-slate-300 transition">Home</Link>
							<Link href="/blog" className="link-underline hover:text-slate-300 transition">All stories</Link>
							<Link href="/authors" className="link-underline hover:text-slate-300 transition">Authors</Link>
							<Link href="/about" className="link-underline hover:text-slate-300 transition">About</Link>
							<Link href="/contact" className="link-underline hover:text-slate-300 transition">Contact</Link>
							<Link href="/feed.xml" className="link-underline hover:text-slate-300 transition">RSS</Link>
							<CookieSettingsButton />
							<a href="https://github.com/akash0526/Community-blog" target="_blank" rel="noopener" className="link-underline hover:text-slate-300 transition">GitHub</a>
						</div>
					</div>
				</div>
			</footer>
			</body>
		</html>
	);
}
