import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";

import {
	createMergedPlaylistForUser,
	getCurrentUserPlaylists,
} from "./lib/spotify";
import { userMiddleware } from "./middlewares/auth-middleware";
import betterAuthView from "./utils/auth/view";

const SpotifyMergeSchema = {
	body: t.Object({
		playlistName: t.String(),
		playlistsToMerge: t.Array(
			t.Object({
				name: t.String(),
				id: t.String(),
				trackListCount: t.Number(),
			}),
		),
	}),
};

const app = new Elysia()
	.use(cors())
	.derive(({ request }) => userMiddleware(request))
	.group("/api", (app) =>
		app.all("/auth/*", betterAuthView).group("/spotify", (app) =>
			app
				.get("/playlists", async ({ access_token }) => {
					return access_token && (await getCurrentUserPlaylists(access_token));
				})
				.post(
					"/merge",
					async ({ access_token, body }) => {
						return (
							access_token &&
							(await createMergedPlaylistForUser(
								access_token,
								body.playlistName,
								body.playlistsToMerge,
							))
						);
					},
					SpotifyMergeSchema,
				),
		),
	)

	.get("/health", () => "OK")
	.listen(3000);

console.log(
	`🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
