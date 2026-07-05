import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["tests/**/*.test.js"],
		coverage: {
			reporter: ["text", "json", "html"],
			include: ["lib/seoEngine.js"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
