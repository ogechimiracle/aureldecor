import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  categories as categoriesTable,
  media as mediaTable,
  projectCategories as projectCategoriesTable,
  projects as projectsTable,
  type Category,
  type Media,
  type Project as ProjectRow,
} from "@/db/schema";
import { isValidVideoUrl, parseVideoUrl } from "@/lib/media/video-url";
import { mediaUrl } from "@/lib/storage";
import { pexelsPhoto } from "@/lib/utils";
import type {
  ChallengeSolution,
  ColorSwatch,
  ImageAsset,
  ProjectVideo,
  PublicProject,
} from "@/types";
import type { ProjectFormValues, ProjectListQuery } from "@/server/validators/project";

/** Shown when a project has no uploaded cover image yet. */
const PLACEHOLDER_COVER: ImageAsset = {
  src: pexelsPhoto(7546645, { width: 1600, height: 1100 }),
  alt: "Interior photograph placeholder",
  width: 1600,
  height: 1100,
  credit: "Photo via Pexels",
};

const DEFAULT_PAGE_SIZE = 12;

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error?: string; fieldErrors?: Record<string, string[]> };

interface Relations {
  mediaByProject: Map<string, Media[]>;
  categoriesByProject: Map<string, Category[]>;
}

async function loadRelations(projectIds: string[]): Promise<Relations> {
  const mediaByProject = new Map<string, Media[]>();
  const categoriesByProject = new Map<string, Category[]>();
  if (projectIds.length === 0) return { mediaByProject, categoriesByProject };

  const db = getDb();

  const mediaRows = await db
    .select()
    .from(mediaTable)
    .where(inArray(mediaTable.projectId, projectIds))
    .orderBy(asc(mediaTable.sortOrder), asc(mediaTable.createdAt));

  for (const row of mediaRows) {
    if (!row.projectId) continue;
    const list = mediaByProject.get(row.projectId) ?? [];
    list.push(row);
    mediaByProject.set(row.projectId, list);
  }

  const categoryRows = await db
    .select({
      projectId: projectCategoriesTable.projectId,
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      sortOrder: categoriesTable.sortOrder,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
      isPrimary: projectCategoriesTable.isPrimary,
    })
    .from(projectCategoriesTable)
    .innerJoin(
      categoriesTable,
      eq(categoriesTable.id, projectCategoriesTable.categoryId),
    )
    .where(inArray(projectCategoriesTable.projectId, projectIds))
    .orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));

  for (const row of categoryRows) {
    const { projectId, isPrimary, ...category } = row;
    const list = categoriesByProject.get(projectId) ?? [];
    // Primary category first so cards show it in the badge list.
    if (isPrimary) list.unshift(category);
    else list.push(category);
    categoriesByProject.set(projectId, list);
  }

  return { mediaByProject, categoriesByProject };
}

function mediaToImageAsset(item: Media): ImageAsset {
  return {
    src: mediaUrl(item) ?? PLACEHOLDER_COVER.src,
    alt:
      item.altText?.trim() ||
      "Interior project photograph",
    width: item.width ?? 1600,
    height: item.height ?? 1100,
    credit: item.storageProvider === "remote" ? "Photo via Pexels" : undefined,
  };
}

function resolveVideo(row: ProjectRow, items: Media[], cover: ImageAsset): ProjectVideo {
  if (row.videoUrl && isValidVideoUrl(row.videoUrl)) {
    const parsed = parseVideoUrl(row.videoUrl);
    if (parsed) return parsed;
  }
  const file = items.find((item) => item.mediaType === "video");
  const src = file ? mediaUrl(file) : null;
  if (src) {
    return { kind: "file", src, poster: cover.src };
  }
  return null;
}

