import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/shared/page-header";

interface LegalPageProps {
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
}

export function LegalPage({ title, description, updated, children }: LegalPageProps) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={description} />
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-10 inline-block rounded-sm border border-dashed border-line-strong bg-ivory px-3 py-1.5 text-xs text-ink-mute">
            Updated {updated} · This is a template and must be reviewed by the
            business before launch.
          </p>
          <div className="space-y-10 text-sm leading-relaxed text-ink-soft">
            {children}
          </div>
        </div>
      </Container>
    </>
  );
}