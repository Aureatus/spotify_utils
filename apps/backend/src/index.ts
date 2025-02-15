import { Elysia } from "elysia";
import cors from "@elysiajs/cors";

import betterAuthView from "./utils/auth/view";
import { userMiddleware } from "./middlewares/auth-middleware";
import { getCurrentUserPlaylists } from "./lib/spotify";

const app = new Elysia()
  .use(cors())
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/*", betterAuthView)
  .get("/api/spotify/playlists", async ({ access_token }) => {
    return access_token && (await getCurrentUserPlaylists(access_token));
  })
  .get("/health", () => "OK")
  .listen(3000);

console.log(
  `🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`
);