function toPublicProject(
  row: ProjectRow,
  relations: Relations,
): PublicProject {
  const items = relations.mediaByProject.get(row.id) ?? [];
  const categoryRows = relations.categoriesByProject.get(row.id) ?? [];

  const images = items.filter((item) => item.mediaType === "image");
  const gallery = images.map(mediaToImageAsset);
  const coverItem =
    images.find((item) => item.id === row.coverMediaId) ?? images[0];
  const cover = coverItem ? mediaToImageAsset(coverItem) : PLACEHOLDER_COVER;

  const beforeAfter = row.beforeAfter as
    | { before: ImageAsset; after: ImageAsset }
    | null
    | undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location ?? "",
    propertyType: row.propertyType ?? "",
    year: row.completionDate ?? "",
    area: row.area ?? undefined,
    categories: categoryRows.map((category) => category.slug),
    cover,
    gallery,
    summary: row.shortDescription,
    overview: row.description,
    brief: row.brief ?? "",
    concept: row.concept ?? "",
    challenges: (row.challenges as ChallengeSolution[] | null) ?? [],
    materials: (row.materials as string[] | null) ?? [],
    palette: (row.palette as ColorSwatch[] | null) ?? [],
    outcomes: (row.outcomes as string[] | null) ?? [],
    beforeAfter: beforeAfter ?? undefined,
    featured: row.featured,
    status: row.status,
    mediaType: row.mediaType,
    video: resolveVideo(row, items, cover),
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  };
}

/* ------------------------------------------------------------------ */
/* Public queries                                                     */
/* ------------------------------------------------------------------ */

function publishedWhere(): SQL | undefined {
  return eq(projectsTable.status, "published");
}

function categoryFilter(categoryId: string): SQL {
  return sql`exists (
    select 1 from project_categories pc
    where pc.project_id = ${projectsTable.id} and pc.category_id = ${categoryId}
  )`;
}

export async function listPublishedProjects(options: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  items: PublicProject[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const db = getDb();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;

  const conditions: (SQL | undefined)[] = [publishedWhere()];

  let categoryId: string | undefined;
  if (options.categorySlug && options.categorySlug !== "all") {
    const matching = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, options.categorySlug))
      .limit(1);
    categoryId = matching[0]?.id;
    if (!categoryId) {
      return { items: [], total: 0, page: 1, pageCount: 0 };
    }
    conditions.push(categoryFilter(categoryId));
  }

  const where = and(...conditions.filter(Boolean));

  const countRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectsTable)
    .where(where);
  const total = countRows[0]?.count ?? 0;

  const rows = await db
    .select()
    .from(projectsTable)
    .where(where)
    .orderBy(desc(projectsTable.publishedAt), desc(projectsTable.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const relations = await loadRelations(rows.map((row) => row.id));

  return {
    items: rows.map((row) => toPublicProject(row, relations)),
    total,
    page,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function getFeaturedProjects(limit = 6): Promise<PublicProject[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(projectsTable)
    .where(and(publishedWhere(), eq(projectsTable.featured, true)))
    .orderBy(desc(projectsTable.publishedAt), desc(projectsTable.createdAt))
    .limit(limit);

  const relations = await loadRelations(rows.map((row) => row.id));
  return rows.map((row) => toPublicProject(row, relations));
}

export async function getProjectBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<PublicProject | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.status !== "published" && !options.includeUnpublished) return null;

  const relations = await loadRelations([row.id]);
  return toPublicProject(row, relations);
}

export async function getRelatedProjects(
  slug: string,
  limit = 3,
): Promise<PublicProject[]> {
  const db = getDb();
  const current = await getProjectBySlug(slug);
  if (!current) return [];

  const categoryIds = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(inArray(categoriesTable.slug, current.categories));

  let rows: ProjectRow[] = [];
  if (categoryIds.length > 0) {
    rows = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          publishedWhere(),
          sql`${projectsTable.id} <> ${current.id}`,
          sql`exists (
            select 1 from project_categories pc
            where pc.project_id = ${projectsTable.id}
              and pc.category_id in (${sql.join(
                categoryIds.map((entry) => sql`${entry.id}`),
                sql`, `,
              )})
          )`,
        ),
      )
      .orderBy(desc(projectsTable.publishedAt))
      .limit(limit);
  }

  if (rows.length < limit) {
    const seen = new Set(rows.map((row) => row.id));
    const fillers = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          publishedWhere(),
          sql`${projectsTable.id} <> ${current.id}`,
          rows.length > 0
            ? sql`${projectsTable.id} not in (${sql.join(
                [...seen].map((id) => sql`${id}`),
                sql`, `,
              )})`
            : undefined,
        ),
      )
      .orderBy(desc(projectsTable.publishedAt))
      .limit(limit - rows.length);
    rows = [...rows, ...fillers];
  }

  const relations = await loadRelations(rows.map((row) => row.id));
  return rows.map((row) => toPublicProject(row, relations));
}

