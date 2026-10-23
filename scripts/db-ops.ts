/**
 * Database maintenance operations used by the npm scripts in package.json.
 * Migrations are applied deliberately (`npm run db:migrate`) — never
 * automatically on application start-up, and never destructively.
 */
import path from "node:path";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getDb } from "../db";
import { getLocalDb, getRawDb } from "../db/local";
import {
  categories as categoriesTable,
  media as mediaTable,
  projectCategories as projectCategoriesTable,
  projects as projectsTable,
  settings as settingsTable,
} from "../db/schema";
import type { ImageAsset } from "../types";

const MIGRATIONS_FOLDER = path.join(__dirname, "..", "db", "migrations");

export function applyMigrations(): void {
  const db = getLocalDb();
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}

async function tableExists(name: string): Promise<boolean> {
  const rows = await getDb()
    .select({ name: sql<string>`name` })
    .from(sql`sqlite_master`)
    .where(sql`type = 'table' and name = ${name}`)
    .limit(1);
  return rows.length > 0;
}

export interface SeedResult {
  categories: number;
  settings: number;
  projects: number;
  media: number;
  skipped: boolean;
}

/**
 * Seed development/demo content ONLY when the target tables are empty.
 * This is non-destructive: existing rows are never modified or removed.
 */
export async function seedIfEmpty(): Promise<SeedResult> {
  const db = getDb();
  const result: SeedResult = {
    categories: 0,
    settings: 0,
    projects: 0,
    media: 0,
    skipped: false,
  };

  if (!(await tableExists("projects"))) {
    throw new Error("Database is not migrated yet. Run `npm run db:migrate` first.");
  }

  const { projects: demoProjects, projectCategories: demoCategories } = await import(
    "../lib/data/projects"
  );
  const { DEFAULT_SETTINGS } = await import("../server/services/settings");

  /* Categories ------------------------------------------------------ */
  const existingCategories = await db.select().from(categoriesTable);
  const categoryBySlug = new Map(existingCategories.map((row) => [row.slug, row]));

  if (existingCategories.length === 0) {
    for (const [index, category] of demoCategories.entries()) {
      const id = randomUUID();
      await db.insert(categoriesTable).values({
        id,
        name: category.label,
        slug: category.slug,
        description: null,
        sortOrder: index,
      });
      categoryBySlug.set(category.slug, {
        id,
        name: category.label,
        slug: category.slug,
        description: null,
        sortOrder: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      result.categories += 1;
    }
  }

  /* Settings -------------------------------------------------------- */
  const settingRows = await db.select({ key: settingsTable.key }).from(settingsTable);
  const existingKeys = new Set(settingRows.map((row) => row.key));
  const settingsToSeed: { key: string; value: unknown }[] = [
    { key: "brand", value: DEFAULT_SETTINGS.brand },
    { key: "contact", value: DEFAULT_SETTINGS.contact },
    { key: "social", value: { social: DEFAULT_SETTINGS.social } },
    { key: "seo", value: DEFAULT_SETTINGS.seo },
    { key: "home", value: DEFAULT_SETTINGS.home },
  ];
  for (const entry of settingsToSeed) {
    if (existingKeys.has(entry.key)) continue;
    await db
      .insert(settingsTable)
      .values({ key: entry.key, value: entry.value, updatedAt: new Date() })
      .onConflictDoNothing({ target: settingsTable.key });
    result.settings += 1;
  }

  /* Projects -------------------------------------------------------- */
  const projectCount = (
    await db.select({ count: sql<number>`count(*)` }).from(projectsTable)
  )[0]?.count ?? 0;

  if (projectCount > 0 || demoProjects.length === 0) {
    result.skipped = projectCount > 0;
    return result;
  }

  const now = Date.now();

  for (const [index, project] of demoProjects.entries()) {
    const projectId = randomUUID();
    const createdAt = new Date(now - (demoProjects.length - index) * 86_400_000);

    const categoryIds: { id: string; slug: string }[] = [];
    for (const slug of project.categories) {
      const category = categoryBySlug.get(slug);
      if (category) categoryIds.push({ id: category.id, slug: category.slug });
    }
    if (categoryIds.length === 0) {
      console.warn(`[seed] No category found for "${project.slug}" — skipping.`);
      continue;
    }

    /* Media (remote URLs imported from the demo gallery) ------------- */
    const mediaIdBySrc = new Map<string, string>();
    const mediaRows: (typeof mediaTable.$inferInsert)[] = [];

    const registerMedia = (asset: ImageAsset, sortOrder: number): string => {
      const existing = mediaIdBySrc.get(asset.src);
      if (existing) return existing;
      const id = randomUUID();
      mediaIdBySrc.set(asset.src, id);
      mediaRows.push({
        id,
        projectId,
        mediaType: "image",
        storageProvider: "remote",
        storageKey: asset.src,
        originalFilename: null,
        mimeType: "image/jpeg",
        sizeBytes: null,
        width: asset.width,
        height: asset.height,
        durationSeconds: null,
        altText: asset.alt,
        sortOrder,
        createdAt,
      });
      return id;
    };

    const coverMediaId = registerMedia(project.cover, 0);
    project.gallery.forEach((asset, galleryIndex) => {
      registerMedia(asset, galleryIndex + 1);
    });

    await db.transaction(async (tx) => {
      await tx.insert(projectsTable)
        .values({
          id: projectId,
          title: project.title,
          slug: project.slug,
          shortDescription: project.summary,
          description: project.overview,
          coverMediaId: null,
          categoryId: categoryIds[0].id,
          location: project.location || null,
          completionDate: project.year || null,
          propertyType: project.propertyType || null,
          area: project.area ?? null,
          mediaType: "image",
          videoUrl: null,
          brief: project.brief || null,
          concept: project.concept || null,
          challenges: project.challenges,
          materials: project.materials,
          palette: project.palette,
          outcomes: project.outcomes,
          beforeAfter: project.beforeAfter ?? null,
          status: "published",
          featured: project.featured,
          publishedAt: createdAt,
          createdAt,
          updatedAt: createdAt,
        })
        .run();

      await tx.insert(projectCategoriesTable)
        .values(
          categoryIds.map((entry) => ({
            projectId,
            categoryId: entry.id,
            isPrimary: entry.id === categoryIds[0].id,
          })),
        )
        .run();

      if (mediaRows.length > 0) {
        await tx.insert(mediaTable).values(mediaRows).run();
      }

      await tx.update(projectsTable)
        .set({ coverMediaId, updatedAt: createdAt })
        .where(eq(projectsTable.id, projectId))
        .run();
    });

    result.projects += 1;
    result.media += mediaRows.length;
  }

  return result;
}

/** Non-destructive backup using SQLite's VACUUM INTO (consistent snapshot). */
export function backupDatabase(targetPath: string): void {
  const raw = getRawDb();
  const escaped = targetPath.replace(/'/g, "''");
  raw.exec(`VACUUM INTO '${escaped}'`);
}
