import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Editable site content, stored as JSON documents keyed by section so new
 * settings can be added without a schema migration.
 *
 * Known keys: "brand", "contact", "social", "seo", "home".
 */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type SettingRow = typeof settings.$inferSelect;
