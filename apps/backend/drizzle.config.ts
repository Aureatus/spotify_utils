import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const { DB_FILE_NAME } = process.env;
if (!DB_FILE_NAME) throw new Error("DB file name not provided");

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: `file:${DB_FILE_NAME}`,
	},
});
