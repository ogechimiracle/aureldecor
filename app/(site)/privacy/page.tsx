import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.brandName} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-2xl text-ink">{children}</h2>;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 list-disc space-y-2 pl-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This template explains how the studio handles personal information. Review and adapt it with your legal advisor before publishing."
      updated="June 2026"
    >
      <section className="space-y-4">
        <SubHeading>1. Who we are</SubHeading>
        <Paragraph>
          {siteConfig.brandName} (&quot;we&quot;, &quot;our studio&quot;) is the
          data controller responsible for this website. Contact us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-terracotta hover:underline">
            {siteConfig.email}
          </a>{" "}
          with any privacy questions.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>2. Information we collect</SubHeading>
        <Paragraph>When you use the contact form we collect:</Paragraph>
        <Bullets
          items={[
            "Your name and email address",
            "Your phone number, if provided",
            "The details of your enquiry (service, property type, location, message)",
            "Technical information such as IP address, held briefly for anti-abuse purposes",
          ]}
        />
        <Paragraph>
          We do not collect more information than is needed to respond to your
          enquiry, and we never sell personal data.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>3. How we use your information</SubHeading>
        <Paragraph>Your information is used to:</Paragraph>
        <Bullets
          items={[
            "Respond to your enquiry and follow up about a possible project",
            "Prepare and manage any consultation or project",
            "Protect the website against spam and abuse",
          ]}
        />
      </section>

      <section className="space-y-4">
        <SubHeading>4. Legal basis</SubHeading>
        <Paragraph>
          We rely on your consent and on our legitimate interest in responding
          to enquiries to process the information you submit through the
          contact form. Consent can be withdrawn at any time.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>5. Sharing and retention</SubHeading>
        <Paragraph>
          Your enquiry is delivered to our studio email via a third-party email
          provider and may be stored by that provider. We keep enquiry details
          only as long as needed to manage the relationship you requested, and
          delete them when no longer necessary.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>6. Your rights</SubHeading>
        <Paragraph>You may request access to, correction of, or deletion of your personal data, and may object to or restrict our processing. Email us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-terracotta hover:underline">
            {siteConfig.email}
          </a>.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>7. Cookies</SubHeading>
        <Paragraph>
          This website does not use advertising cookies. Where analytics are
          enabled, aggregate, anonymised usage data may be collected to improve
          the site. Review and customise this section to reflect the services
          actually in use.
        </Paragraph>
      </section>

      <section className="space-y-4">
        <SubHeading>8. Contact</SubHeading>
        <Paragraph>
          For any privacy-related questions, contact us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-terracotta hover:underline">
            {siteConfig.email}
          </a>
          .
        </Paragraph>
      </section>
    </LegalPage>
  );
}