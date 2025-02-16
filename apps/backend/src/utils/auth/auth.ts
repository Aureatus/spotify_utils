import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../../db/index";
import { user, session, verification, account } from "../../db/schema";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
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
