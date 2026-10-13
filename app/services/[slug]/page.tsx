import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { getServiceBySlug, services } from "@/lib/data/services";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.longDescription.slice(0, 160),
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.longDescription.slice(0, 160),
      url: absoluteUrl(`/services/${service.slug}`),
      images: [{ url: service.image.src, alt: service.image.alt }],
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const related = services.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-line bg-ivory">
        <Container className="py-16 md:py-24">
          <p className="eyebrow mb-4 text-terracotta">Services</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-balance font-serif text-4xl leading-[1.05] sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-ink-mute">
                {service.tagline}
              </p>
            </div>
            <Button asChild variant="accent" size="lg">
              <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                Request a Quote
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-16 md:py-24">
        <Reveal>
          <div className="relative aspect-[16/8] overflow-hidden rounded-sm">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-serif text-3xl">About this service</h2>
              <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
                {service.longDescription}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-14 font-serif text-3xl">How it works</h2>
              <ol className="mt-6 space-y-6">
                {service.process.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-5 border-l border-line-strong pl-6"
                  >
                    <span className="font-serif text-2xl text-terracotta">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <aside className="space-y-6">
            <Reveal delay={0.05}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">What&apos;s included</h2>
                <ul className="mt-5 space-y-3">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Best suited to</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {service.idealFor}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Timeline</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {service.timeline}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="rounded-sm border border-ink bg-ink p-7 text-ivory">
                <h2 className="font-serif text-xl">Pricing</h2>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                  Every project is scoped individually. Pricing is provided as a
                  fixed written quote after a consultation —{" "}
                  <span className="text-ivory">request a quote</span> for your
                  specific project.
                </p>
                <Button asChild variant="accent" className="mt-6">
                  <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                    Request a Quote
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>

      <div className="border-t border-line bg-canvas">
        <Container className="py-20 md:py-24">
          <Reveal>
            <h2 className="font-serif text-3xl">Related services</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.05}>
                <Link
                  href={`/services/${item.slug}`}
                  className="group flex h-full flex-col rounded-sm border border-line bg-card p-7 transition-colors hover:border-line-strong hover:bg-ivory"
                >
                  <item.icon className="size-5 text-terracotta" aria-hidden />
                  <h3 className="mt-5 font-serif text-lg leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                  <span className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-terracotta">
                    View service
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      <CtaSection
        title={`Ready to discuss ${service.title}?`}
        description={`Send us a few details and we'll arrange a consultation. Questions first? Email ${siteConfig.email}.`}
      />
    </>
  );
}