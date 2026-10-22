import Link from "next/link";
import { ArrowRight, FolderOpen, Sparkles, Star, Inbox } from "lucide-react";
import { requireOwner } from "@/lib/auth/session";
import {
  getDashboardStats,
  listAdminProjects,
} from "@/server/services/projects";
import { countNewInquiries, listRecentInquiries } from "@/server/services/contact";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const statusStyles: Record<string, string> = {
  published: "bg-olive/15 text-olive",
  draft: "bg-gold/15 text-gold",
};

export default async function AdminDashboardPage() {
  const owner = await requireOwner();
  const [stats, recent, inquiries, newInquiries] = await Promise.all([
    getDashboardStats(),
    listAdminProjects({ status: "all", page: 1 }),
    listRecentInquiries(5),
    countNewInquiries(),
  ]);

  const cards = [
    {
      label: "Total projects",
      value: stats.total,
      icon: FolderOpen,
      href: "/admin/projects",
    },
    {
      label: "Published",
      value: stats.published,
      icon: Sparkles,
      href: "/admin/projects?status=published",
    },
    {
      label: "Drafts",
      value: stats.draft,
      icon: FolderOpen,
      href: "/admin/projects?status=draft",
    },
    {
      label: "Featured",
      value: stats.featured,
      icon: Star,
      href: "/admin/projects",
    },
    {
      label: "New enquiries",
      value: newInquiries,
      icon: Inbox,
      href: "/admin/enquiries",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-terracotta">Dashboard</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
            Welcome back, {owner.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            A snapshot of your portfolio and recent enquiries.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-xs font-medium uppercase tracking-[0.18em] text-on-accent transition-colors hover:bg-accent-strong"
        >
          New project
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-sm border border-line bg-card p-5 transition-colors hover:border-line-strong"
            >
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink-mute">
                <Icon className="size-4 text-terracotta" aria-hidden />
                {card.label}
              </span>
              <p className="mt-4 font-serif text-3xl text-ink">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-sm border border-line bg-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft">
              Recently updated
            </h2>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline"
            >
              All projects <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </header>
          {recent.items.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-mute">
              No projects yet. Create your first project to get started.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.items.slice(0, 6).map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ivory"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">
                        {project.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-mute">
                        {project.location ?? "No location"} ·{" "}
                        {dateFormat.format(new Date(project.updatedAt))}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] ${
                        statusStyles[project.status] ??
                        "bg-sand text-ink-soft"
                      }`}
                    >
                      {project.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-sm border border-line bg-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft">
              Recent enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline"
            >
              All <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </header>
          {inquiries.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-mute">
              No enquiries yet. Messages from the contact form will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {inquiries.map((inquiry) => (
                <li key={inquiry.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-ink">
                      {inquiry.name}
                    </p>
                    {inquiry.status === "new" ? (
                      <span className="shrink-0 rounded-full bg-terracotta/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-terracotta">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-mute">
                    {inquiry.service} · {inquiry.email}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                    {inquiry.description}
                  </p>
                  <p className="mt-2 text-[0.7rem] text-ink-mute">
                    {dateFormat.format(new Date(inquiry.createdAt))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
