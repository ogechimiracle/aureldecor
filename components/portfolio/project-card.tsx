import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/data/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  sizes?: string;
  aspect?: string;
  className?: string;
}

export function ProjectCard({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  aspect = "aspect-4/5",
  className,
}: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn("group block", className)}
    >
      <div className={cn("relative overflow-hidden rounded-sm bg-sand", aspect)}>
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-90"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap gap-2">
            {project.categories.slice(0, 2).map((category) => (
              <Badge
                key={category}
                className="border-onmedia/25 bg-scrim/40 text-onmedia backdrop-blur-sm"
              >
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </div>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-onmedia">
            {project.title}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-onmedia/75">
            {project.location} · {project.propertyType}
          </p>
        </div>
        <span className="absolute right-4 top-4 inline-flex size-10 translate-y-1 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
