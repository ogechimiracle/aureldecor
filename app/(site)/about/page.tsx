import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { profile } from "@/lib/data/profile";

export const metadata: Metadata = {
  title: "About the Studio",
  description: `Meet ${profile.name} — ${profile.title}. ${profile.tagline}`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the studio"
        title="A small studio, a personal approach."
        description="Full-service interior design built on listening, rigour and a genuine belief that rooms shape the way we feel."
      />

      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="relative aspect-4/5 overflow-hidden rounded-sm">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-scrim/80 to-transparent p-5">
                <p className="font-serif text-xl text-onmedia">{profile.name}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-onmedia/75">
                  {profile.title}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="text-balance font-serif text-3xl leading-tight sm:text-4xl">
                {profile.tagline}
              </h2>
              <div className="mt-6 space-y-5 text-pretty leading-relaxed text-ink-soft">
                {profile.biography.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-4">
                {profile.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl text-terracotta">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-mute">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      <div className="border-y border-line bg-panel text-on-panel">
        <Container className="py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Philosophy"
              title="Good design is quiet."
              className="mx-auto text-center"
            />
            <blockquote className="mx-auto mt-8 max-w-3xl text-center font-serif text-2xl leading-relaxed text-on-panel/85 sm:text-3xl">
              “{profile.philosophy}”
            </blockquote>
          </Reveal>
        </Container>
      </div>

      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Mission & vision"
                title="Why the studio exists"
              />
            </Reveal>
            <div className="mt-8 space-y-6">
              <Reveal delay={0.05}>
                <div className="rounded-sm border border-line bg-card p-7">
                  <h3 className="font-serif text-xl text-ink">Our mission</h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-soft">
                    {profile.mission}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="rounded-sm border border-line bg-card p-7">
                  <h3 className="font-serif text-xl text-ink">Our vision</h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-soft">
                    {profile.vision}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Expertise"
                title="Where I can help"
              />
            </Reveal>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {profile.expertise.map((item, index) => (
                <Reveal key={item} delay={0.04 * index}>
                  <li className="flex items-center gap-3 border-b border-line pb-3 text-sm text-ink">
                    <span className="size-1.5 rounded-full bg-terracotta" />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-line bg-ivory">
        <Container className="py-20 md:py-28">
          <SectionHeading
            eyebrow="Design values"
            title="The principles behind every decision."
            align="center"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {profile.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="h-full rounded-sm border border-line bg-card p-7">
                  <span className="font-serif text-3xl text-terracotta/70">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      <div className="border-t border-line">
        <Container className="py-20 md:py-28">
          <Reveal>
            <div className="relative aspect-[16/7] overflow-hidden rounded-sm">
              <Image
                src={profile.studioImage.src}
                alt={profile.studioImage.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </div>

      <CtaSection
        title="Let's design something worth living in."
        description="Tell me about your project and we'll arrange a consultation to explore the possibilities."
      />
    </>
  );
}