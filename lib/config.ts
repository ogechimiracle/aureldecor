import type { SiteConfig } from "@/types";

/**
 * =============================================================================
 * CENTRAL BUSINESS CONFIGURATION
 * =============================================================================
 * Everything here is placeholder demo content. Replace each value with the
 * studio's real information before launch. Values marked "PLACEHOLDER" are
 * intentionally non-functional (e.g. `.example` email, zeroed phone number)
 * so that nothing fake is presented to real visitors.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const siteConfig: SiteConfig = {
  // PLACEHOLDER — replace with the real studio name / wordmark.
  brandName: "Aurelia Interiors",
  wordmark: "AURELIA",
  tagline: "Interiors composed with intention",
  description:
    "A residential and commercial interior design studio crafting warm, architectural and deeply personal spaces — from concept and space planning to final styling.",

  // PLACEHOLDER — set NEXT_PUBLIC_SITE_URL in production.
  url: siteUrl,

  // PLACEHOLDER contact details — replace before launch.
  email: "studio@aurelia-interiors.example",
  phone: "+1 (000) 000-0000",
  // Leave empty until a verified WhatsApp Business number is available.
  whatsapp: "",
  address: "Studio address to be confirmed",
  serviceArea: "Metropolitan area & surrounding regions",

  // PLACEHOLDER — replace with real profile URLs. Kept as live platform roots
  // so no broken links ship, but they must point at the studio's profiles.
  social: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "Pinterest", href: "https://pinterest.com/", icon: "pinterest" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "Facebook", href: "https://facebook.com/", icon: "facebook" },
  ],

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Process", href: "/#process" },
    { label: "Contact", href: "/contact" },
  ],

  footerNav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ],

  legalNav: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const siteMetadataBase = new URL(siteConfig.url);

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
