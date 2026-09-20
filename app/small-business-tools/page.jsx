import PillarPage from "@/components/PillarPage";
import { SITE_URL } from "@/lib/articles";

export const metadata = {
	title: "Small Business Tools for Nepal: Free Stack for Shops and Local Services",
	description: "Free and low-cost tools for Nepali shops: design, invoices, PDFs, backups, passwords, QR codes, and product photos.",
	alternates: { canonical: "/small-business-tools" },
	openGraph: { title: "Small Business Tools for Nepal | Apex", url: `${SITE_URL}/small-business-tools`, type: "article" },
};

export default function SmallBusinessToolsPage() {
	return <PillarPage categoryId="business" eyebrow="Small business" title="Free tool stack for a Nepali shop or local service" description="A pasal, tutor, repair service, or Facebook shop does not need expensive software to start. This hub prioritizes offline-friendly, secure, and simple tools that work on low-end devices." steps={["Create basic designs with Photopea, free stock photos, and compressed product images.", "Use LibreOffice or OnlyOffice for invoices, stock sheets, and quotations.", "Back up records with MEGA or Filen, and protect accounts with Bitwarden plus 2FA.", "Use QR tools, PDF tools, and product-background removers when they directly support sales." ]} faqs={[{ q: "What is the first tool a shop owner should learn?", a: "Photopea or Canva-style design basics usually create immediate value: menus, offers, price lists, and social posts." }, { q: "What about security?", a: "Start with Bitwarden for unique passwords and Ente Auth for two-factor authentication on Gmail, wallets, and bank logins." }, { q: "Do free tools handle Nepali text?", a: "LibreOffice generally handles Nepali text well, but always export and print-test invoices before using them with customers." }]} />;
}
