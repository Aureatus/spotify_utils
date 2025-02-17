import { logger } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";

import {
	createMergedPlaylistForUser,
	getCurrentUserPlaylists,
} from "./lib/spotify";
import { userMiddleware } from "./middlewares/auth-middleware";
import betterAuthView from "./utils/auth/view";

// declare module "bun" {
// 	interface Env {
// 		DB_FILE_NAME: string;
// 		BETTER_AUTH_SECRET: string;
// 		BETTER_AUTH_URL: string;
// 		SPOTIFY_CLIENT_ID: string;
// 		SPOTIFY_CLIENT_SECRET: string;
// 	}
// }

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
	.use(
		logger({
			transport: {
				target: "pino-pretty",
				options: {
					colorize: true,
					levelFirst: true,
					messageFormat: true,
					ignore: "pid,hostname",
				},
			},
			autoLogging: true,
			level: "trace",
		}),
	)
	.use(cors())
	.derive(({ request }) => userMiddleware(request))
	.group("/api", (app) =>
		app
			// set parse to avoid body read error, see https://github.com/bogeychan/elysia-logger/issues/26#issuecomment-2581666177
			.all("/auth/*", betterAuthView, { parse: () => 1 }) //
			.group("/spotify", (app) =>
				app
					.get("/playlists", async ({ access_token }) => {
						return (
							access_token && (await getCurrentUserPlaylists(access_token))
						);
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

export type App = typeof app;
