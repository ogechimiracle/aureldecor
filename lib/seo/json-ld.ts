import { siteConfig } from "@/lib/config";
import { pexelsPhoto } from "@/lib/utils";
import type { SocialLink } from "@/types";

interface ProfessionalServiceOverrides {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  serviceArea?: string;
  social?: SocialLink[];
}

/**
 * LocalBusiness / ProfessionalService structured data.
 * Address, geo and opening hours should reflect the studio's real details.
 */
export function professionalServiceJsonLd(
  overrides: ProfessionalServiceOverrides = {},
) {
  const social = overrides.social ?? siteConfig.social;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: overrides.name ?? siteConfig.brandName,
    description: overrides.description || siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    image: pexelsPhoto(7546645, { width: 1200, height: 630 }),
    email: overrides.email || siteConfig.email,
    telephone: overrides.phone || siteConfig.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: overrides.address || siteConfig.address,
      addressCountry: "US",
    },
    areaServed: overrides.serviceArea || siteConfig.serviceArea,
    sameAs: social.map((link) => link.href),
  };
}
