import type { Metadata } from "next";
import {
  BrandSettingsForm,
  ContactSettingsForm,
  HomeSettingsForm,
  SeoSettingsForm,
  SocialSettingsForm,
} from "@/components/admin/settings-forms";
import { getSiteSettings } from "@/server/services/settings";

export const metadata: Metadata = { title: "Site settings" };

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-5 rounded-sm border border-line bg-card p-6">
      <header>
        <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-mute">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-terracotta">Content</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Site settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Every section saves independently and updates the public site
          immediately. Leave fields blank where the site falls back to its
          defaults.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          title="Brand"
          description="Business name, wordmark and tagline used in the header, footer and metadata."
        >
          <BrandSettingsForm value={settings.brand} />
        </Section>

        <Section
          title="Contact"
          description="Shown on the contact page, footer and in structured contact data."
        >
          <ContactSettingsForm value={settings.contact} />
        </Section>

        <Section
          title="Search & metadata"
          description="Fallback title and description for pages that do not define their own."
        >
          <SeoSettingsForm value={settings.seo} />
        </Section>

        <Section
          title="Social links"
          description="Icons rendered in the footer. Use full https:// URLs."
        >
          <SocialSettingsForm value={{ social: settings.social }} />
        </Section>

        <Section
          title="Homepage"
          description="Hero, studio introduction and closing call-to-action copy."
        >
          <HomeSettingsForm value={settings.home} />
        </Section>
      </div>
    </div>
  );
}
