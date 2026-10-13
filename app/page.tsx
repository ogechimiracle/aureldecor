import type { Metadata } from "next";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { Philosophy } from "@/components/home/philosophy";
import { ProcessSection } from "@/components/home/process-section";
import { ServicesOverview } from "@/components/home/services-overview";
import { StudioIntro } from "@/components/home/studio-intro";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaSection } from "@/components/shared/cta-section";
import { siteConfig } from "@/lib/config";
import { professionalServiceJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={professionalServiceJsonLd()} />
      <Hero />
      <StudioIntro />
      <ServicesOverview />
      <FeaturedProjects />
      <Philosophy />
      <ProcessSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}