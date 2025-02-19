import "dotenv/config";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { DB_FILE_NAME } from "../env";
import * as schema from "./schema";

const sqlite = new Database(DB_FILE_NAME);
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite, { schema: schema });
