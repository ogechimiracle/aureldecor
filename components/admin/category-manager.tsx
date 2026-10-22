"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/server/actions/categories";
import {
  categoryFormDefaults,
  categoryFormSchema,
  type CategoryFormValues,
} from "@/server/validators/category";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  projectCount: number;
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormValues>,
    defaultValues: categoryFormDefaults,
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormValues>,
    defaultValues: categoryFormDefaults,
  });

  function onCreate(values: CategoryFormValues) {
    startTransition(async () => {
      const result = await createCategoryAction(values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              createForm.setError(field as keyof CategoryFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        toast.error(result.error ?? "Could not create the category.");
        return;
      }
      toast.success("Category created.");
      createForm.reset(categoryFormDefaults);
      router.refresh();
    });
  }

  function startEdit(category: CategoryRow) {
    setEditingId(category.id);
    editForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sortOrder: category.sortOrder,
    });
  }

  function onEdit(values: CategoryFormValues) {
    if (!editingId) return;
    startTransition(async () => {
      const result = await updateCategoryAction(editingId, values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              editForm.setError(field as keyof CategoryFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          }
        }
        toast.error(result.error ?? "Could not update the category.");
        return;
      }
      toast.success("Category updated.");
      setEditingId(null);
      router.refresh();
    });
  }

  function onDelete(category: CategoryRow) {
    if (
      !window.confirm(
        `Delete "${category.name}"? Projects keep existing, but the filter disappears.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (result.ok) {
        toast.success("Category deleted.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Could not delete the category.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={createForm.handleSubmit(onCreate)}
        noValidate
        className="space-y-4 rounded-sm border border-line bg-card p-6"
      >
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-terracotta" aria-hidden />
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-mute">
            New category
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category-name">Name *</Label>
            <Input id="category-name" autoComplete="off" {...createForm.register("name")} />
            <FieldError>{createForm.formState.errors.name?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="category-slug">Slug *</Label>
            <Input id="category-slug" autoComplete="off" {...createForm.register("slug")} />
            <FieldError>{createForm.formState.errors.slug?.message}</FieldError>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
          <div>
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              rows={2}
              {...createForm.register("description")}
            />
            <FieldError>
              {createForm.formState.errors.description?.message}
            </FieldError>
          </div>
          <div>
            <Label htmlFor="category-sort">Sort order</Label>
            <Input
              id="category-sort"
              type="number"
              min={0}
              max={9999}
              {...createForm.register("sortOrder")}
            />
            <FieldError>
              {createForm.formState.errors.sortOrder?.message}
            </FieldError>
          </div>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add category
        </Button>
      </form>

      <div className="overflow-hidden rounded-sm border border-line bg-card">
        <ul className="divide-y divide-line">
          {categories.map((category) => (
            <li key={category.id} className="px-5 py-4">
              {editingId === category.id ? (
                <form
                  onSubmit={editForm.handleSubmit(onEdit)}
                  noValidate
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-mute">
                      Edit category
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      aria-label="Cancel editing"
                      className="rounded-sm p-1.5 text-ink-mute hover:bg-sand/60 hover:text-ink"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="edit-name">Name *</Label>
                      <Input id="edit-name" autoComplete="off" {...editForm.register("name")} />
                      <FieldError>{editForm.formState.errors.name?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="edit-slug">Slug *</Label>
                      <Input id="edit-slug" autoComplete="off" {...editForm.register("slug")} />
                      <FieldError>{editForm.formState.errors.slug?.message}</FieldError>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        rows={2}
                        {...editForm.register("description")}
                      />
                      <FieldError>
                        {editForm.formState.errors.description?.message}
                      </FieldError>
                    </div>
                    <div>
                      <Label htmlFor="edit-sort">Sort order</Label>
                      <Input
                        id="edit-sort"
                        type="number"
                        min={0}
                        max={9999}
                        {...editForm.register("sortOrder")}
                      />
                      <FieldError>
                        {editForm.formState.errors.sortOrder?.message}
                      </FieldError>
                    </div>
                  </div>

                  <Button type="submit" size="sm" disabled={pending}>
                    {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save changes
                  </Button>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{category.name}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-mute">
                      /{category.slug} · {category.projectCount} project
                      {category.projectCount === 1 ? "" : "s"}
                      {category.description ? ` · ${category.description}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending || category.projectCount > 0}
                      title={
                        category.projectCount > 0
                          ? "Projects still use this category."
                          : "Delete category"
                      }
                      onClick={() => onDelete(category)}
                      className="inline-flex h-9 items-center rounded-sm border border-line-strong px-2.5 text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
