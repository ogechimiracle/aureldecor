import { loadEnvConfig } from "@next/env";
import { createClient, type InValue } from "@libsql/client";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "node:path";
import { resolveDatabaseFile } from "../db";
import * as schema from "../db/schema";

loadEnvConfig(process.cwd());

const sourceFile = resolveDatabaseFile();
const migrationFolder = path.join(process.cwd(), "db", "migrations");
const contentTables = [
  "categories",
  "users",
  "settings",
  "projects",
  "media",
  "project_categories",
  "contact_inquiries",
] as const;

function toSqlValue(value: unknown): InValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    value instanceof Uint8Array
  ) {
    return value;
  }
  throw new Error("The local database contains a value that cannot be imported.");
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before running db:setup:turso.",
    );
  }

  const client = createClient({ url, authToken });
  const source = new Database(sourceFile, { readonly: true, fileMustExist: true });

  try {
    await migrate(drizzle(client, { schema }), {
      migrationsFolder: migrationFolder,
    });

    for (const table of contentTables) {
      const result = await client.execute(`SELECT count(*) AS count FROM "${table}"`);
      if (Number(result.rows[0]?.count ?? 0) !== 0) {
        throw new Error(
          `Turso table "${table}" is not empty. Import stopped to avoid overwriting existing data.`,
        );
      }
    }

    const transaction = await client.transaction("write");
    try {
      const projects: Record<string, unknown>[] = [];

      for (const table of contentTables) {
        const rows = source.prepare(`SELECT * FROM "${table}"`).all() as Record<
          string,
          unknown
        >[];
        for (const originalRow of rows) {
          const row =
            table === "projects"
              ? { ...originalRow, cover_media_id: null }
              : originalRow;
          if (table === "projects" && originalRow.cover_media_id) {
            projects.push({
              id: originalRow.id,
              cover_media_id: originalRow.cover_media_id,
            });
          }

          const columns = Object.keys(row);
          const placeholders = columns.map(() => "?").join(", ");
          const columnList = columns.map((column) => `"${column}"`).join(", ");
          await transaction.execute({
            sql: `INSERT INTO "${table}" (${columnList}) VALUES (${placeholders})`,
            args: columns.map((column) => toSqlValue(row[column])),
          });
        }
      }

      for (const project of projects) {
        await transaction.execute({
          sql: 'UPDATE "projects" SET "cover_media_id" = ? WHERE "id" = ?',
          args: [toSqlValue(project.cover_media_id), toSqlValue(project.id)],
        });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    console.log(
      `Turso setup complete. Imported ${contentTables
        .map(
          (table) =>
            source.prepare(`SELECT count(*) AS count FROM "${table}"`).get() as {
              count: number;
            },
        )
        .reduce((total, row) => total + row.count, 0)} records from ${sourceFile}.`,
    );
  } finally {
    source.close();
    client.close();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Turso setup failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
