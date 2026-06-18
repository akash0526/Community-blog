import type { MetadataRoute } from "next";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apex Community Platform",
    short_name: "Apex",
    description:
      "An open multi-topic community publishing platform where creators share stories, technical guides, and ideas with a global audience.",
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
    categories: ["education", "news", "social"],
  };
}
