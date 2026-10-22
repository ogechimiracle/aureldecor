"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/session";
import {
  createProject,
  deleteProject,
  removeProjectMedia,
  setProjectFeatured,
  setProjectStatus,
  updateProject,
  type ActionResult,
} from "@/server/services/projects";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "@/server/validators/project";

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
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/[slug]", "page");
  revalidatePath("/admin/projects");
}

/** Create a project (owner only). */
export async function createProjectAction(
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();

  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const result = await createProject(parsed.data as ProjectFormValues);
  if (result.ok) revalidatePortfolio();
  return result;
}

/** Update an existing project (owner only). */
export async function updateProjectAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();

  if (!id) return { ok: false, error: "Missing project id." };

  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const result = await updateProject(id, parsed.data as ProjectFormValues);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireOwner();
  if (!id) return { ok: false, error: "Missing project id." };

  const result = await deleteProject(id);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function setProjectStatusAction(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  await requireOwner();
  if (!id) return { ok: false, error: "Missing project id." };

  const result = await setProjectStatus(id, status);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function setProjectFeaturedAction(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  await requireOwner();
  if (!id) return { ok: false, error: "Missing project id." };

  const result = await setProjectFeatured(id, featured);
  if (result.ok) revalidatePortfolio();
  return result;
}

export async function removeProjectMediaAction(
  projectId: string,
  mediaId: string,
): Promise<ActionResult> {
  await requireOwner();
  if (!projectId || !mediaId) {
    return { ok: false, error: "Missing project or media id." };
  }

  const result = await removeProjectMedia(projectId, [mediaId]);
  if (result.ok) revalidatePortfolio();
  return result;
}
