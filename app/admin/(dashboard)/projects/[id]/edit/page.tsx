import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import type { MediaItem } from "@/components/admin/media-manager";
import { listCategories } from "@/server/services/categories";
import { getProjectForEdit } from "@/server/services/projects";
import { mediaUrl } from "@/lib/storage";
import { projectFormDefaults, type ProjectFormValues } from "@/server/validators/project";

export const metadata = { title: "Edit Project" };

function toFormValues(detail: NonNullable<Awaited<ReturnType<typeof getProjectForEdit>>>): ProjectFormValues {
  const primary = detail.categoryIds[0] ?? "";
  const ordered = [...detail.mediaItems].sort((a, b) => a.sortOrder - b.sortOrder);

  const beforeSrc = detail.beforeAfter?.before.src;
  const afterSrc = detail.beforeAfter?.after.src;
  const before =
    ordered.find((item) => mediaUrl(item) === beforeSrc)?.id ?? null;
  const after =
    ordered.find((item) => mediaUrl(item) === afterSrc)?.id ?? null;

  return {
    ...projectFormDefaults,
    title: detail.title,
    slug: detail.slug,
    shortDescription: detail.shortDescription,
    description: detail.description,
    categoryId: primary,
    additionalCategoryIds: detail.categoryIds.filter((id) => id !== primary),
    location: detail.location ?? "",
    completionDate: detail.completionDate ?? "",
    propertyType: detail.propertyType ?? "",
    area: detail.area ?? "",
    mediaType: detail.mediaType,
    videoUrl: detail.videoUrl ?? "",
    brief: detail.brief ?? "",
    concept: detail.concept ?? "",
    challenges: detail.challenges ?? [],
    materials: detail.materials ?? [],
    palette: detail.palette ?? [],
    outcomes: detail.outcomes ?? [],
    coverMediaId: detail.coverMediaId,
    mediaIds: ordered.map((item) => item.id),
    beforeAfterMediaIds: { before, after },
    status: detail.status,
    featured: detail.featured,
  };
}

function toItem(item: {
  id: string;
  mediaType: "image" | "video";
  altText: string | null;
  originalFilename: string | null;
  mimeType: string;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  storageProvider: "local" | "remote";
  storageKey: string;
}): MediaItem {
  return {
    id: item.id,
    mediaType: item.mediaType,
    url: mediaUrl(item) ?? "",
    altText: item.altText ?? "",
    originalFilename: item.originalFilename,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    width: item.width,
    height: item.height,
    sortOrder: item.sortOrder,
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, categories] = await Promise.all([
    getProjectForEdit(id),
    listCategories(),
  ]);

  if (!detail) notFound();

  return (
    <ProjectForm
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
      }))}
      project={{
        id: detail.id,
        values: toFormValues(detail),
        media: detail.mediaItems.map(toItem),
      }}
    />
  );
}
