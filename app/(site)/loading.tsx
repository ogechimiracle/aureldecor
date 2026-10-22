import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-24">
      <div role="status" aria-label="Loading" className="flex flex-col items-center gap-6">
        <span className="border-2 border-line-strong border-t-terracotta size-10 animate-spin rounded-full" />
        <p className="eyebrow text-ink-mute">Moment, please</p>
        <span className="sr-only">Loading page content…</span>
      </div>
    </Container>
  );
}