/**
 * One-shot database initialisation: apply migrations, then seed demo content
 * if the database is empty. Safe to run repeatedly.
 * Usage: npm run db:init
 */
import { applyMigrations, seedIfEmpty } from "./db-ops";
import { resolveDatabaseFile } from "../db";

async function main() {
  console.log(`Initialising database → ${resolveDatabaseFile()}`);
  applyMigrations();
  console.log("✓ Migrations applied.");
  const result = await seedIfEmpty();
  if (result.skipped) {
    console.log("• Projects already exist — existing data left untouched.");
  } else {
    console.log(
      `✓ Seeded ${result.categories} categories, ${result.settings} settings, ` +
        `${result.projects} projects (${result.media} media records).`,
    );
  }
}

main().catch((error) => {
  console.error("✗ Initialisation failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
