"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { toast } from "sonner";
import {
  MediaManager,
  type MediaItem,
  type MediaSelection,
} from "@/components/admin/media-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProjectAction, updateProjectAction } from "@/server/actions/projects";
import {
  projectFormSchema,
  projectFormDefaults,
  type ProjectFormValues,
} from "@/server/validators/project";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  id: string;
  name: string;
}

interface ProjectFormProps {
  categories: CategoryOption[];
  project?: {
    id: string;
    values: ProjectFormValues;
    media: MediaItem[];
  };
}

const sectionTitle =
  "text-xs font-medium uppercase tracking-[0.16em] text-ink-mute";

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? " *" : ""}
      </Label>
      {hint ? <p className="mt-1 text-xs text-ink-mute">{hint}</p> : null}
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function ProjectForm({ categories, project }: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues = useMemo<ProjectFormValues>(
    () => project?.values ?? projectFormDefaults,
    [project],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as Resolver<ProjectFormValues>,
    defaultValues,
    mode: "onBlur",
  });

  const challengeFields = useFieldArray({ control, name: "challenges" });
  const paletteFields = useFieldArray({ control, name: "palette" });

  const titleValue = useWatch({ control, name: "title" });
  const mediaTypeValue = useWatch({ control, name: "mediaType" });
  const mediaIds = useWatch({ control, name: "mediaIds" });
  const coverMediaId = useWatch({ control, name: "coverMediaId" });
  const beforeAfterMediaIds = useWatch({ control, name: "beforeAfterMediaIds" });
  const additionalCategoryIds = useWatch({ control, name: "additionalCategoryIds" });

  // Keep the slug in step with the title until it has been edited by hand
  // (auto-slug only applies while creating a new project).
  useEffect(() => {
    if (project || !titleValue || dirtyFields.slug) return;
    const next = slugify(titleValue);
    if (next === getValues("slug")) return;
    setValue("slug", next, { shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue, dirtyFields.slug]);

  const selection: MediaSelection = {
    mediaIds: mediaIds ?? [],
    coverMediaId: coverMediaId ?? null,
    beforeAfterMediaIds:
      beforeAfterMediaIds ?? { before: null, after: null },
  };

  function applySelection(next: MediaSelection) {
    setValue("mediaIds", next.mediaIds, { shouldDirty: true, shouldValidate: true });
    setValue("coverMediaId", next.coverMediaId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("beforeAfterMediaIds", next.beforeAfterMediaIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onSubmit(values: ProjectFormValues) {
    setServerError(null);

    if (values.mediaType !== "image" && !values.videoUrl) {
      setError("videoUrl", {
        type: "server",
        message: "Add a video URL for video projects.",
      });
      return;
    }

    startTransition(async () => {
      const result = project
        ? await updateProjectAction(project.id, values)
        : await createProjectAction(values);

      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(field as keyof ProjectFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        setServerError(result.error ?? "Please review the highlighted fields.");
        return;
      }

      toast.success(project ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {serverError ? (
        <div
          role="alert"
          className="rounded-sm border border-terracotta/40 bg-terracotta/5 px-4 py-3 text-sm text-terracotta-dark"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-terracotta">
            {project ? "Edit project" : "New project"}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            {titleValue || (project ? "Edit project" : "Create a project")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild type="button" variant="outline">
            <Link href="/admin/projects">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {pending ? "Saving…" : "Save project"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <section className="space-y-5 rounded-sm border border-line bg-card p-6">
            <h2 className={sectionTitle}>Basics</h2>

            <Field label="Title" htmlFor="title" required error={errors.title?.message}>
              <Input id="title" autoComplete="off" {...register("title")} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Slug"
                htmlFor="slug"
                required
                error={errors.slug?.message}
                hint="Used in the URL: /portfolio/your-slug"
              >
                <Input id="slug" autoComplete="off" {...register("slug")} />
              </Field>

              <Field
                label="Primary category"
                htmlFor="categoryId"
                required
                error={errors.categoryId?.message}
              >
                <Select id="categoryId" {...register("categoryId")}>
                  <option value="">Choose a category…</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Additional categories"
              htmlFor="additionalCategoryIds"
              hint="Optional — shows the project in more portfolio filters."
              error={errors.additionalCategoryIds?.message}
            >
              <div className="mt-1 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const checked = (additionalCategoryIds ?? []).includes(
                    category.id,
                  );
                  return (
                    <label
                      key={category.id}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                        checked
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line-strong text-ink-soft hover:border-ink",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        onChange={(event) => {
                          const list = new Set(
                            getValues("additionalCategoryIds") ?? [],
                          );
                          if (event.target.checked) list.add(category.id);
                          else list.delete(category.id);
                          setValue(
                            "additionalCategoryIds",
                            [...list],
                            { shouldDirty: true, shouldValidate: true },
                          );
                        }}
                        checked={checked}
                      />
                      {category.name}
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Short summary"
              htmlFor="shortDescription"
              required
              error={errors.shortDescription?.message}
              hint="Shown on portfolio cards and as the page description (max 300 characters)."
            >
              <Textarea id="shortDescription" rows={3} {...register("shortDescription")} />
            </Field>

            <Field
              label="Full description"
              htmlFor="description"
              required
              error={errors.description?.message}
            >
              <Textarea id="description" rows={10} {...register("description")} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location" htmlFor="location" error={errors.location?.message}>
                <Input id="location" autoComplete="off" placeholder="City or area" {...register("location")} />
              </Field>
              <Field
                label="Completion"
                htmlFor="completionDate"
                error={errors.completionDate?.message}
                hint="e.g. 2024 or March 2024"
              >
                <Input id="completionDate" autoComplete="off" {...register("completionDate")} />
              </Field>
              <Field
                label="Property type"
                htmlFor="propertyType"
                error={errors.propertyType?.message}
                hint="e.g. Apartment, Retail"
              >
                <Input id="propertyType" autoComplete="off" {...register("propertyType")} />
              </Field>
              <Field label="Area" htmlFor="area" error={errors.area?.message} hint="e.g. 140 m²">
                <Input id="area" autoComplete="off" {...register("area")} />
              </Field>
            </div>
          </section>

          <section className="space-y-5 rounded-sm border border-line bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className={sectionTitle}>Gallery & media</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="mediaType" className="text-xs text-ink-mute">
                  Presentation
                </label>
                <div className="w-40">
                  <Select
                    id="mediaType"
                    className="h-9 text-xs"
                    {...register("mediaType")}
                  >
                    <option value="image">Photos</option>
                    <option value="video">Video</option>
                    <option value="mixed">Photos + video</option>
                  </Select>
                </div>
              </div>
            </div>

            {mediaTypeValue !== "image" ? (
              <Field
                label="Video URL"
                htmlFor="videoUrl"
                required
                error={errors.videoUrl?.message}
                hint="YouTube, Vimeo or a direct .mp4/.webm link (https)."
              >
                <Input
                  id="videoUrl"
                  autoComplete="off"
                  placeholder="https://…"
                  {...register("videoUrl")}
                />
              </Field>
            ) : null}

            <MediaManager
              initialItems={project?.media ?? []}
              value={selection}
              onChange={applySelection}
            />
            <FieldError>{errors.mediaIds?.message}</FieldError>
            <FieldError>{errors.coverMediaId?.message}</FieldError>
          </section>

          <section className="space-y-5 rounded-sm border border-line bg-card p-6">
            <h2 className={sectionTitle}>Editorial story</h2>

            <Field label="Brief" htmlFor="brief" error={errors.brief?.message} hint="The client's ask, in your words.">
              <Textarea id="brief" rows={4} {...register("brief")} />
            </Field>

            <Field label="Concept" htmlFor="concept" error={errors.concept?.message}>
              <Textarea id="concept" rows={5} {...register("concept")} />
            </Field>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-mute">
                  Challenges & solutions
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    challengeFields.append({ challenge: "", solution: "" })
                  }
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
              <div className="mt-3 space-y-4">
                {challengeFields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 rounded-sm border border-line bg-ivory/50 p-4 sm:grid-cols-[1fr_1.4fr_auto]"
                  >
                    <div>
                      <Label htmlFor={`${field.id}-challenge`}>
                        Challenge {index + 1}
                      </Label>
                      <Textarea
                        id={`${field.id}-challenge`}
                        rows={3}
                        {...register(`challenges.${index}.challenge`)}
                      />
                      <FieldError>
                        {errors.challenges?.[index]?.challenge?.message}
                      </FieldError>
                    </div>
                    <div>
                      <Label htmlFor={`${field.id}-solution`}>Solution</Label>
                      <Textarea
                        id={`${field.id}-solution`}
                        rows={3}
                        {...register(`challenges.${index}.solution`)}
                      />
                      <FieldError>
                        {errors.challenges?.[index]?.solution?.message}
                      </FieldError>
                    </div>
                    <button
                      type="button"
                      onClick={() => challengeFields.remove(index)}
                      aria-label="Remove challenge"
                      className="mt-6 h-fit rounded-sm p-2 text-ink-mute transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={cn(sectionTitle, "mb-2")}>Materials</h3>
              <Controller
                control={control}
                name="materials"
                render={({ field }) => (
                  <Textarea
                    rows={4}
                    value={field.value.join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder={"One material per line, e.g.\nTravertine"}
                  />
                )}
              />
              <FieldError>{errors.materials?.message}</FieldError>
              <p className="mt-1 text-xs text-ink-mute">One material per line.</p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-mute">
                  Colour palette
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => paletteFields.append({ name: "", hex: "#E4DBCB" })}
                >
                  <Plus className="size-4" />
                  Add colour
                </Button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {paletteFields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-2 rounded-sm border border-line bg-ivory/50 p-3"
                  >
                    <div className="flex-1">
                      <Label htmlFor={`${field.id}-swatch-name`}>Name</Label>
                      <Input
                        id={`${field.id}-swatch-name`}
                        autoComplete="off"
                        placeholder="Warm limestone"
                        {...register(`palette.${index}.name`)}
                      />
                      <FieldError>{errors.palette?.[index]?.name?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor={`${field.id}-swatch-hex`}>Hex</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          aria-label="Pick colour"
                          className="h-11 w-10 cursor-pointer rounded-sm border border-line bg-card p-1"
                          value={
                            getValues(`palette.${index}.hex`) || "#E4DBCB"
                          }
                          onChange={(event) =>
                            setValue(`palette.${index}.hex`, event.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        />
                        <Input
                          id={`${field.id}-swatch-hex`}
                          className="w-28 font-mono"
                          autoComplete="off"
                          {...register(`palette.${index}.hex`)}
                        />
                      </div>
                      <FieldError>{errors.palette?.[index]?.hex?.message}</FieldError>
                    </div>
                    <button
                      type="button"
                      onClick={() => paletteFields.remove(index)}
                      aria-label="Remove colour"
                      className="mb-1 rounded-sm p-2 text-ink-mute transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={cn(sectionTitle, "mb-2")}>Outcomes</h3>
              <Controller
                control={control}
                name="outcomes"
                render={({ field }) => (
                  <Textarea
                    rows={4}
                    value={field.value.join("\n")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder={"One outcome per line, e.g.\n30% more natural light"}
                  />
                )}
              />
              <FieldError>{errors.outcomes?.message}</FieldError>
              <p className="mt-1 text-xs text-ink-mute">One outcome per line.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="space-y-5 rounded-sm border border-line bg-card p-6">
            <h2 className={sectionTitle}>Publishing</h2>

            <Field label="Status" htmlFor="status" error={errors.status?.message}>
              <Select id="status" {...register("status")}>
                <option value="draft">Draft — hidden from the site</option>
                <option value="published">Published — visible to visitors</option>
              </Select>
            </Field>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded-sm border border-line-strong accent-accent"
                {...register("featured")}
              />
              <span className="text-sm leading-relaxed text-ink-soft">
                Feature this project on the homepage.
                <FieldError>{errors.featured?.message}</FieldError>
              </span>
            </label>
          </section>

          <section className="rounded-sm border border-line bg-ivory/60 p-6">
            <h2 className={sectionTitle}>Tips</h2>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-soft">
              <li>
                Projects must be <strong>published</strong> to appear on the
                public portfolio — drafts stay private.
              </li>
              <li>
                The cover image is what visitors see first on the portfolio
                grid; pick a bright, wide shot.
              </li>
              <li>
                Reorder gallery photos with the arrows on each thumbnail —
                the first image sets the tone.
              </li>
              <li>
                Everything on this form is stored in SQLite and can be edited
                again at any time from the project list.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </form>
  );
}
