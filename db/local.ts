import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { resolveDatabaseFile } from ".";
import * as schema from "./schema";

export type LocalDatabase = BetterSQLite3Database<typeof schema>;

interface DatabaseHandle {
  db: LocalDatabase;
  sqlite: Database.Database;
}

const globalForLocalDb = globalThis as unknown as {
  __internaldecorLocalDatabase?: DatabaseHandle;
};

function ensureDatabase(): DatabaseHandle {
  if (!globalForLocalDb.__internaldecorLocalDatabase) {
    const file = resolveDatabaseFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const sqlite = new Database(file);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    globalForLocalDb.__internaldecorLocalDatabase = {
      db: drizzle(sqlite, { schema }),
      sqlite,
    };
  }
  return globalForLocalDb.__internaldecorLocalDatabase;
}

/** Synchronous SQLite connection for local migration and backup scripts only. */
export function getLocalDb(): LocalDatabase {
  return ensureDatabase().db;
}

/** Raw SQLite handle used by local migration and backup scripts only. */
export function getRawDb(): Database.Database {
  return ensureDatabase().sqlite;
}
