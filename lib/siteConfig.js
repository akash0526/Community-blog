// lib/siteConfig.js
// One place for brand/entity facts (playbook §10): the site previously said
// "Apex", "Apex Nepal" and "Apex Community" in different templates, claimed
// Doha in llms.txt and Nepal in the footer, and pointed the Organization
// schema at the founder's personal GitHub. Everything now reads from here.
//
// ACTION NEEDED (see SEO_PLAYBOOK_IMPLEMENTATION.md §What I need from you):
// fill in SOCIAL_PROFILES once the Apex Nepal brand profiles exist. Only
// real, live URLs belong here — an empty list is better than a wrong one.

export const SITE_NAME = "Apex Nepal";
export const SITE_TAGLINE = "Tested tools and guides for Nepal";
export const SITE_DESCRIPTION =
	"Apex Nepal publishes tested, cited resources for Nepali students, freelancers, bloggers, and small businesses: AI tools, hosting, payments, learning, and practical online-work guides.";

// Playbook §4: footer/About said Nepal, llms.txt/author data said Doha.
// Nepal is used consistently now. If the editorial base is ever Doha,
// change it HERE (plus /about, /privacy, /terms legal text) — nowhere else.
export const EDITORIAL_BASE = "Nepal";
export const SITE_COUNTRY = "NP";
export const FOUNDED = "2025-11-01";
export const CONTACT_EMAIL = "editor@apex-nepal.com";

// Brand profiles ONLY (Organization sameAs). TODO(owner): add Facebook,
// LinkedIn, X, YouTube, Instagram profile URLs when created.
export const SOCIAL_PROFILES = [
	// "https://www.facebook.com/apexnepal",
	// "https://www.linkedin.com/company/apex-nepal",
	// "https://x.com/apex_nepal",
	// "https://www.youtube.com/@ApexNepal",
].filter(Boolean);

// TODO(owner): confirm this X handle exists and is yours; it is used as the
// Twitter card creator. Set to "" if the account does not exist.
export const TWITTER_HANDLE = "@apex_nepal";

export const FOUNDER = {
	name: "Akash Adhikari",
	slug: "akash-adhikari",
	role: "Founder & Lead Editor",
	// Person-level profiles (NOT the Organization's sameAs).
	// TODO(owner): add LinkedIn personal profile URL.
	sameAs: ["https://github.com/akash0526"].filter(Boolean),
};

// Raster logo for Organization/Article publisher schema (playbook §5.5:
// Google prefers PNG/JPG ≥112×112 over SVG). Generated from public/icon.svg.
export const LOGO_PATH = "/logo-512.png";
