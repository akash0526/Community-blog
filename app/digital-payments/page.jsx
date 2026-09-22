import PillarPage from "@/components/PillarPage";
import { SITE_URL } from "@/lib/articles";

export const metadata = {
	title: "Digital Payments in Nepal for Online Earners: Payoneer, Wise, eSewa & Banks",
	description: "A fee-aware Nepal guide for receiving USD, withdrawing to Nepali banks, and using local wallets safely.",
	alternates: { canonical: "/digital-payments" },
	openGraph: { title: "Digital Payments in Nepal | Apex", url: `${SITE_URL}/digital-payments`, type: "article" },
};

export default function DigitalPaymentsPage() {
	return <PillarPage categoryId="payments" eyebrow="Digital payments" title="Digital payments in Nepal for freelancers and online earners" description="Payment rules, fees, limits, and rails change quickly. This hub keeps payment recommendations cautious, date-stamped, and focused on legal, practical ways to receive money." steps={["Pick the client platform or invoice route first, then map the withdrawal path.", "Compare Payoneer, Wise, direct bank transfer, and platform payouts with real fees.", "Use eSewa or Khalti for local clients, not as a substitute for verified international payment rails.", "Record every fee, exchange rate, and date so guides can be refreshed quarterly."]} faqs={[{ q: "Are fees verified forever?", a: "No. Payment fees and limits can change fast, so money posts must show an updated month and year." }, { q: "Should freelancers use crypto for payment?", a: "Apex takes a compliance-first approach. Use legal bank and platform routes; cryptocurrency claims need careful NRB/legal review before publication." }, { q: "What should a beginner document?", a: "Client amount, platform fee, withdrawal fee, exchange rate, bank credit amount, and date." }]} />;
}
