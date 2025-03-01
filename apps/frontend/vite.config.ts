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
	server: {
		https: {
			cert: "../../cert/localhost.pem",
			key: "../../cert/localhost-key.pem",
		},
	},
});
