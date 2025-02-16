import "dotenv/config";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const { DB_FILE_NAME } = process.env;
if (!DB_FILE_NAME) throw new Error("DB file name not provided");

const sqlite = new Database(DB_FILE_NAME);

export const db = drizzle(sqlite, { schema: schema });
