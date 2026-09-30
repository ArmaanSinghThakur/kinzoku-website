import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads .env by itself; Node can (no dotenv needed). On the server the
// variables come from the environment instead of a file.
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // process.env (not Prisma's env()) so `prisma generate` also works where no database is set.
  datasource: { url: process.env.DATABASE_URL },
});
