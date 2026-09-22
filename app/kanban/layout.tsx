import type { Metadata } from "next";

// Internal planning tool — must never appear in search results.
export const metadata: Metadata = {
	title: "Content Planner – Apex",
	description: "Internal content planning board.",
	robots: { index: false, follow: false },
};

export default function KanbanLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
