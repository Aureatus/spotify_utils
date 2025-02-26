import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index"; // 👈 Type-only import

export const app = treaty<App>(import.meta.env.VITE_API_URL, {
	fetch: { credentials: "include" },
});
