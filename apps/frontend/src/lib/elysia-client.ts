import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index"; // 👈 Type-only import

export const app = edenTreaty<App>(import.meta.env.VITE_API_URL, {
	fetcher: (url, options) => {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
});
