import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SocialIcon } from "@/components/shared/social-icon";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/data/services";
import { formatYear, telLink, whatsappLink } from "@/lib/utils";

export function SiteFooter() {
  const year = formatYear();

  return (
    <footer className="mt-auto border-t border-line bg-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <span className="font-serif text-2xl tracking-[0.2em] text-ink">
              {siteConfig.wordmark}
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              {siteConfig.description}
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {siteConfig.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    <SocialIcon icon={social.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
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
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-terracotta"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                <a
                  href={telLink(siteConfig.phone)}
                  className="transition-colors hover:text-terracotta"
                >
                  {siteConfig.phone}
                </a>
              </li>
              {siteConfig.whatsapp ? (
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                  <a
                    href={whatsappLink(siteConfig.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-terracotta"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
                <span>
                  {siteConfig.address}
                  <br />
                  <span className="text-ink-mute">{siteConfig.serviceArea}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brandName}. All rights reserved.
          </p>
          <p>
            Demo content — replace business details, projects and imagery before
            launch.
          </p>
        </div>
      </Container>
    </footer>
  );
}
