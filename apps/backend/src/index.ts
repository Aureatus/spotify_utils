import { Elysia } from "elysia";

const app = new Elysia().get("/health", () => "OK").listen(3000);

console.log(
  `🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`
);
