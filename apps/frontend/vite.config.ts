import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), TanStackRouterVite({ autoCodeSplitting: true })],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	define: {
		"import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
	},
});
