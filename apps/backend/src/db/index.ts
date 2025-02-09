import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

console.log(process.env.DB_FILE_NAME!);

const sqlite = new Database(process.env.DB_FILE_NAME!);

export const db = drizzle(sqlite);
