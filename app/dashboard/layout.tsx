import type { Metadata } from "next";

// Private author area — must never appear in search results.
export const metadata: Metadata = {
	title: "Dashboard – Apex",
	description: "Your Apex author dashboard.",
	robots: { index: false, follow: false },
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
