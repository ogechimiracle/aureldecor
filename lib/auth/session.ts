import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerConfig, isSessionConfigured } from "@/lib/env";
import { findOwnerById } from "@/server/services/auth";
import type { User } from "@/db/schema";

/** Data sealed inside the HTTP-only session cookie. */
export interface AdminSession {
  userId: string;
  email: string;
  issuedAt: number;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function getSessionOptions(): SessionOptions {
  const config = getServerConfig();
  return {
    cookieName: "internaldecor_session",
    password: config.sessionSecret,
    ttl: SESSION_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.nodeEnv === "production",
      path: "/",
    },
  };
}

/** Read (and unseal) the current session, if any. */
export async function getAdminSession(): Promise<IronSession<AdminSession>> {
  return getIronSession<AdminSession>(await cookies(), getSessionOptions());
}

/**
 * Resolve the authenticated owner for the current request.
 * Sessions are re-validated against the database on every call, so deleted
 * or disabled accounts lose access immediately.
 */
export async function getCurrentOwner(): Promise<User | null> {
  // Without a session secret no cookie can be sealed, so treat every request
  // as anonymous rather than throwing.
  if (!isSessionConfigured()) return null;

  const session = await getAdminSession();
  if (!session.userId) return null;

  const user = await findOwnerById(session.userId);
  if (!user) {
    session.destroy();
    return null;
  }
  return user;
}

/**
 * Guard for protected Server Components and Server Actions.
 * Redirects anonymous visitors to the login page.
 */
export async function requireOwner(): Promise<User> {
  const user = await getCurrentOwner();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

/** Guard for route handlers — returns null instead of redirecting. */
export async function requireOwnerApi(): Promise<User | null> {
  return getCurrentOwner();
}
