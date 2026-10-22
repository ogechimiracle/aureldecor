import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 * `npm run db:generate` writes SQL migrations to `db/migrations`.
 * Migrations are APPLIED by `npm run db:migrate` (deliberate, never automatic
 * and never destructive).
 */
export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_FILE ?? "./data/app.db",
  },
});
