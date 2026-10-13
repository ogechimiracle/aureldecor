import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { CtaSection } from "@/components/shared/cta-section";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { ContactChannelItem } from "@/components/contact/contact-channel-item";
import { siteConfig } from "@/lib/config";
import { telLink, whatsappLink } from "@/lib/utils";

interface ContactPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "Contact",
  description:
    `Book a consultation with ${siteConfig.brandName}. Send an enquiry and we'll be in touch within two working days.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;
  const initialService =
    typeof params.service === "string" ? params.service : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your space."
        description="Book a consultation or send us details of your project. We reply within two working days."
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <Reveal>
            <div className="rounded-sm border border-line bg-card p-6 sm:p-10">
              <ContactForm initialService={initialService} />
            </div>
          </Reveal>

          <aside className="space-y-5">
            <Reveal delay={0.05}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Direct contact</h2>
                <ul className="mt-5 space-y-4">
                  <ContactChannelItem
                    icon={Mail}
                    label="Email"
                    value={siteConfig.email}
                    href={`mailto:${siteConfig.email}`}
                  />
                  <ContactChannelItem
                    icon={Phone}
                    label="Phone"
                    value={siteConfig.phone}
                    href={telLink(siteConfig.phone)}
                  />
                  {siteConfig.whatsapp ? (
                    <ContactChannelItem
                      icon={MessageCircle}
                      label="WhatsApp"
                      value="Chat with the studio"
                      href={whatsappLink(siteConfig.whatsapp)}
                      external
                    />
                  ) : null}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Studio</h2>
                <ul className="mt-5 space-y-4 text-sm text-ink-soft">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                    <span>
                      {siteConfig.address}
                      <br />
                      <span className="text-ink-mute">{siteConfig.serviceArea}</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                    <span>
                      Mon–Fri, 9am–6pm
                      <br />
                      <span className="text-ink-mute">
                        Project meetings by appointment
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-sm border border-line bg-card p-7">
                <h2 className="font-serif text-xl">Prefer to talk first?</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  A 30-minute consultation is the best place to start. We&apos;ll
                  listen to your ideas, look at the space and recommend the
                  right scope — nothing more.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Container>

      <CtaSection
        title="Not ready to write yet?"
        description="Browse the portfolio for inspiration, or read about how a project comes together from first consultation to handover."
      />
    </>
  );
}