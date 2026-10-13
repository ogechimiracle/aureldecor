import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { absoluteUrl, siteConfig } from "@/lib/config";
import {
  getCategoryLabel,
  getProjectBySlug,
  getRelatedProjects,
  projects,
} from "@/lib/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: absoluteUrl(`/portfolio/${project.slug}`),
      images: [{ url: project.cover.src, alt: project.cover.alt }],
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const related = getRelatedProjects(project.slug);

  return (
    <>
      <div className="border-b border-line bg-ivory">
        <Container className="py-14 md:py-20">
          <div className="flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <Badge key={category}>{getCategoryLabel(category)}</Badge>
            ))}
          </div>
          <h1 className="mt-5 max-w-3xl text-balance font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-col gap-2 text-sm uppercase tracking-[0.14em] text-ink-mute sm:flex-row sm:items-center sm:gap-8">
            <p className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-terracotta" aria-hidden />
              {project.location}
            </p>
            <p>
              {project.propertyType} · {project.year}
            </p>
            {project.area ? <p>{project.area}</p> : null}
          </div>
        </Container>
      </div>

      <Container className="py-16 md:py-24">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div className="space-y-14">
            <Reveal>
              <SectionHeading
                eyebrow="Project overview"
                title={project.summary}
              />
              <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
                {project.overview}
              </p>
            </Reveal>

            <Reveal>
              <SectionHeading eyebrow="Client brief" title="The brief" />
              <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
                {project.brief}
              </p>
            </Reveal>

            <Reveal>
              <SectionHeading eyebrow="Concept" title="Design concept" />
              <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
                {project.concept}
              </p>
            </Reveal>

            <Reveal>
              <SectionHeading
                eyebrow="Challenges & solutions"
                title="Problems met with a considered answer."
              />
              <div className="mt-6 space-y-5">
                {project.challenges.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-sm border border-line bg-card p-6"
                  >
                    <p className="font-serif text-lg text-ink">
                      <span className="text-terracotta">Challenge — </span>
                      {item.challenge}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      <span className="font-medium text-ink">Solution — </span>
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {project.beforeAfter ? (
              <Reveal>
                <SectionHeading
                  eyebrow="Before & after"
                  title="The transformation"
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <figure className="relative aspect-4/3 overflow-hidden rounded-sm">
                    <Image
                      src={project.beforeAfter.before.src}
                      alt={project.beforeAfter.before.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 92vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 bg-ink/60 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ivory backdrop-blur-sm">
                      Before
                    </figcaption>
                  </figure>
                  <figure className="relative aspect-4/3 overflow-hidden rounded-sm">
                    <Image
                      src={project.beforeAfter.after.src}
                      alt={project.beforeAfter.after.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 92vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 bg-ink/60 px-3 py-1 text-xs uppercase tracking-[0.16em] text-ivory backdrop-blur-sm">
                      After
                    </figcaption>
                  </figure>
                </div>
                <p className="mt-3 text-xs text-ink-mute">
                  Placeholder comparison imagery — replace with the client&apos;s
                  own before-and-after photography before launch.
                </p>
              </Reveal>
            ) : null}

            <Reveal>
              <SectionHeading eyebrow="Gallery" title="Inside the project" />
              <p className="mt-4 max-w-xl text-sm text-ink-soft">
                Select any image to view it in full screen.
              </p>
              <div className="mt-6">
                <ProjectGallery images={project.gallery} title={project.title} />
              </div>
            </Reveal>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Project details</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  {[
                    ["Location", project.location],
                    ["Property type", project.propertyType],
                    ["Year", project.year],
                    ...(project.area ? ([["Area", project.area]] as const) : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-4 border-b border-line pb-3">
                      <dt className="w-28 shrink-0 uppercase tracking-[0.12em] text-ink-mute">
                        {label}
                      </dt>
                      <dd className="text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Materials</h2>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {project.materials.map((material) => (
                    <li key={material} className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-terracotta" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Colour palette</h2>
                <ul className="mt-4 grid grid-cols-2 gap-4">
                  {project.palette.map((swatch) => (
                    <li key={swatch.name} className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="size-9 shrink-0 rounded-full border border-line"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>
                        <span className="block text-sm text-ink">{swatch.name}</span>
                        <span className="block text-xs uppercase text-ink-mute">
                          {swatch.hex}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Outcomes</h2>
                <ul className="mt-4 space-y-3">
                  {project.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-olive" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="rounded-sm bg-ink p-7 text-ivory">
                <h2 className="font-serif text-xl">
                  Planning something similar?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                  Let&apos;s discuss how your project could take shape. Reach us
                  at {siteConfig.email}.
                </p>
                <Button asChild variant="accent" className="mt-6">
                  <Link href="/contact">
                    Discuss a similar project
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>

      {related.length > 0 ? (
        <div className="border-t border-line bg-canvas">
          <Container className="py-20 md:py-24">
            <SectionHeading
              eyebrow="More work"
              title="Related projects"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedProject, index) => (
                <Reveal key={relatedProject.slug} delay={index * 0.05}>
                  <ProjectCard
                    project={relatedProject}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      <CtaSection
        title="Your space could be next."
        description="Whether it's a single room or a full renovation, every project starts with a consultation."
      />
    </>
  );
}