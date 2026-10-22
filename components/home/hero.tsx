"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pexelsPhoto } from "@/lib/utils";

const heroImage = pexelsPhoto(7546645, { width: 2400, height: 1600 });

interface HeroProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function Hero({
  eyebrow = "Residential & Commercial Interior Design",
  title = "Spaces Designed to Inspire Living.",
  description = "A full-service interior design studio creating warm, architectural interiors — considered from the first sketch to the final styled room, and built to be lived in for years.",
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative -mt-20 flex min-h-[100svh] items-end overflow-hidden">
      <Image
        src={heroImage}
        alt="A light-filled minimalist living room with layered natural textures"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/45 to-scrim/25"
      />

      <div className="container-page relative z-10 pb-16 pt-40 md:pb-24">
        <div className="max-w-3xl">
          <motion.p {...fadeUp(0)} className="eyebrow text-onmedia/80">
            {eyebrow}
          </motion.p>
          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-balance font-serif text-4xl leading-[1.05] text-onmedia sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-onmedia/85 md:text-lg"
          >
            {description}
          </motion.p>
          <motion.div
            {...fadeUp(0.24)}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" variant="accent">
              <Link href="/portfolio">
                Explore Our Projects
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="lightOutline">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
