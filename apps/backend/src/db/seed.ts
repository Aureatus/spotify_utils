import { db } from "./index";
import * as schema from "./schema";

await db.insert(schema.movies).values([
	{
		title: "The Matrix",
		releaseYear: 1999,
	},
	{
		title: "The Matrix Reloaded",
		releaseYear: 2003,
	},
	{
		title: "The Matrix Revolutions",
		releaseYear: 2003,
	},
]);

console.log("Seeding complete.");