/** Categories used by at least one published project (for public filters). */
export async function getPublishedCategoryFilters(): Promise<
  { id: string; slug: string; name: string }[]
> {
  const db = getDb();
  return db
    .selectDistinct({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
    })
    .from(categoriesTable)
    .innerJoin(
      projectCategoriesTable,
      eq(categoriesTable.id, projectCategoriesTable.categoryId),
    )
    .innerJoin(projectsTable, eq(projectsTable.id, projectCategoriesTable.projectId))
    .where(publishedWhere())
    .orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));
}

/* ------------------------------------------------------------------ */
/* Admin queries                                                      */
/* ------------------------------------------------------------------ */

export interface AdminProjectListItem {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  location: string | null;
  completionDate: string | null;
  mediaType: "image" | "video" | "mixed";
  updatedAt: Date;
  publishedAt: Date | null;
  categoryLabels: string[];
  coverUrl: string | null;
}

export async function listAdminProjects(query: ProjectListQuery): Promise<{
  items: AdminProjectListItem[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const db = getDb();
  const conditions: (SQL | undefined)[] = [];

  if (query.status !== "all") {
    conditions.push(eq(projectsTable.status, query.status));
  }
  if (query.q) {
    const pattern = `%${query.q.replace(/[%_]/g, (match) => `\\${match}`)}%`;
    conditions.push(sql`${projectsTable.title} like ${pattern} escape '\\'`);
  }
  if (query.category) {
    const matching = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, query.category))
      .limit(1);
    if (matching[0]) {
      conditions.push(categoryFilter(matching[0].id));
    } else {
      conditions.push(sql`1 = 0`);
    }
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const countRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectsTable)
    .where(where);
  const total = countRows[0]?.count ?? 0;

  const pageSize = 20;
  const rows = await db
    .select()
    .from(projectsTable)
    .where(where)
    .orderBy(desc(projectsTable.updatedAt))
    .limit(pageSize)
    .offset((query.page - 1) * pageSize);

  const relations = await loadRelations(rows.map((row) => row.id));

  const items: AdminProjectListItem[] = rows.map((row) => {
    const items = relations.mediaByProject.get(row.id) ?? [];
    const cover =
      items.find((item) => item.id === row.coverMediaId) ??
      items.find((item) => item.mediaType === "image");
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      featured: row.featured,
      location: row.location,
      completionDate: row.completionDate,
      mediaType: row.mediaType,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt,
      categoryLabels: (relations.categoriesByProject.get(row.id) ?? []).map(
        (category) => category.name,
      ),
      coverUrl: cover ? mediaUrl(cover) : null,
    };
  });

  return {
    items,
    total,
    page: query.page,
    pageCount: Math.ceil(total / pageSize),
  };
}

export interface AdminProjectDetail extends ProjectRow {
  categoryIds: string[];
  mediaItems: Media[];
}

export async function getProjectForEdit(
  id: string,
): Promise<AdminProjectDetail | null> {
  const db = getDb();
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;

  const relations = await loadRelations([row.id]);
  const links = await db
    .select()
    .from(projectCategoriesTable)
    .where(eq(projectCategoriesTable.projectId, row.id));

  return {
    ...row,
    categoryIds: links.map((link) => link.categoryId),
    mediaItems: relations.mediaByProject.get(row.id) ?? [],
  };
}

export async function isSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  if (!rows[0]) return true;
  return excludeId ? rows[0].id === excludeId : false;
}

