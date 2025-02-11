import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

import betterAuthView from "./utils/auth/view";

const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .get("/health", () => "OK")
  .listen(3000);

console.log(
  `🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`
);
