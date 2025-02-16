import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../db/index";
import { account, session, user, verification } from "../../db/schema";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../../env";

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET)
	throw new Error("Spotify credentials missing");

export const auth = betterAuth({
	trustedOrigins: ["http://localhost:5173"],
	socialProviders: {
		spotify: {
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET,
			scope: [
				"playlist-read-private",
				"playlist-read-collaborative",
				"user-read-private",
				"user-read-email",
				"playlist-modify-public",
				"playlist-modify-private",
			],
		},
	},
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user,
			session,
			verification,
			account,
		},
	}),
});
