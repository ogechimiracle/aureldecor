import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects } from "@/server/services/projects";

const aspects = ["aspect-4/5", "aspect-3/4", "aspect-square", "aspect-4/5", "aspect-3/4", "aspect-square"];

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(6);

  if (projects.length === 0) return null;

  return (
    <Container className="py-20 md:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects, composed room by room."
          description="A selection of recent residential and commercial commissions. Each project is developed entirely in-house, from concept and space planning through to the final styling day."
        />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/portfolio">
            View full portfolio
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {projects.map((project, index) => (
          <Reveal
            key={project.slug}
            delay={(index % 3) * 0.08}
            className="break-inside-avoid"
          >
            <ProjectCard
              project={project}
              aspect={aspects[index % aspects.length]}
              priority={index < 2}
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
            />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
