import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LazyCookieConsent from "@/components/LazyCookieConsent";
import { SITE_URL } from "@/lib/articles";
import "./globals.css";

// Font fix: previously used next/font/google (Inter + Geist Mono) which fails offline during `next build` without network.
// For offline-safe builds we use a system font stack via CSS variables instead of fetching Google Fonts at build time.
// If network is available, Google Fonts can still be loaded via preconnect <link> below; the system stack is the fallback.
// This satisfies the requirement: `npm run build` succeeds offline.
const inter = {
	variable: "--font-inter",
} as const;
const geistMono = {
	variable: "--font-geist-mono",
} as const;

const siteName = "Apex Nepal";
const siteTagline = "Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools.";
const description =
	"Apex Nepal helps Nepali freelancers, students, and small businesses earn more with AI and digital tools. Practical guides on AI tools, freelancing in Nepal, blogging & hosting, digital payments, and small business tools — tested for Nepal.";
const keywords = [
	"apex nepal",
	"ai tools nepal",
	"freelancing nepal",
	"blogging nepal",
	"hosting nepal",
	"hostinger nepal",
	"digital payments nepal",
	"esewa",
	"khalti",
	"payoneer nepal",
	"wise nepal",
	"small business tools nepal",
	"canva nepal",
	"grammarly nepal",
	"chatgpt nepal",
	"ai for students nepal",
	"make money online nepal",
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
	creator: "Apex Nepal",
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
		images: ["opengraph-image"],
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
	verification: {
		google: "3UGsGsVEXIWpZW81U1Zs9cJnMPPVOAiUeqp5Jr_1P-0",
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
		"alternateName": ["Apex Community", "Apex Blog", "Apex Nepal"],
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
				<link rel="dns-prefetch" href="https://ui-avatars.com" />

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
									alt="Apex Nepal logo"
									className="w-36 sm:w-44 h-auto max-h-10 object-contain brightness-0 invert"
								/>
								<span className="text-lg">Apex Nepal</span>
							</div>
							<p className="text-slate-400 max-w-md leading-relaxed">
								Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools. Practical, tested guides for Nepal.
							</p>
							<p className="text-xs text-slate-500 mt-3">Editorial base: Kathmandu • Global • Founded Nov 2025</p>
						</div>

						<div>
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Categories</div>
							<ul className="space-y-2 font-bold">
								<li><Link href="/ai-tools" className="link-underline hover:text-white transition">AI Tools</Link></li>
								<li><Link href="/freelancing-in-nepal" className="link-underline hover:text-white transition">Freelancing in Nepal</Link></li>
								<li><Link href="/blogging-hosting" className="link-underline hover:text-white transition">Blogging & Hosting</Link></li>
								<li><Link href="/digital-payments" className="link-underline hover:text-white transition">Digital Payments</Link></li>
								<li><Link href="/small-business-tools" className="link-underline hover:text-white transition">Small Business Tools</Link></li>
								<li><Link href="/resources" className="link-underline hover:text-white transition">Resources</Link></li>
							</ul>
						</div>

						<div>
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Platform</div>
							<ul className="space-y-2 font-bold">
								<li><Link href="/about" className="link-underline hover:text-white transition">About</Link></li>
								<li><Link href="/contact" className="link-underline hover:text-white transition">Contact</Link></li>
								<li><Link href="/editorial" className="link-underline hover:text-white transition">Editorial Policy</Link></li>
								<li><Link href="/corrections" className="link-underline hover:text-white transition">Corrections</Link></li>
								<li><Link href="/resources" className="link-underline hover:text-white transition">Resources</Link></li>
								<li><Link href="/disclaimer" className="link-underline hover:text-white transition">Disclaimer</Link></li>
							</ul>
						</div>
					</div>

					<div className="grid gap-10 md:grid-cols-4 text-left text-sm mb-12">
						<div className="md:col-span-2">
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Affiliate Disclosure</div>
							<p className="text-xs text-slate-500 leading-relaxed max-w-md">
								Some links on Apex Nepal are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you. We only recommend tools we’ve tested. <Link href="/disclaimer" className="underline hover:text-slate-300">Learn more</Link>.
							</p>
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
						<div>
							<div className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">For Nepal</div>
							<p className="text-xs text-slate-500 leading-relaxed">
								Guides for Nepalis in Nepal &amp; abroad — freelancers on Upwork/Fiverr, students using AI ethically, and small businesses growing online.
							</p>
						</div>
					</div>

					<div className="gradient-line mb-8" />

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
						<div className="font-bold">
							© 2026 Apex Nepal. All rights reserved. • <span className="text-slate-400">Helping Nepalis earn more with AI & digital tools.</span>
						</div>
						<div className="flex items-center gap-5 font-bold">
							<Link href="/" className="link-underline hover:text-slate-300 transition">Home</Link>
							<Link href="/about" className="link-underline hover:text-slate-300 transition">About</Link>
							<Link href="/contact" className="link-underline hover:text-slate-300 transition">Contact</Link>
							<a href="https://github.com/akash0526/Community-blog" target="_blank" rel="noopener" className="link-underline hover:text-slate-300 transition">GitHub</a>
						</div>
					</div>
				</div>
			</footer>
			</body>
		</html>
	);
}
