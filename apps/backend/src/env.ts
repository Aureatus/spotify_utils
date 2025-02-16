import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = Type.Object({
	DB_FILE_NAME: Type.String(),
	BETTER_AUTH_SECRET: Type.String(),
	BETTER_AUTH_URL: Type.String(),
	SPOTIFY_CLIENT_ID: Type.String(),
	SPOTIFY_CLIENT_SECRET: Type.String(),
});

const env = {
	DB_FILE_NAME: process.env.DB_FILE_NAME,
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
};

const validatedEnv = Value.Parse(envSchema, env);

export const {
	DB_FILE_NAME,
	BETTER_AUTH_SECRET,
	BETTER_AUTH_URL,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
} = validatedEnv;
