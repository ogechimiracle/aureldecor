"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/session";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/server/services/categories";
import type { ActionResult } from "@/server/services/projects";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/server/validators/category";

function toFieldErrors(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] = fieldErrors[field] ?? [];
    fieldErrors[field].push(issue.message);
  }
  return fieldErrors;
}

function revalidatePortfolio(): void {
  revalidatePath("/portfolio");
  revalidatePath("/admin/categories");
}

export async function createCategoryAction(
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();

  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const result = await createCategory(parsed.data as CategoryFormValues);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function updateCategoryAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();
  if (!id) return { ok: false, error: "Missing category id." };

  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const result = await updateCategory(id, parsed.data as CategoryFormValues);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireOwner();
  if (!id) return { ok: false, error: "Missing category id." };

  const result = await deleteCategory(id);
  if (result.ok) revalidatePortfolio();
  return result;
}
