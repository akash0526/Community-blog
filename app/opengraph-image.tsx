import { ImageResponse } from "next/og";

// Branded default Open Graph image (1200x630) used for the homepage and any
// route that doesn't define its own image. Article pages override this with
// the article's own cover image via generateMetadata().
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

export const alt = "Apex Nepal — Tested tools and guides for Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #312e81 60%, #1e1b4b 100%)",
          color: "white",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "24px",
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 900,
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#a5b4fc",
              display: "flex",
            }}
          >
            APEX NEPAL
          </div>
        </div>
        <div
          style={{
            fontSize: "84px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-3px",
            maxWidth: "1000px",
            display: "flex",
          }}
        >
          Tested tools for Nepali builders.
        </div>
        <div
          style={{
            marginTop: "36px",
            fontSize: "30px",
            color: "#cbd5e1",
            display: "flex",
          }}
        >
          AI, freelancing, hosting, payments, and business guides.
        </div>
      </div>
    ),
    { ...size },
  );
}
