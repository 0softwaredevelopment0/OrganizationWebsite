import { defineConfig } from "prisma/config";

// Prisma 7+: the connection URL moved out of schema.prisma into this config.
// Read from the process environment lazily (plain string, NOT env()) so that
// `prisma generate` works without DATABASE_URL set — the URL is only needed
// by migrate/db commands.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
