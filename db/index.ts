import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type AppDatabase = LibSQLDatabase<typeof schema>;

/**
 * Resolve the local SQLite database file location.
 * Override with `DATABASE_FILE` (relative paths resolve from the working dir).
 */
export function resolveDatabaseFile(): string {
  const configured = process.env.DATABASE_FILE?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "data", "app.db");
}

function createAppDatabase(): AppDatabase {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (url && !authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is set.");
  }
  if (!url && process.env.NODE_ENV === "production") {
    throw new Error(
      "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required for production database access.",
    );
  }

  if (url) {
    return drizzle(createClient({ url, authToken }), { schema });
  }

  const file = resolveDatabaseFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return drizzle(createClient({ url: pathToFileURL(file).href }), { schema });
}

// Cache the connection across dev hot-reloads so we don't leak handles.
const globalForDb = globalThis as unknown as {
  __internaldecorDatabase?: AppDatabase;
};

/** LibSQL client for the local SQLite database or configured Turso database. */
export function getDb(): AppDatabase {
  if (!globalForDb.__internaldecorDatabase) {
    globalForDb.__internaldecorDatabase = createAppDatabase();
  }
  return globalForDb.__internaldecorDatabase;
}

export { schema };
