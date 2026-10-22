import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { absoluteUrl } from "@/lib/config";
import {
  getPublishedCategoryFilters,
  listPublishedProjects,
} from "@/server/services/projects";
import { getSiteSettings } from "@/server/services/settings";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A curated selection of residential and commercial interior design projects — living rooms, bedrooms, kitchens, offices and complete renovations.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — Selected Projects",
    description: "Residential and commercial interior design projects by the studio.",
    url: absoluteUrl("/portfolio"),
    type: "website",
  },
};

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { category } = await searchParams;

  const [result, categories, settings] = await Promise.all([
    listPublishedProjects({ categorySlug: category, pageSize: 100 }),
    getPublishedCategoryFilters(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Work that speaks through space."
        description="A selection of residential and commercial commissions — from single rooms to complete renovations. Filter by category to explore."
      />

      <Container className="pb-20 md:pb-28">
        <Suspense
          fallback={
            <div className="animate-pulse pt-12">
              <div className="h-14 rounded-sm bg-sand" />
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="aspect-4/5 rounded-sm bg-sand" />
                ))}
              </div>
            </div>
          }
        >
          {result.items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl">No published projects yet.</p>
              <p className="mt-2 text-sm text-ink-soft">
                New work is added regularly — check back soon.
              </p>
            </div>
          ) : (
            <PortfolioGrid
              projects={result.items}
              categories={categories.map((entry) => ({
                slug: entry.slug,
                label: entry.name,
              }))}
            />
          )}
        </Suspense>
      </Container>

      <CtaSection
        title="Looking for a space like these?"
        description="Every project begins with a conversation. Tell us what you have in mind and we'll take it from there."
        email={settings.contact.email || undefined}
        phone={settings.contact.phone || undefined}
        whatsapp={settings.contact.whatsapp || undefined}
      />
    </>
  );
}
