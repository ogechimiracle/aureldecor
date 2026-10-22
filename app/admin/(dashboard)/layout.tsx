import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdminConfigNotice } from "@/components/admin/config-notice";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { requireOwner } from "@/lib/auth/session";
import { isSessionConfigured } from "@/lib/env";
import { getSiteSettings } from "@/server/services/settings";

export const metadata = {
  title: "Studio Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSessionConfigured()) {
    return <AdminConfigNotice />;
  }

  const owner = await requireOwner();
  const settings = await getSiteSettings();

  return (
    <div className="min-h-svh bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-line bg-ivory lg:flex">
        <div className="border-b border-line px-6 py-6">
          <Link
            href="/admin"
            className="font-serif text-xl tracking-[0.18em] text-ink"
          >
            {settings.brand.wordmark}
          </Link>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-ink-mute">
            Studio admin
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <AdminNav />
        </div>

        <div className="border-t border-line px-4 py-4">
          <div className="mb-3 px-3">
            <p className="truncate text-sm font-medium text-ink">{owner.name}</p>
            <p className="truncate text-xs text-ink-mute">{owner.email}</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-sand/60 hover:text-ink"
            >
              <ExternalLink className="size-4" aria-hidden />
              View site
            </Link>
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-10">
            <Link
              href="/admin"
              className="font-serif text-lg tracking-[0.18em] text-ink lg:hidden"
            >
              {settings.brand.wordmark}
            </Link>
            <p className="hidden text-xs uppercase tracking-[0.24em] text-ink-mute lg:block">
              Studio administration
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
          <div className="px-5 pb-3 lg:hidden">
            <AdminNav orientation="horizontal" />
          </div>
        </header>

        <main className="px-5 py-8 lg:px-10 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
