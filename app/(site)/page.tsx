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
import { getSiteSettings } from "@/server/services/settings";
import { professionalServiceJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  const { home, contact, seo } = settings;

  return (
    <>
      <JsonLd
        data={professionalServiceJsonLd({
          name: settings.brand.brandName,
          description: seo.seoDescription || settings.brand.description,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          address: contact.address || undefined,
          serviceArea: contact.serviceArea || undefined,
          social: settings.social,
        })}
      />
      <Hero
        eyebrow={home.heroEyebrow || undefined}
        title={home.heroTitle || undefined}
        description={home.heroDescription || undefined}
      />
      <StudioIntro
        title={home.studioTitle || undefined}
        body={home.studioBody || undefined}
      />
      <ServicesOverview />
      <FeaturedProjects />
      <Philosophy />
      <ProcessSection />
      <TestimonialsSection />
      <CtaSection
        title={home.ctaTitle || undefined}
        description={home.ctaDescription || undefined}
        email={contact.email || undefined}
        phone={contact.phone || undefined}
        whatsapp={contact.whatsapp || undefined}
      />
    </>
  );
}
