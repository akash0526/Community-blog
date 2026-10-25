import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { PageLoader } from "@/components/PageLoader";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
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
// See GROWTH_PLAN.md §Phase 0 and /privacy for the user-facing disclosure.
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Self-hosted fonts (via @fontsource) instead of a render-blocking
// fonts.googleapis.com stylesheet: no third-party DNS/TLS round-trip in
// the critical path (PSI "render-blocking requests" / FCP insight).
// `font-display: swap` keeps text visible while the woff2 files stream in.
// We load targeted wght/subsets (400, 600, 700) to keep critical network payloads minimal.
import "@fontsource-variable/inter/wght.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/mukta/latin-400.css";
import "@fontsource/mukta/devanagari-400.css";
import "./globals.css";

// Playbook §10: one entity name everywhere — "Apex Nepal", never bare
// "Apex" (an LED company and two trekking agencies share that name).
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
	// Playbook §4: the meta keywords tag was removed — Google ignores it.
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
		"alternateName": ["Apex Nepal Blog"],
		"url": SITE_URL,
		description,
		// Playbook §4: was ["en","ne"] with no Nepali content. Claim "en"
		// until /ne/ posts actually exist (article-level detection stays).
		"inLanguage": "en",
		// No SearchAction: Google retired the sitelinks search box, and the
		// old target (/?q=…) had no server-side search behind it. Filter
		// parameter URLs are disallowed in robots.txt.
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
		// Raster PNG logo (playbook §5.5) — was an SVG, which Google's
		// logo guidelines don't accept.
		"logo": {
			"@type": "ImageObject",
			"url": `${SITE_URL}${LOGO_PATH}`,
			"width": 512,
			"height": 512,
		},
		// Brand profiles only. Was the founder's personal GitHub, which
		// conflates the Person and Organization entities. Fill in
		// SOCIAL_PROFILES in lib/siteConfig.js once profiles exist.
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
				{/* Preconnect only to origins that serve immediate above-the-fold resources.
				    Keep this list ≤2 — Lighthouse warns when a page opens more
				    preconnect connections than that or when connections sit unused. */}
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
			{/* §2.4 — first focusable element on every page. */}
			<a className="skip" href="#main">
				Skip to content
			</a>

		<Providers>
			<SmoothScroll>
			{/* Fixed background layer (plan §3): paper colour + mesh
			gradient + faint grid, behind everything (the body is
			transparent). z -10 keeps it under all content. */}
			<div
				className="fixed inset-0 -z-10 bg-(--paper) transition-[background-color] duration-500"
				aria-hidden="true"
			>
				<div className="mesh-gradient absolute inset-0" />
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.02]" />
			</div>

			{/* Page transition system (animation plan §1) — the curtain
			only appears on client-side route changes; the progress bar
			and % dial track reading position site-wide. */}
			<PageLoader />
			<ScrollProgress />

			<Navbar />

			<main id="main" className="flex flex-1 flex-col" tabIndex={-1}>
				<PageTransition>{children}</PageTransition>
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
									Editorial base: {EDITORIAL_BASE} • Founded Nov 2025
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
							<span>Made in Nepal</span>
						</div>
					</div>
				</footer>

			<LazyCookieConsent />
			<SiteEffects />
			</SmoothScroll>
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
