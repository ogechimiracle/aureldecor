import { integer, sqliteTable, text, uniqueIndex, primaryKey, index, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import type { ChallengeSolution, ColorSwatch, ImageAsset } from "../../types";
import { categories } from "./categories";

/**
 * Portfolio projects.
 *
 * The schema intentionally carries the richer editorial fields used by the
 * project detail page (brief, concept, materials, palette, outcomes,
 * before/after) as JSON columns so existing project content can be stored in,
 * and served from, SQLite without losing detail.
 */
export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    /** Short summary shown on cards and as the SEO description. */
    shortDescription: text("short_description").notNull(),
    /** Long-form project description. */
    description: text("description").notNull(),
    coverMediaId: text("cover_media_id").references(
      (): AnySQLiteColumn => media.id,
      { onDelete: "set null" },
    ),
    /** Primary category (kept in sync with the project_categories rows). */
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    location: text("location"),
    /** Completion date, free-form ("2024" or "March 2024"). */
    completionDate: text("completion_date"),
    propertyType: text("property_type"),
    area: text("area"),
    /** image | video | mixed — how the project's media should be presented. */
    mediaType: text("media_type", { enum: ["image", "video", "mixed"] })
      .notNull()
      .default("image"),
    /** Optional external video URL (validated: https only). */
    videoUrl: text("video_url"),
    brief: text("brief"),
    concept: text("concept"),
    challenges: text("challenges", { mode: "json" }).$type<ChallengeSolution[]>(),
    materials: text("materials", { mode: "json" }).$type<string[]>(),
    palette: text("palette", { mode: "json" }).$type<ColorSwatch[]>(),
    outcomes: text("outcomes", { mode: "json" }).$type<string[]>(),
    beforeAfter: text("before_after", { mode: "json" }).$type<{
      before: ImageAsset;
      after: ImageAsset;
    } | null>(),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_status_idx").on(table.status),
    index("projects_category_idx").on(table.categoryId),
    index("projects_featured_idx").on(table.featured),
  ],
);

/**
 * Many-to-many join so a project can be discoverable under several categories
 * (as the original static site did). The primary category is flagged.
 */
export const projectCategories = sqliteTable(
  "project_categories",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.projectId, table.categoryId] }),
    index("project_categories_category_idx").on(table.categoryId),
  ],
);

/** Uploaded (or remote) media attached to a project. */
export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    /** Nullable so files can be uploaded while a new project is being drafted. */
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    mediaType: text("media_type", { enum: ["image", "video"] }).notNull(),
    /** local = files on disk/volume; remote = absolute URL (e.g. CDN). */
    storageProvider: text("storage_provider", {
      enum: ["local", "remote"],
    })
      .notNull()
      .default("local"),
    /** Relative key inside the media store, or absolute https URL when remote. */
    storageKey: text("storage_key").notNull(),
    originalFilename: text("original_filename"),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes"),
    width: integer("width"),
    height: integer("height"),
    durationSeconds: integer("duration_seconds"),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("media_project_idx").on(table.projectId),
    index("media_type_idx").on(table.mediaType),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type ProjectCategoryRow = typeof projectCategories.$inferSelect;
