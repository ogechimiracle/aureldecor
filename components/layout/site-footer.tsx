import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SocialIcon } from "@/components/shared/social-icon";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/data/services";
import { formatYear, telLink, whatsappLink } from "@/lib/utils";
import type { SiteSettings } from "@/server/services/settings";

interface SiteFooterProps {
  brand?: SiteSettings["brand"];
  contact?: SiteSettings["contact"];
  social?: SiteSettings["social"];
}

export function SiteFooter({
  brand = siteConfig,
  contact = siteConfig,
  social = siteConfig.social,
}: SiteFooterProps) {
  const year = formatYear();

  return (
    <footer className="mt-auto border-t border-line bg-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <span className="font-serif text-2xl tracking-[0.2em] text-ink">
              {brand.wordmark}
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              {brand.description || siteConfig.description}
            </p>
            {social.length > 0 ? (
              <ul className="mt-6 flex items-center gap-3">
                {social.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      <SocialIcon icon={link.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="lg:col-span-1">
            <h2 className="eyebrow text-ink-mute">Explore</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {siteConfig.footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-terracotta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {siteConfig.legalNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-terracotta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-1">
            <h2 className="eyebrow text-ink-mute">Services</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-ink-soft transition-colors hover:text-terracotta"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h2 className="eyebrow text-ink-mute">Studio</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-ink-soft">
              {contact.email ? (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-terracotta"
                  >
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                  <a
                    href={telLink(contact.phone)}
                    className="transition-colors hover:text-terracotta"
                  >
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.whatsapp ? (
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                  <a
                    href={whatsappLink(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-terracotta"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {contact.address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                  <span>
                    {contact.address}
                    {contact.serviceArea ? (
                      <>
                        <br />
                        <span className="text-ink-mute">{contact.serviceArea}</span>
                      </>
                    ) : null}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.brandName}. All rights reserved.
          </p>
          <p>Interior design studio — all imagery shown for demonstration.</p>
        </div>
      </Container>
    </footer>
  );
}
