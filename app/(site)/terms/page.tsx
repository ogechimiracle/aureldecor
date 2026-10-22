import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of use for the ${siteConfig.brandName} website.`,
  alternates: { canonical: "/terms" },
};

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-2xl text-ink">{children}</h2>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Conditions of use for this website. Review and adapt with your legal advisor before publishing."
      updated="June 2026"
    >
      <section className="space-y-4">
        <SubHeading>1. Acceptance of terms</SubHeading>
        <Paragraph>
          By accessing this website you agree to these terms of use. If you do
          not agree, please do not use the site.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>2. Use of content</SubHeading>
        <Paragraph>
          All content on this site — text, photography and design — belongs to
          {siteConfig.brandName} or its licensors and is protected by
          intellectual-property law. You may view content for personal use;
          copying, reproducing or using it commercially without permission is
          not permitted.
        </Paragraph>
        <Paragraph>
          Portfolio photography on this demonstration site is licensed stock
          imagery used as placeholder material and must be replaced before
          launch.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>3. Enquiries and projects</SubHeading>
        <Paragraph>
          Submitting an enquiry does not create a professional-services
          contract. A written agreement is required before any design work
          begins. Details of fees, schedules and deliverables are confirmed in
          that written agreement, not on this website.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>4. No professional warranty</SubHeading>
        <Paragraph>
          This website is provided &quot;as is&quot;. We make reasonable efforts
          to keep information accurate but give no warranties of any kind, and
          are not liable for decisions made in reliance on site content.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>5. Limitation of liability</SubHeading>
        <Paragraph>
          To the maximum extent permitted by law, {siteConfig.brandName} is not
          liable for any indirect or consequential loss arising from use of this
          website.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>6. Governing law</SubHeading>
        <Paragraph>
          These terms are governed by the laws applicable where the studio is
          registered. Confirm the correct jurisdiction before publishing.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>7. Contact</SubHeading>
        <Paragraph>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-terracotta hover:underline">
            {siteConfig.email}
          </a>
          .
        </Paragraph>
      </section>
    </LegalPage>
  );
}