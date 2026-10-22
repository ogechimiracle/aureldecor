import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export type AppDatabase = BetterSQLite3Database<typeof schema>;

interface DatabaseHandle {
  db: AppDatabase;
  sqlite: Database.Database;
}

/**
 * Resolve the SQLite database file location.
 * Override with `DATABASE_FILE` (relative paths resolve from the working dir).
 */
export function resolveDatabaseFile(): string {
  const configured = process.env.DATABASE_FILE?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "data", "app.db");
}

/** Open (and configure) a SQLite database at the given file path. */
export function createDatabase(file: string = resolveDatabaseFile()): DatabaseHandle {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

// Cache the connection across dev hot-reloads so we don't leak handles.
const globalForDb = globalThis as unknown as {
  __internaldecorDatabase?: DatabaseHandle;
};

function ensureDatabase(): DatabaseHandle {
  if (!globalForDb.__internaldecorDatabase) {
    globalForDb.__internaldecorDatabase = createDatabase();
  }
  return globalForDb.__internaldecorDatabase;
}

/** Lazily obtained Drizzle client (server-only). */
export function getDb(): AppDatabase {
  return ensureDatabase().db;
}

/** Raw better-sqlite3 handle — used by the migration runner and tests. */
export function getRawDb(): Database.Database {
  return ensureDatabase().sqlite;
}

export { schema };
