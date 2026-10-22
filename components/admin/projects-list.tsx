"use client";

import {
  Eye,
  Pencil,
  Plus,
  Star,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteProjectAction,
  setProjectFeaturedAction,
  setProjectStatusAction,
} from "@/server/actions/projects";
import type { ProjectListQuery } from "@/server/validators/project";
import { cn } from "@/lib/utils";

export interface AdminProjectRow {
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

interface ProjectsListProps {
  items: AdminProjectRow[];
  total: number;
  page: number;
  pageCount: number;
  categories: { id: string; name: string; slug: string }[];
  query: ProjectListQuery;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function ProjectsList({
  items,
  total,
  page,
  pageCount,
  categories,
  query,
}: ProjectsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(query.q ?? "");

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in patch)) next.delete("page");
    router.replace(`/admin/projects?${next.toString()}`);
  }

  function runAfter(action: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        router.refresh();
      } else {
        toast.error(result.error ?? "Action failed.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-terracotta">Portfolio</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Projects</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {total} project{total === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-medium uppercase tracking-[0.18em] text-on-accent transition-colors hover:bg-accent-strong"
        >
          <Plus className="size-4" aria-hidden />
          New project
        </Link>
      </div>

      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: searchValue.trim() || null });
        }}
      >
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by title…"
            aria-label="Search projects"
            className="h-11 w-full rounded-sm border border-line bg-card pl-9 pr-3.5 text-sm text-ink placeholder:text-ink-mute focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          />
        </div>

        <select
          value={query.status}
          onChange={(event) => updateParams({ status: event.target.value })}
          aria-label="Filter by status"
          className="h-11 rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>

        <select
          value={query.category ?? ""}
          onChange={(event) => updateParams({ category: event.target.value || null })}
          aria-label="Filter by category"
          className="h-11 rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </form>

      {items.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line-strong bg-card px-6 py-16 text-center">
          <p className="font-serif text-2xl text-ink">No projects found.</p>
          <p className="mt-2 text-sm text-ink-soft">
            {query.q || query.category || query.status !== "all"
              ? "Try clearing your filters, or create something new."
              : "Create your first project to build the portfolio."}
          </p>
          <Link
            href="/admin/projects/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-medium uppercase tracking-[0.18em] text-on-accent transition-colors hover:bg-accent-strong"
          >
            <Plus className="size-4" aria-hidden />
            New project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-card">
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap sm:px-5"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-line bg-ivory">
                  {item.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.coverUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-[0.6rem] text-ink-mute">
                      No image
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-mute">
                    /portfolio/{item.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em]",
                        item.status === "published"
                          ? "bg-olive/15 text-olive"
                          : "bg-gold/15 text-gold",
                      )}
                    >
                      {item.status}
                    </span>
                    {item.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-terracotta">
                        <Star className="size-3" aria-hidden /> Featured
                      </span>
                    ) : null}
                    {item.categoryLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-sand/70 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink-soft"
                      >
                        {label}
                      </span>
                    ))}
                    <span className="text-[0.7rem] text-ink-mute">
                      Updated {dateFormat.format(new Date(item.updatedAt))}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    title={
                      item.status === "published"
                        ? "Unpublish (keep as draft)"
                        : "Publish to the site"
                    }
                    disabled={pending}
                    onClick={() =>
                      runAfter(() =>
                        setProjectStatusAction(
                          item.id,
                          item.status === "published" ? "draft" : "published",
                        ),
                      )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                  >
                    <Eye className="size-3.5" aria-hidden />
                    {item.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    title={item.featured ? "Remove from featured" : "Feature on the homepage"}
                    disabled={pending}
                    onClick={() =>
                      runAfter(() =>
                        setProjectFeaturedAction(item.id, !item.featured),
                      )
                    }
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-sm border px-3 text-xs transition-colors disabled:opacity-50",
                      item.featured
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-line-strong text-ink-soft hover:border-ink hover:text-ink",
                    )}
                  >
                    <Star className="size-3.5" aria-hidden />
                    {item.featured ? "Featured" : "Feature"}
                  </button>

                  <Link
                    href={`/admin/projects/${item.id}/edit`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={pending}
                    title="Delete project"
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Delete "${item.title}"? This removes the project and its uploaded media. This cannot be undone.`,
                        )
                      ) {
                        return;
                      }
                      startTransition(async () => {
                        const result = await deleteProjectAction(item.id);
                        if (result.ok) {
                          toast.success("Project deleted.");
                          router.refresh();
                        } else {
                          toast.error(result.error ?? "Could not delete the project.");
                        }
                      });
                    }}
                    className="inline-flex h-9 items-center rounded-sm border border-line-strong px-2.5 text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta disabled:opacity-50"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pageCount > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => updateParams({ page: String(pageNumber) })}
                aria-current={pageNumber === page ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-sm border text-sm transition-colors",
                  pageNumber === page
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line-strong text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {pageNumber}
              </button>
            ),
          )}
        </div>
      ) : null}

      {pending ? (
        <span className="sr-only" role="status">
          Working…
        </span>
      ) : null}
    </div>
  );
}
