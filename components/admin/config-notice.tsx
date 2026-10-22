import { TriangleAlert } from "lucide-react";

/**
 * Shown instead of the admin UI when the server has not been configured with
 * a `SESSION_SECRET`. Without it no owner session can be sealed, so the admin
 * area cannot authenticate anyone — a clear explanation beats a 500 page.
 */
export function AdminConfigNotice() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-lg min-w-0 rounded-sm border border-line bg-card p-8">
        <span className="inline-flex size-11 items-center justify-center rounded-full border border-terracotta/40 bg-terracotta/5 text-terracotta">
          <TriangleAlert className="size-5" aria-hidden />
        </span>

        <h1 className="mt-6 font-serif text-3xl">Studio admin is not configured</h1>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          The owner sign-in needs a <code className="rounded bg-sand/60 px-1.5 py-0.5 font-mono text-[0.7rem] text-ink">SESSION_SECRET</code>{" "}
          of at least 32 characters. Until one is provided, sessions cannot be
          sealed and the admin area is unavailable.
        </p>

        <p className="mt-5 text-sm leading-relaxed text-ink-soft">
          Add the following to{" "}
          <code className="rounded bg-sand/60 px-1.5 py-0.5 font-mono text-[0.7rem] text-ink">.env.local</code>{" "}
          and restart the server:
        </p>

        <pre className="mt-3 overflow-x-auto rounded-sm bg-ink px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-ivory">
          <code>SESSION_SECRET={"\n"}# generate: node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(48).toString(&apos;hex&apos;))&quot;</code>
        </pre>

        <p className="mt-6 text-xs leading-relaxed text-ink-mute">
          Never commit this value. The full list of supported variables is
          documented in{" "}
          <code className="rounded bg-sand/60 px-1.5 py-0.5 font-mono text-[0.7rem] text-ink">.env.example</code>
          .
        </p>
      </div>
    </div>
  );
}
