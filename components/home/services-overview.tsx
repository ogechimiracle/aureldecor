import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";

export function ServicesOverview() {
  return (
    <div className="border-y border-line bg-canvas">
      <Container className="py-20 md:py-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="A complete design service, tailored to the project."
            description="From a single room to a whole property, each commission is led personally and delivered with care — whether you need full-service design or focused expert guidance."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/services">
              All services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 4) * 0.06}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
