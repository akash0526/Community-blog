import { ImageResponse } from "next/og";

// iOS home-screen / bookmark icon (180×180). Next.js automatically serves
// this at /apple-icon.png and links it — no manual <link> tag needed.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#A8471F",
					borderRadius: "8px",
					color: "white",
					fontSize: "110px",
					fontWeight: 800,
				}}
			>
				A
			</div>
		),
		{ ...size },
	);
}