export async function getDashboardStats() {
  const db = getDb();
  const [total, published, draft, featured] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projectsTable),
    db
      .select({ count: sql<number>`count(*)` })
      .from(projectsTable)
      .where(eq(projectsTable.status, "published")),
    db
      .select({ count: sql<number>`count(*)` })
      .from(projectsTable)
      .where(eq(projectsTable.status, "draft")),
    db
      .select({ count: sql<number>`count(*)` })
      .from(projectsTable)
      .where(eq(projectsTable.featured, true)),
  ]);

  return {
    total: total[0]?.count ?? 0,
    published: published[0]?.count ?? 0,
    draft: draft[0]?.count ?? 0,
    featured: featured[0]?.count ?? 0,
  };
}

/* ------------------------------------------------------------------ */
/* Mutations                                                          */
/* ------------------------------------------------------------------ */

async function validateCategories(
  primaryId: string,
  additionalIds: string[],
): Promise<{ ok: true; ids: string[] } | { ok: false; fieldErrors: Record<string, string[]> }> {
  const db = getDb();
  const unique = [...new Set([primaryId, ...additionalIds].filter(Boolean))];
  const rows = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(inArray(categoriesTable.id, unique));
  if (rows.length !== unique.length) {
    return {
      ok: false,
      fieldErrors: { categoryId: ["One or more categories no longer exist."] },
    };
  }
  if (!unique.includes(primaryId)) {
    return {
      ok: false,
      fieldErrors: { categoryId: ["Choose a primary category."] },
    };
  }
  return { ok: true, ids: unique };
}

