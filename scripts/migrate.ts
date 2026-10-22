/**
 * Apply committed Drizzle migrations to the configured SQLite database.
 * Usage: npm run db:migrate
 */
import { applyMigrations } from "./db-ops";
import { resolveDatabaseFile } from "../db";

try {
  console.log(`Applying migrations → ${resolveDatabaseFile()}`);
  applyMigrations();
  console.log("✓ Database is up to date.");
} catch (error) {
  console.error("✗ Migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
