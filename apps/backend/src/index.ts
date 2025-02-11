import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/health", () => "OK")
  .listen(3000);

console.log(
  `🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`
);
