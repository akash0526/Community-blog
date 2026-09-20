import PillarPage from "@/components/PillarPage";
import { SITE_URL } from "@/lib/articles";

export const metadata = {
	title: "Blogging & Hosting in Nepal: Domains, Hosting, CDN and Free Options",
	description: "A Nepal-first blogging and hosting guide with free static hosting, WordPress options, domains, CDN, and NPR cost checks.",
	alternates: { canonical: "/blogging-hosting" },
	openGraph: { title: "Blogging & Hosting in Nepal | Apex", url: `${SITE_URL}/blogging-hosting`, type: "article" },
};

export default function BloggingHostingPage() {
	return <PillarPage categoryId="hosting" eyebrow="Blogging & hosting" title="Blogging and hosting in Nepal without wasting money" description="Start free when you can, pay only when a paid host solves a real bottleneck, and keep renewal pricing visible before buying. This cluster covers domains, hosting, CDN, WordPress, and static-site options." steps={["Validate your niche and first posts before buying a paid plan.", "Use Cloudflare Pages, GitHub Pages, or Vercel for free static projects.", "When you need WordPress, compare Hostinger, WordPress.com, and domain-only providers with renewal prices.", "Add Cloudflare DNS/CDN and compress images so the site stays fast on Nepali mobile data."]} faqs={[{ q: "Should beginners buy hosting on day one?", a: "Not always. Students and technical users can test with free static hosting first; non-technical users may prefer WordPress.com or managed hosting." }, { q: "Why keep domains separate from hosting?", a: "It makes renewals and migrations easier if your hosting price jumps or support disappoints." }, { q: "What price matters most?", a: "Renewal price, not only the first-year discount. The directory flags this for every paid hosting recommendation." }]} />;
}
