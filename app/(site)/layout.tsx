import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/server/services/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader
        brandName={settings.brand.brandName}
        wordmark={settings.brand.wordmark}
      />
      <main id="main" className="flex-1 pt-20">
        {children}
      </main>
      <SiteFooter
        brand={settings.brand}
        contact={settings.contact}
        social={settings.social}
      />
    </>
  );
}
