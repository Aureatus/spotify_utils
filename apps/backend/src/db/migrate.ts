import "dotenv/config";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DB_FILE_NAME } from "../env";

const sqlite = new Database(DB_FILE_NAME);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });
