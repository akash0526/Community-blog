import type { MetadataRoute } from "next";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apex Nepal",
    short_name: "Apex Nepal",
    description:
      "Tested tools and guides for Nepali freelancers, students and small businesses: payments, AI tools, hosting and practical online-work guides.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF8",
    theme_color: "#FBFAF8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["education", "news", "social"],
  };
}
