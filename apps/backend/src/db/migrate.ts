import "dotenv/config";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const { DB_FILE_NAME } = process.env;
if (!DB_FILE_NAME) throw new Error("DB file name not provided");

const sqlite = new Database(DB_FILE_NAME);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });
