import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { DB_FILE_NAME } from "./src/env";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: `file:${DB_FILE_NAME}`,
	},
});
