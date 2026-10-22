import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { telLink, whatsappLink } from "@/lib/utils";

interface CtaSectionProps {
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
}

export function CtaSection({
  title = "Have a project in mind?",
  description = "Let's talk about the space you want to create. Book a consultation and we'll map out how to get there — together.",
  email = siteConfig.email,
  phone = siteConfig.phone,
  whatsapp = siteConfig.whatsapp,
}: CtaSectionProps) {
  return (
    <div className="relative overflow-hidden bg-panel text-on-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 size-96 -translate-y-1/2 rounded-full border border-on-panel/10"
      />
      <Container className="relative py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow text-terracotta-soft">Book a consultation</p>
          <h2 className="mt-4 text-balance text-3xl leading-[1.1] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-on-panel/75">
            {description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="accent">
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <ul className="flex flex-col gap-2 text-sm text-on-panel/70 sm:ml-4">
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-on-panel"
                  >
                    <Mail className="size-4" aria-hidden /> {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={telLink(phone)}
                    className="inline-flex items-center gap-2 transition-colors hover:text-on-panel"
                  >
                    <Phone className="size-4" aria-hidden /> {phone}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={whatsappLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-on-panel"
                  >
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
