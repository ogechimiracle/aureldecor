/**
 * Seed demo categories, settings and portfolio content — ONLY when the
 * tables are empty. Never overwrites or deletes existing data.
 * Usage: npm run db:seed
 */
import { seedIfEmpty } from "./db-ops";
import { resolveDatabaseFile } from "../db";

async function main() {
  console.log(`Seeding (if empty) → ${resolveDatabaseFile()}`);
  const result = await seedIfEmpty();
  if (result.skipped) {
    console.log("• Projects already exist — nothing to seed.");
  } else {
    console.log(
      `✓ Seeded ${result.categories} categories, ${result.settings} settings, ` +
        `${result.projects} projects (${result.media} media records).`,
    );
  }
}

main().catch((error) => {
  console.error("✗ Seed failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
