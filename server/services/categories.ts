import { randomUUID } from "node:crypto";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  categories as categoriesTable,
  projectCategories as projectCategoriesTable,
  projects as projectsTable,
} from "@/db/schema";
import type { CategoryFormValues } from "@/server/validators/category";
import type { ActionResult } from "@/server/services/projects";

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function listCategories(): Promise<CategoryWithCount[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      sortOrder: categoriesTable.sortOrder,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
      projectCount: sql<number>`(
        select count(*) from project_categories pc
        where pc.category_id = ${categoriesTable.id}
      )`,
    })
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));

  return rows;
}

export async function isCategorySlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .limit(1);
  if (!rows[0]) return true;
  return excludeId ? rows[0].id === excludeId : false;
}

export async function createCategory(values: CategoryFormValues): Promise<ActionResult> {
  const db = getDb();

  if (!(await isCategorySlugAvailable(values.slug))) {
    return { ok: false, fieldErrors: { slug: ["This slug is already in use."] } };
  }

  try {
    await db.insert(categoriesTable).values({
      id: randomUUID(),
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      sortOrder: values.sortOrder ?? 0,
    });
  } catch (error) {
    console.error("[categories] create failed", error);
    return { ok: false, error: "Could not create the category." };
  }

  return { ok: true };
}

export async function updateCategory(
  id: string,
  values: CategoryFormValues,
): Promise<ActionResult> {
  const db = getDb();

  const existing = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .limit(1);
  if (!existing[0]) return { ok: false, error: "Category not found." };

  if (!(await isCategorySlugAvailable(values.slug, id))) {
    return { ok: false, fieldErrors: { slug: ["This slug is already in use."] } };
  }

  try {
    await db
      .update(categoriesTable)
      .set({
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        sortOrder: values.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(categoriesTable.id, id));
  } catch (error) {
    console.error("[categories] update failed", error);
    return { ok: false, error: "Could not update the category." };
  }

  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const db = getDb();

  const [links, primaries] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(projectCategoriesTable)
      .where(eq(projectCategoriesTable.categoryId, id)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(projectsTable)
      .where(eq(projectsTable.categoryId, id)),
  ]);

  const inUse = (links[0]?.count ?? 0) + (primaries[0]?.count ?? 0);
  if (inUse > 0) {
    return {
      ok: false,
      error: "This category is still used by projects. Reassign those projects first.",
    };
  }

  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  } catch (error) {
    console.error("[categories] delete failed", error);
    return { ok: false, error: "Could not delete the category." };
  }

  return { ok: true };
}
