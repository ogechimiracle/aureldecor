"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession, requireOwner } from "@/lib/auth/session";
import { isSessionConfigured } from "@/lib/env";
import {
  authenticate,
  updateOwnerPassword,
  updateOwnerProfile,
} from "@/server/services/auth";
import {
  changePasswordSchema,
  loginSchema,
  type ChangePasswordValues,
  type LoginValues,
} from "@/server/validators/auth";
import type { ActionResult } from "@/server/services/projects";

export type LoginState =
  | { ok: false; error?: string; fieldErrors?: Record<string, string[]> }
  | { ok: true };

/** Sign in the studio owner and start the sealed session cookie. */
export async function loginAction(values: LoginValues): Promise<LoginState> {
  if (!isSessionConfigured()) {
    return {
      ok: false,
      error:
        "Studio admin is not configured. Add SESSION_SECRET to .env.local and restart the server.",
    };
  }

  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "email");
      fieldErrors[field] = fieldErrors[field] ?? [];
      fieldErrors[field].push(issue.message);
    }
    return { ok: false, fieldErrors };
  }

  const result = await authenticate(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return {
      ok: false,
      error: "Incorrect email or password.",
    };
  }

  const session = await getAdminSession();
  session.userId = result.user.id;
  session.email = result.user.email;
  session.issuedAt = Date.now();
  await session.save();

  revalidatePath("/admin");
  redirect("/admin");
}

/** Sign out — destroys the server-side session state via cookie expiry. */
export async function logoutAction(): Promise<void> {
  if (!isSessionConfigured()) {
    redirect("/admin/login");
  }
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}

export async function changePasswordAction(
  values: ChangePasswordValues,
): Promise<ActionResult> {
  const user = await requireOwner();

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "newPassword");
      fieldErrors[field] = fieldErrors[field] ?? [];
      fieldErrors[field].push(issue.message);
    }
    return { ok: false, fieldErrors };
  }

  const { verifyPassword } = await import("@/server/services/auth");
  const valid = await verifyPassword(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!valid) {
    return {
      ok: false,
      fieldErrors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  await updateOwnerPassword(user.id, parsed.data.newPassword);
  return { ok: true };
}

export async function updateProfileAction(input: {
  name: string;
  email: string;
}): Promise<ActionResult> {
  const user = await requireOwner();

  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";

  const fieldErrors: Record<string, string[]> = {};
  if (name.length < 2 || name.length > 80) {
    fieldErrors.name = ["Enter a name between 2 and 80 characters."];
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = ["Enter a valid email address."];
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  await updateOwnerProfile(user.id, { name, email });
  revalidatePath("/admin");
  return { ok: true };
}
