import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Residential and commercial interior design services — space planning, furniture selection, decoration, colour consultation, renovation support and custom concepts.",
};

export default function ServicesPage() {
  const featured = services.filter((service) => service.featured);
  const compact = services.filter((service) => !service.featured);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="A complete service, scaled to your project."
        description="Every commission is led personally from concept to handover. Choose a full-service engagement or a focused scope — pricing is always provided as a clear, fixed quote."
      />

      <Container className="py-20 md:py-28">
        <div className="space-y-20">
          {featured.map((service, index) => {
            const reverse = index % 2 === 1;
            return (
              <div
                key={service.slug}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal
                  className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}
                >
                  <div className="group relative aspect-4/5 overflow-hidden rounded-sm sm:aspect-[4/3]">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 92vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                </Reveal>
                <div className={`min-w-0 ${reverse ? "lg:order-1" : ""}`}>
                  <Reveal delay={0.1}>
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-line text-terracotta">
                      <service.icon className="size-5" aria-hidden />
                    </span>
                    <h2 className="mt-6 font-serif text-2xl leading-snug sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-sm uppercase tracking-[0.16em] text-ink-mute">
                      {service.tagline}
                    </p>
                    <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
                      {service.longDescription}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {service.deliverables.slice(0, 5).map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-terracotta" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button asChild variant="outline">
                        <Link href={`/services/${service.slug}`}>
                          Explore {service.title}
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24">
          <Reveal>
            <SectionHeading
              eyebrow="Focused services"
              title="Expert guidance for a specific need."
              description="Not every project needs full-service design. These focused disciplines plug into yours — whether you're working with a builder or styling a finished room."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {compact.map((service, index) => (
              <Reveal key={service.slug} delay={(index % 4) * 0.06}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full min-w-0 flex-col rounded-sm border border-line bg-card p-7 transition-colors hover:border-line-strong hover:bg-ivory"
                >
                  <service.icon
                    className="size-5 text-terracotta"
                    aria-hidden
                  />
                  <h3 className="mt-5 font-serif text-lg leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {service.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-terracotta">
                    Details
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>

      <CtaSection
        title="Not sure which service you need?"
        description="Describe your project and we'll recommend the right scope — no obligation, just honest advice."
      />
    </>
  );
}