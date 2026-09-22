import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LazyCookieConsent from "@/components/LazyCookieConsent";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SiteEffects from "@/components/SiteEffects";
import { SITE_URL } from "@/lib/articles";
import "./globals.css";

const siteName = "Apex";
const siteTagline = "Tested tools and guides for Nepal";
const description =
	"Apex Nepal publishes tested, cited resources for Nepali students, freelancers, bloggers, and small businesses: AI tools, hosting, payments, learning, and practical online-work guides.";
const keywords = [
	"apex",
	"Nepal tools",
	"AI tools Nepal",
	"freelancing in Nepal",
	"hosting Nepal",
	"Payoneer Nepal",
	"eSewa hosting",
	"small business tools Nepal",
	"student resources Nepal",
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
	// Follows the redesign palette instead of the old indigo (#4f46e5).
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#F7F3EC" },
		{ media: "(prefers-color-scheme: dark)", color: "#131110" },
	],
	colorScheme: "light dark",
};

/**
 * Theme bootstrap (brief §18). Runs synchronously in <head>, BEFORE the
 * stylesheet, so the saved theme is on <html> before first paint — no flash.
 * Reads/writes `localStorage.theme` and drives `[data-theme="…"]`, which is
 * the single token swap behind light/dark mode (non-negotiable #9).
 */
const THEME_BOOTSTRAP = `(function(){try{var root=document.documentElement;var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){try{var legacy=localStorage.getItem("apex_theme");if(legacy==="dark"||legacy==="light"){t=legacy;localStorage.setItem("theme",t);}}catch(e2){}}if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}root.setAttribute("data-theme",t);root.classList.add("js");}catch(e){}})();`;

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
		"alternateName": ["Apex Nepal", "Apex Community", "Apex Blog"],
		"url": SITE_URL,
		description,
		"inLanguage": ["en", "ne"],
		"potentialAction": {
			"@type": "SearchAction",
			"target": `${SITE_URL}/?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
		"publisher": {
			"@type": "Organization",
			"name": siteName,
			"logo": {
				"@type": "ImageObject",
				"url": `${SITE_URL}/icon.svg`,
			},
		},
	};
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": siteName,
		"url": SITE_URL,
		"logo": `${SITE_URL}/icon.svg`,
		"sameAs": ["https://github.com/akash0526"],
		"foundingDate": "2025-11-01",
		"founders": [
			{
				"@type": "Person",
				"name": "Akash Adhikari",
				"url": `${SITE_URL}/authors/akash-adhikari`,
			},
		],
		"description": description,
	};

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* §1.1 — the three families load in ONE Google Fonts request. */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				{/* Preconnect to external origins — saves DNS + TLS round-trip */}
				<link rel="preconnect" href="https://images.unsplash.com" />
				<link rel="preconnect" href="https://avatars.githubusercontent.com" />
				<link
					rel="preconnect"
					href="https://xytyivccxndygcgpqeiu.supabase.co"
				/>
				<link rel="preconnect" href="https://i.ibb.co" />
				<link rel="dns-prefetch" href="https://ui-avatars.com" />

				<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />

				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Mukta:wght@400;600&display=swap"
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
			<body className="flex min-h-screen flex-col">
				{/* §2.4 — first focusable element on every page. */}
				<a className="skip" href="#main">
					Skip to content
				</a>

				<Navbar />

				<main id="main" className="flex flex-1 flex-col" tabIndex={-1}>
					{children}
				</main>

				{/* §12 — site-wide footer, all previously published routes kept. */}
				<footer className="footer mt-auto">
					<div className="wrap">
						<div className="footer__grid">
							<div className="footer__brand">
								<Link href="/" className="brand">
									Apex<span className="dot" />
									Nepal
								</Link>
								<p>
									A curated resource hub for people building from Nepal —
									plus open stories from around the world. Every entry is
									tested, cited and corrected in public.
								</p>
								<span className="deva" lang="ne">
									एपेक्स नेपाल
								</span>
								<p className="mt-3 text-[0.8125rem] text-[var(--ink-faint)]">
									Editorial base: Butwal, Nepal • Founded Nov 2025
								</p>
							</div>

							<div>
								<h4>Browse</h4>
								<ul>
									<li>
										<Link href="/resources">All resources</Link>
									</li>
									<li>
										<Link href="/blog">Guides</Link>
									</li>
									<li>
										<Link href="/ai-tools">Tools</Link>
									</li>
									<li>
										<Link href="/freelancing-in-nepal">Freelancing</Link>
									</li>
									<li>
										<Link href="/small-business-tools">Business tools</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4>About</h4>
								<ul>
									<li>
										<Link href="/editorial">Our method</Link>
									</li>
									<li>
										<Link href="/how-we-test">How we test</Link>
									</li>
									<li>
										<Link href="/write-for-us">Submit a resource</Link>
									</li>
									<li>
										<Link href="/corrections">Corrections</Link>
									</li>
									<li>
										<Link href="/contact">Contact</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4>Elsewhere</h4>
								<ul>
									<li>
										<a
											href="https://github.com/akash0526/Community-blog"
											target="_blank"
											rel="noopener"
										>
											GitHub
										</a>
									</li>
									<li>
										<a href="mailto:editor@apex-nepal.com">
											editor@apex-nepal.com
										</a>
									</li>
									<li>
										<Link href="/feed.xml">RSS</Link>
									</li>
									<li>
										<Link href="/dashboard">Writer dashboard</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className="footer__base">
							<span>© {new Date().getFullYear()} Apex Nepal</span>
							<span className="footer__base-links">
								<Link href="/privacy">Privacy Policy</Link>
								<Link href="/terms">Terms of Service</Link>
								<Link href="/disclaimer">Disclaimer</Link>
								<CookieSettingsButton />
							</span>
							<span>Made in Kathmandu</span>
						</div>
					</div>
				</footer>

				<LazyCookieConsent />
				<SiteEffects />
			</body>
		</html>
	);
}
