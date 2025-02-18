import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/auth/callback")({
	validateSearch: z.object({
		code: z.string(),
		redirect: z.string().optional(),
	}),
	beforeLoad: async ({ search }) => {
		window.history.go(-1);

		throw redirect({
			to: search.redirect ?? "/",
			replace: true,
		});
	},
});
