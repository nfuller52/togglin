import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "VITE_");

	return {
		server: {
			port: 3000,
		},
		plugins: [
			tanstackRouter({
				target: "react",
				autoCodeSplitting: true,
			}),
			react(),
			tailwindcss(),
			tsconfigPaths({
				root: ".",
			}),
		],
		test: {
			environment: "jsdom",
			globals: true,
			setupFiles: ["./vitest.setup.ts"],
			include: [
				"./tests/**/*.{test,spec}.{ts,tsx}",
				"./src/**/*.{test,spec}.{ts,tsx}",
			],
			exclude: ["src/main.tsx", "**/server.ts", "**/handler.ts"],
		},
		define: {
			"process.env": env, // This exposes VITE_ variables as `process.env`
		},
	};
});
