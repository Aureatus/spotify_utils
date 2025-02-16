import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index";

export const app = treaty<App>("http://localhost:3000", {
	fetch: { credentials: "include" },
});
