import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../db/index";
import { account, session, user, verification } from "../../db/schema";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../../env";

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET)
	throw new Error("Spotify credentials missing");

export const auth = betterAuth({
	trustedOrigins: [
		"https://localhost:5173",
		"*.spotify-utils-5h1.pages.dev",
		"https://spotifyutils.app",
	],
	advanced: {
		useSecureCookies: true,
		crossSubDomainCookies: {
			domain: ".spotifyutils.app", // Use root domain
			enabled: true,
		},
	},
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
