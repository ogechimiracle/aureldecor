import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { AdminConfigNotice } from "@/components/admin/config-notice";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCurrentOwner } from "@/lib/auth/session";
import { isSessionConfigured } from "@/lib/env";
import { getSiteSettings } from "@/server/services/settings";

export const metadata: Metadata = {
  title: "Studio Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (!isSessionConfigured()) {
    return <AdminConfigNotice />;
  }

  const owner = await getCurrentOwner();
  if (owner) redirect("/admin");

  const settings = await getSiteSettings();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-panel p-12 text-on-panel lg:flex">
        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.2em] text-on-panel"
        >
          {settings.brand.wordmark}
        </Link>
        <div>
          <p className="eyebrow text-panel-accent">Studio administration</p>
          <h1 className="mt-4 max-w-md text-balance font-serif text-4xl leading-tight">
            Manage your portfolio, projects and studio details.
          </h1>
          <p className="mt-5 max-w-sm text-pretty leading-relaxed text-on-panel/70">
            This area is private. Only the studio owner can publish projects,
            upload media and update site content.
          </p>
        </div>
        <p className="text-xs text-on-panel/50">
          © {new Date().getFullYear()} {settings.brand.brandName}
        </p>
      </div>

      <div className="flex flex-col bg-canvas">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.2em] text-ink lg:hidden"
          >
            {settings.brand.wordmark}
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <span className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-card text-terracotta">
                <LockKeyhole className="size-5" aria-hidden />
              </span>
              <h2 className="mt-6 font-serif text-3xl">Owner sign in</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Enter the studio owner credentials to continue.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-xs leading-relaxed text-ink-mute">
              No account yet? Create one from the terminal with{" "}
              <code className="rounded bg-sand/60 px-1.5 py-0.5 font-mono text-[0.7rem] text-ink">
                npm run owner:create
              </code>
              .
            </p>
            <p className="mt-4 text-xs text-ink-mute">
              <Link href="/" className="underline-offset-2 hover:underline">
                ← Back to the website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
