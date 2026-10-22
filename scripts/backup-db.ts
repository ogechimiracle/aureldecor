/**
 * Create a consistent SQLite backup of the database file.
 * Usage: npm run db:backup
 * Restore by copying the file back over data/app.db (see README).
 */
import fs from "node:fs";
import path from "node:path";
import { backupDatabase } from "./db-ops";
import { resolveDatabaseFile } from "../db";

try {
  const source = resolveDatabaseFile();
  if (!fs.existsSync(source)) {
    console.error(`No database found at ${source}. Run \`npm run db:init\` first.`);
    process.exitCode = 1;
  } else {
    const backupsDir = path.join(path.dirname(source), "backups");
    fs.mkdirSync(backupsDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const target = path.join(backupsDir, `app-${stamp}.db`);
    backupDatabase(target);
    console.log(`Backup written to ${target}`);
  }
} catch (error) {
  console.error("Backup failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
