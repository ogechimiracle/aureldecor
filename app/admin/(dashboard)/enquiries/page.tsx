import { Inbox, Mail, MapPin, Phone } from "lucide-react";
import { MarkReadButton } from "@/components/admin/mark-read-button";
import { requireOwner } from "@/lib/auth/session";
import { listRecentInquiries } from "@/server/services/contact";

export const metadata = { title: "Enquiries" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminEnquiriesPage() {
  await requireOwner();
  const inquiries = await listRecentInquiries(100);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-terracotta">Inbox</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Enquiries</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Messages sent through the public contact form, newest first.
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-line-strong bg-card px-6 py-16 text-center">
          <Inbox className="size-6 text-terracotta" aria-hidden />
          <p className="text-sm text-ink-mute">
            No enquiries yet. Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="flex flex-col gap-4 rounded-sm border border-line bg-card p-5"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{inquiry.name}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-mute">
                    {dateFormat.format(new Date(inquiry.createdAt))}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] ${
                    inquiry.status === "new"
                      ? "bg-terracotta/10 text-terracotta"
                      : "bg-olive/15 text-olive"
                  }`}
                >
                  {inquiry.status}
                </span>
              </header>

              <dl className="space-y-1.5 text-xs text-ink-soft">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 shrink-0 text-ink-mute" aria-hidden />
                  <a className="hover:text-terracotta hover:underline" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>
                </div>
                {inquiry.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 shrink-0 text-ink-mute" aria-hidden />
                    <a className="hover:text-terracotta hover:underline" href={`tel:${inquiry.phone}`}>
                      {inquiry.phone}
                    </a>
                  </div>
                ) : null}
                {inquiry.projectLocation ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0 text-ink-mute" aria-hidden />
                    <span>{inquiry.projectLocation}</span>
                  </div>
                ) : null}
              </dl>

              <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.14em] text-ink-mute">
                <span className="rounded-full bg-sand px-2.5 py-1">
                  {inquiry.service}
                </span>
                {inquiry.propertyType ? (
                  <span className="rounded-full bg-sand px-2.5 py-1">
                    {inquiry.propertyType}
                  </span>
                ) : null}
                {inquiry.budget ? (
                  <span className="rounded-full bg-sand px-2.5 py-1">
                    {inquiry.budget}
                  </span>
                ) : null}
                {inquiry.startDate ? (
                  <span className="rounded-full bg-sand px-2.5 py-1">
                    Starts {inquiry.startDate}
                  </span>
                ) : null}
                {!inquiry.emailSent ? (
                  <span className="rounded-full bg-gold/15 px-2.5 py-1 text-gold">
                    Email not delivered
                  </span>
                ) : null}
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {inquiry.description}
              </p>

              {inquiry.status === "new" ? (
                <div className="mt-auto">
                  <MarkReadButton id={inquiry.id} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
