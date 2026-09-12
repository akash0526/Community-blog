import type { MetadataRoute } from "next";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apex Nepal",
    short_name: "Apex Nepal",
    description:
      "Helping Nepali freelancers, students, and small businesses earn more with AI and digital tools. Guides on AI tools, freelancing in Nepal, blogging & hosting, digital payments, and small business tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["education", "business", "productivity"],
  };
}
