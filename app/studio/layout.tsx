import type { Metadata } from "next";

// The Writing Studio is an app surface, not public content.
// robots.txt "Disallow" alone does not keep URLs out of the index —
// an explicit noindex does. (Client pages can't export metadata,
// hence this wrapper layout.)
export const metadata: Metadata = {
	title: "Writing Studio – Apex",
	description: "Draft and publish stories on Apex.",
	robots: { index: false, follow: false },
};

export default function StudioLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