async function validateMedia(
  input: ProjectFormValues,
  projectId: string | null,
): Promise<{ ok: true; items: Media[] } | { ok: false; fieldErrors: Record<string, string[]> }> {
  const db = getDb();
  const mediaIds = input.mediaIds ?? [];
  const ids = [...new Set(mediaIds)];
  if (ids.length === 0) {
    if (input.coverMediaId) {
      return {
        ok: false,
        fieldErrors: { coverMediaId: ["Add at least one image before choosing a cover."] },
      };
    }
    return { ok: true, items: [] };
  }

  const rows = await db
    .select()
    .from(mediaTable)
    .where(inArray(mediaTable.id, ids));

  if (rows.length !== ids.length) {
    return {
      ok: false,
      fieldErrors: { mediaIds: ["One or more media files are no longer available."] },
    };
  }

  const invalid = rows.find(
    (row) => row.projectId !== null && row.projectId !== projectId,
  );
  if (invalid) {
    return {
      ok: false,
      fieldErrors: { mediaIds: ["A media file belongs to another project."] },
    };
  }

  if (input.coverMediaId && !ids.includes(input.coverMediaId)) {
    return {
      ok: false,
      fieldErrors: { coverMediaId: ["Choose the cover from the project's images."] },
    };
  }

  if (input.coverMediaId) {
    const cover = rows.find((row) => row.id === input.coverMediaId);
    if (!cover || cover.mediaType !== "image") {
      return {
        ok: false,
        fieldErrors: { coverMediaId: ["The cover must be one of the project images."] },
      };
    }
  }

  const byId = new Map(rows.map((row) => [row.id, row]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((row): row is Media => Boolean(row));

  return { ok: true, items: ordered };
}

function resolveBeforeAfter(
  input: ProjectFormValues,
  items: Media[],
): { before: ImageAsset; after: ImageAsset } | null {
  const beforeId = input.beforeAfterMediaIds?.before;
  const afterId = input.beforeAfterMediaIds?.after;
  if (!beforeId || !afterId) return null;
  const before = items.find((item) => item.id === beforeId && item.mediaType === "image");
  const after = items.find((item) => item.id === afterId && item.mediaType === "image");
  if (!before || !after) return null;
  return { before: mediaToImageAsset(before), after: mediaToImageAsset(after) };
}

function pickCoverId(input: ProjectFormValues, items: Media[]): string | null {
  if (input.coverMediaId) return input.coverMediaId;
  const firstImage = items.find((item) => item.mediaType === "image");
  return firstImage?.id ?? null;
}

export async function createProject(
  input: ProjectFormValues,
): Promise<ActionResult> {
  const db = getDb();

  if (!(await isSlugAvailable(input.slug))) {
    return {
      ok: false,
      fieldErrors: { slug: ["This slug is already in use."] },
    };
  }

  const categoryCheck = await validateCategories(
    input.categoryId,
    input.additionalCategoryIds ?? [],
  );
  if (!categoryCheck.ok) return { ok: false, fieldErrors: categoryCheck.fieldErrors };

  const mediaCheck = await validateMedia(input, null);
  if (!mediaCheck.ok) return { ok: false, fieldErrors: mediaCheck.fieldErrors };

  const id = randomUUID();
  const items = mediaCheck.items;
  const now = new Date();

  try {
    db.transaction((tx) => {
      tx.insert(projectsTable)
        .values({
          id,
          title: input.title,
          slug: input.slug,
          shortDescription: input.shortDescription,
          description: input.description,
          coverMediaId: pickCoverId(input, items),
          categoryId: input.categoryId,
          location: input.location || null,
          completionDate: input.completionDate || null,
          propertyType: input.propertyType || null,
          area: input.area || null,
          mediaType: input.mediaType,
          videoUrl: input.videoUrl || null,
          brief: input.brief || null,
          concept: input.concept || null,
          challenges: input.challenges ?? [],
          materials: input.materials ?? [],
          palette: input.palette ?? [],
          outcomes: input.outcomes ?? [],
          beforeAfter: resolveBeforeAfter(input, items),
          status: input.status,
          featured: input.featured,
          publishedAt: input.status === "published" ? now : null,
          createdAt: now,
          updatedAt: now,
        })
        .run();

      tx.insert(projectCategoriesTable)
        .values(
          categoryCheck.ids.map((categoryId) => ({
            projectId: id,
            categoryId,
            isPrimary: categoryId === input.categoryId,
          })),
        )
        .run();

      if (items.length > 0) {
        for (const [index, item] of items.entries()) {
          tx.update(mediaTable)
            .set({ projectId: id, sortOrder: index })
            .where(eq(mediaTable.id, item.id))
            .run();
        }
      }
    });
  } catch (error) {
    console.error("[projects] create failed", error);
    return { ok: false, error: "Could not save the project. Please try again." };
  }

  return { ok: true, id };
}

export async function updateProject(
  id: string,
  input: ProjectFormValues,
): Promise<ActionResult> {
  const db = getDb();

  const existing = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!existing[0]) {
    return { ok: false, error: "Project not found." };
  }

  if (!(await isSlugAvailable(input.slug, id))) {
    return {
      ok: false,
      fieldErrors: { slug: ["This slug is already in use."] },
    };
  }

  const categoryCheck = await validateCategories(
    input.categoryId,
    input.additionalCategoryIds ?? [],
  );
  if (!categoryCheck.ok) return { ok: false, fieldErrors: categoryCheck.fieldErrors };

  const mediaCheck = await validateMedia(input, id);
  if (!mediaCheck.ok) return { ok: false, fieldErrors: mediaCheck.fieldErrors };

  const items = mediaCheck.items;

  const currentRows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  const current = currentRows[0];
  if (!current) return { ok: false, error: "Project not found." };

  const keptIds = new Set(input.mediaIds ?? []);
  const orphanMedia = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.projectId, id));
  const removedMedia = orphanMedia.filter((item) => !keptIds.has(item.id));

  const now = new Date();

  try {
    db.transaction((tx) => {
      tx.update(projectsTable)
        .set({
          title: input.title,
          slug: input.slug,
          shortDescription: input.shortDescription,
          description: input.description,
          coverMediaId: pickCoverId(input, items),
          categoryId: input.categoryId,
          location: input.location || null,
          completionDate: input.completionDate || null,
          propertyType: input.propertyType || null,
          area: input.area || null,
          mediaType: input.mediaType,
          videoUrl: input.videoUrl || null,
          brief: input.brief || null,
          concept: input.concept || null,
          challenges: input.challenges ?? [],
          materials: input.materials ?? [],
          palette: input.palette ?? [],
          outcomes: input.outcomes ?? [],
          beforeAfter: resolveBeforeAfter(input, items),
          status: input.status,
          featured: input.featured,
          publishedAt:
            input.status === "published"
              ? (current.publishedAt ?? now)
              : null,
          updatedAt: now,
        })
        .where(eq(projectsTable.id, id))
        .run();

      tx.delete(projectCategoriesTable)
        .where(eq(projectCategoriesTable.projectId, id))
        .run();

      tx.insert(projectCategoriesTable)
        .values(
          categoryCheck.ids.map((categoryId) => ({
            projectId: id,
            categoryId,
            isPrimary: categoryId === input.categoryId,
          })),
        )
        .run();

      if (items.length > 0) {
        for (const [index, item] of items.entries()) {
          tx.update(mediaTable)
            .set({ projectId: id, sortOrder: index })
            .where(eq(mediaTable.id, item.id))
            .run();
        }
      }

      if (removedMedia.length > 0) {
        tx.delete(mediaTable)
          .where(
            inArray(
              mediaTable.id,
              removedMedia.map((item) => item.id),
            ),
          )
          .run();
      }
    });
  } catch (error) {
    console.error("[projects] update failed", error);
    return { ok: false, error: "Could not update the project. Please try again." };
  }

  // Best-effort removal of local files belonging to detached media.
  await deleteMediaFiles(removedMedia);

  return { ok: true, id };
}

