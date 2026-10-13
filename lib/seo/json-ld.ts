import { siteConfig } from "@/lib/config";
import { pexelsPhoto } from "@/lib/utils";

/**
 * LocalBusiness / ProfessionalService structured data.
 * PLACEHOLDER — address, geo and opening hours must be updated with the
 * studio's real details before launch.
 */
export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brandName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    image: pexelsPhoto(7546645, { width: 1200, height: 630 }),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "US",
    },
    areaServed: siteConfig.serviceArea,
    sameAs: siteConfig.social.map((social) => social.href),
  };
}