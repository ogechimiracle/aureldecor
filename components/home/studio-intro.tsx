import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/data/profile";

export function StudioIntro() {
  return (
    <Container className="py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm">
              <Image
                src={profile.studioImage.src}
                alt={profile.studioImage.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden w-44 border border-line bg-ivory p-5 shadow-soft sm:block lg:-right-6">
              <p className="font-serif text-3xl text-terracotta">
                {profile.yearsExperience}+
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-mute">
                Years crafting interiors
              </p>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow mb-3 text-terracotta">The Studio</p>
            <h2 className="text-balance text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]">
              Design that begins with how you actually live.
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-ink-soft">
              {profile.shortBio}
            </p>
            <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
              I keep the studio intentionally small so every commission receives
              close, personal attention — from the first conversation to the day
              the last cushion is placed.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8">
              {profile.stats.slice(0, 4).map((stat) => (
                <div key={stat.label}>
                  <dt className="font-serif text-2xl text-ink">{stat.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-mute">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-9">
              <Button asChild variant="outline">
                <Link href="/about">
                  More about the studio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