async function deleteMediaFiles(items: Media[]): Promise<void> {
  const { getStorage } = await import("@/lib/storage");
  const storage = getStorage();
  await Promise.all(
    items
      .filter((item) => item.storageProvider === "local")
      .map((item) => storage.delete(item.storageKey).catch(() => undefined)),
  );
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const db = getDb();

  const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  const row = rows[0];
  if (!row) return { ok: false, error: "Project not found." };

  const mediaRows = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.projectId, id));

  try {
    db.transaction((tx) => {
      tx.delete(projectsTable).where(eq(projectsTable.id, id)).run();
    });
  } catch (error) {
    console.error("[projects] delete failed", error);
    return { ok: false, error: "Could not delete the project." };
  }

  await deleteMediaFiles(mediaRows);
  return { ok: true };
}

export async function setProjectStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  const db = getDb();
  const rows = await db
    .select({ id: projectsTable.id, status: projectsTable.status, publishedAt: projectsTable.publishedAt })
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return { ok: false, error: "Project not found." };

  const now = new Date();
  await db
    .update(projectsTable)
    .set({
      status,
      publishedAt: status === "published" ? (row.publishedAt ?? now) : null,
      updatedAt: now,
    })
    .where(eq(projectsTable.id, id));

  return { ok: true };
}

export async function setProjectFeatured(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  const db = getDb();
  const rows = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!rows[0]) return { ok: false, error: "Project not found." };

  await db
    .update(projectsTable)
    .set({ featured, updatedAt: new Date() })
    .where(eq(projectsTable.id, id));

  return { ok: true };
}

/** Detach-and-remove media that is no longer part of a project's list. */
export async function removeProjectMedia(
  projectId: string,
  mediaIds: string[],
): Promise<ActionResult> {
  const db = getDb();
  const rows = await db
    .select()
    .from(mediaTable)
    .where(
      and(
        eq(mediaTable.projectId, projectId),
        inArray(mediaTable.id, mediaIds),
      ),
    );
  if (rows.length === 0) return { ok: true };

  try {
    db.transaction((tx) => {
      for (const row of rows) {
        tx.delete(mediaTable).where(eq(mediaTable.id, row.id)).run();
      }
      // Clear dangling cover reference.
      const coverIds = rows.map((row) => row.id);
      tx.update(projectsTable)
        .set({ coverMediaId: null })
        .where(
          and(
            eq(projectsTable.id, projectId),
            inArray(projectsTable.coverMediaId, coverIds),
          ),
        )
        .run();
    });
  } catch (error) {
    console.error("[media] remove failed", error);
    return { ok: false, error: "Could not remove the media." };
  }

  await deleteMediaFiles(rows);
  return { ok: true };
}

export { PLACEHOLDER_COVER };
