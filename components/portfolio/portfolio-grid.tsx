"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategorySlug } from "@/types";

interface PortfolioGridProps {
  projects: Project[];
  categories: { slug: string; label: string }[];
}

export function PortfolioGrid({ projects, categories }: PortfolioGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const filters: { slug: ProjectCategorySlug | "all"; label: string }[] = [
    { slug: "all", label: "All Projects" },
    ...categories.map((category) => ({
      slug: category.slug as ProjectCategorySlug,
      label: category.label,
    })),
  ];

  const raw = searchParams.get("category");
  const active = filters.some((filter) => filter.slug === raw)
    ? (raw as ProjectCategorySlug)
    : "all";

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) => project.categories.includes(active));
  }, [projects, active]);

  function selectFilter(slug: ProjectCategorySlug | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const qs = params.toString();
    router.replace(qs ? `/portfolio?${qs}` : "/portfolio", { scroll: false });
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2 border-y border-line bg-ivory/60 py-4"
      >
        {filters.map((filter) => {
          const isActive = active === filter.slug;
          // Hidden field accessible check — expose pressed state for screen readers.
          return (
            <button
              key={filter.slug}
              type="button"
              onClick={() => selectFilter(filter.slug)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-xs font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                isActive
                  ? "border-ink bg-ink text-ivory"
                  : "border-line-strong bg-card text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {filter.label}
              <span className="sr-only">
                {isActive ? " (current)" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-line-strong bg-ivory py-24 text-center">
          <p className="font-serif text-2xl">No projects in this category yet.</p>
          <p className="mt-2 max-w-md text-sm text-ink-soft">
            Try another filter, or get in touch — new work is added regularly.
          </p>
        </div>
      ) : (
        <motion.div
          layout={!reduceMotion}
          className="grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard
                  project={project}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}