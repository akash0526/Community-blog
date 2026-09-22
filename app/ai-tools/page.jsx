import PillarPage from "@/components/PillarPage";
import { SITE_URL } from "@/lib/articles";

export const metadata = {
	title: "AI Tools for Nepal: Free Tiers, NPR Value & What to Skip",
	description: "A Nepal-first guide to AI tools that actually work for students, freelancers, and small businesses.",
	alternates: { canonical: "/ai-tools" },
	openGraph: { title: "AI Tools for Nepal | Apex", url: `${SITE_URL}/ai-tools`, type: "article" },
};

export default function AiToolsPage() {
	return <PillarPage categoryId="ai-tools" eyebrow="AI tools" title="AI Tools for Nepal: what works, what is free, what to skip" description="Use AI for study, coding, proposals, thumbnails, transcription, and client work without assuming US pricing or perfect internet. This hub links every recommendation back to tools tested for Nepal." steps={["Start with a free general AI assistant: Gemini, ChatGPT, or DeepSeek.", "Add a writing checker like Harper before sending CVs or Upwork proposals.", "Use image and voice tools only when they save time on a real deliverable.", "Upgrade only when the free tier blocks a paid client or measurable study outcome."]} faqs={[{ q: "Which free AI tool should Nepali students try first?", a: "DeepSeek is strong for code and math, while Gemini is easiest if you already use Google Docs and Gmail." }, { q: "Do these tools need a VPN in Nepal?", a: "The directory prioritizes tools that work on common Nepali networks without a VPN, but bot-protected services may require a browser check." }, { q: "When is a paid AI plan worth it?", a: "Pay only when it improves paid client output, saves repeatable time, or removes a limit you hit every week." }]} />;
}
