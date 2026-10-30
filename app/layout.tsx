import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { NavigationProgress } from "@/components/NavigationProgress";
import LazyCookieConsent from "@/components/LazyCookieConsent";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import SiteEffects from "@/components/SiteEffects";
import { SITE_URL } from "@/lib/articles";
import {
	SITE_NAME,
	SITE_TAGLINE,
	SITE_DESCRIPTION,
	EDITORIAL_BASE,
	SITE_COUNTRY,
	FOUNDED,
	CONTACT_EMAIL,
	SOCIAL_PROFILES,
	FOUNDER,
	LOGO_PATH,
} from "@/lib/siteConfig";
// Privacy-first, cookieless analytics. Both scripts are served first-party
// from /_vercel/… so they add no third-party origin, no cookies, and no
// personal data — which is why they sit outside the cookie-consent gate.
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Self-hosted fonts (via @fontsource) instead of a render-blocking
// fonts.googleapis.com stylesheet: no third-party DNS/TLS round-trip in
// the critical path. `font-display: swap` keeps text visible while the
// woff2 files stream in.
import "@fontsource-variable/inter/wght.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/mukta/latin-400.css";
import "@fontsource/mukta/devanagari-400.css";
import "./globals.css";

const siteName = SITE_NAME;
const siteTagline = SITE_TAGLINE;
const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${siteName} — ${siteTagline}`,
		template: `%s | ${siteName}`,
	},
	description,
	applicationName: siteName,
	authors: [{ name: "Apex Nepal Editorial", url: SITE_URL }],
	creator: siteName,
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
	verification: {
		google: "3UGsGsVEXIWpZW81U1Zs9cJnMPPVOAiUeqp5Jr_1P-0",
		// Bing Webmaster Tools (playbook §5.6 — Bing feeds ChatGPT search).
		// Set BING_SITE_VERIFICATION in Vercel after importing the site
		// from Search Console; no code change needed.
		...(process.env.BING_SITE_VERIFICATION
			? {
					other: {
						"msvalidate.01": process.env.BING_SITE_VERIFICATION,
					},
				}
			: {}),
	},
};

export const viewport: Viewport = {
	// Matches the paper colour of each theme so the browser chrome blends
	// into the page instead of flashing white.
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
		{ media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
	],
	colorScheme: "light dark",
};

/**
 * Theme bootstrap. Runs synchronously in <head>, BEFORE the stylesheet, so
 * the saved theme is on <html> before first paint — no flash. Reads/writes
 * `localStorage.theme` and drives `[data-theme="…"]`, which is the single
 * token swap behind light/dark mode.
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
		"alternateName": ["Apex Nepal Blog"],
		"url": SITE_URL,
		description,
		"inLanguage": "en",
		"publisher": {
			"@type": "Organization",
			"name": siteName,
			"logo": {
				"@type": "ImageObject",
				"url": `${SITE_URL}${LOGO_PATH}`,
				"width": 512,
				"height": 512,
			},
		},
	};
	const orgSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": siteName,
		"url": SITE_URL,
		"logo": {
			"@type": "ImageObject",
			"url": `${SITE_URL}${LOGO_PATH}`,
			"width": 512,
			"height": 512,
		},
		...(SOCIAL_PROFILES.length ? { "sameAs": SOCIAL_PROFILES } : {}),
		"email": CONTACT_EMAIL,
		"foundingDate": FOUNDED,
		"address": { "@type": "PostalAddress", "addressCountry": SITE_COUNTRY },
		"founder": {
			"@type": "Person",
			"name": FOUNDER.name,
			"url": `${SITE_URL}/authors/${FOUNDER.slug}`,
			"sameAs": FOUNDER.sameAs,
		},
		"description": description,
	};

	return (
		<html lang="en" suppressHydrationWarning className="scrollbar-custom">
			<head>
				{/* Preconnect only to origins that serve immediate above-the-fold
				    resources. Keep this list ≤2 — Lighthouse warns when a page
				    opens more preconnect connections than that. */}
				<link rel="dns-prefetch" href="https://images.unsplash.com" />
				<link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
				<link rel="dns-prefetch" href="https://xytyivccxndygcgpqeiu.supabase.co" />
				<link rel="dns-prefetch" href="https://ui-avatars.com" />

				<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />

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
				<a className="skip" href="#main">
					Skip to content
				</a>

				<Providers>
					{/* Inline route feedback — replaces the full-screen page
					    curtain, so navigation never hides the page you asked for. */}
					<NavigationProgress />

					<Navbar />

					<main id="main" className="flex flex-1 flex-col" tabIndex={-1}>
						{children}
					</main>

					<footer className="footer">
						<div className="wrap">
							<div className="footer__grid">
								<div className="footer__brand">
									<Link href="/" className="brand">
										Apex<span className="dot" aria-hidden="true" />
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
									<p className="text-[0.8125rem] text-[var(--ink-faint)]">
										Editorial base: {EDITORIAL_BASE} · Founded Nov 2025
									</p>
								</div>

								<div>
									<p className="footer__title">Browse</p>
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
									<p className="footer__title">About</p>
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
									<p className="footer__title">Elsewhere</p>
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
											<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
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
								<span>Made in Nepal</span>
							</div>
						</div>
					</footer>

					<LazyCookieConsent />
					<SiteEffects />
				</Providers>

				{/* Cookieless traffic + Core Web Vitals measurement. Outside
				    <Providers> on purpose: they are independent of app state and
				    must keep reporting even if a provider throws. */}
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
