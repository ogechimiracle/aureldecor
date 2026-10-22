import type { Metadata } from "next";
import { PasswordForm, ProfileForm } from "@/components/admin/account-forms";
import { requireOwner } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account" };

export default async function AdminAccountPage() {
  const owner = await requireOwner();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="eyebrow text-terracotta">Owner</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Account</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          This studio runs on a single owner account. Your email doubles as the
          sign-in name.
        </p>
      </div>

      <section className="space-y-5 rounded-sm border border-line bg-card p-6">
        <header>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft">
            Profile
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            Used for the sign-in screen and audit trails.
          </p>
        </header>
        <ProfileForm owner={{ name: owner.name, email: owner.email }} />
      </section>

      <section className="space-y-5 rounded-sm border border-line bg-card p-6">
        <header>
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-soft">
            Password
          </h2>
          <p className="mt-1 text-xs text-ink-mute">
            Minimum 12 characters. Sessions stay valid after a change.
          </p>
        </header>
        <PasswordForm />
      </section>
    </div>
  );
}
