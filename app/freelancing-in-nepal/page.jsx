import PillarPage from "@/components/PillarPage";
import { SITE_URL } from "@/lib/articles";

export const metadata = {
	title: "Freelancing in Nepal: Profiles, First Clients, Pricing & Payments",
	description: "A practical hub for Nepali freelancers: portfolios, proposals, job boards, USD pricing, and payment workflows.",
	alternates: { canonical: "/freelancing-in-nepal" },
	openGraph: { title: "Freelancing in Nepal | Apex", url: `${SITE_URL}/freelancing-in-nepal`, type: "article" },
};

export default function FreelancingPage() {
	return <PillarPage categoryId="freelancing" eyebrow="Freelancing" title="Freelancing in Nepal: from profile to first client" description="Build proof, write better proposals, track applications, and handle time zones before worrying about expensive subscriptions. This page is the hub for Nepali freelancers aiming for their first international client." steps={["Create a clean CV with RX Resume, FlowCV, or RenderCV.", "Publish one focused portfolio page on PeerList, Carrd, or GitHub Pages.", "Track leads and proposals in a simple board before scaling outreach.", "Price in USD, convert to NPR for planning, and choose a payment route before signing a client."]} faqs={[{ q: "Can Nepali freelancers start without a website?", a: "Yes. A strong PeerList profile, GitHub portfolio, or one-page Carrd site is enough for a first-client test." }, { q: "What should I sell first?", a: "Sell a narrow outcome you can prove, such as landing pages, CV rewrites, product photo cleanup, WordPress fixes, or data entry systems." }, { q: "How do I avoid time-zone mistakes?", a: "Use WorldTimeBuddy and write call times with both client time and Nepal Time." }]} />;
}
