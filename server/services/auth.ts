import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { users, type NewUser, type User } from "@/db/schema";

/** bcrypt cost — 12 is a solid balance for an interactive login. */
const BCRYPT_ROUNDS = 12;

let dummyHash: string | null = null;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * Used when an account does not exist so the login path takes a comparable
 * amount of time either way (no user-enumeration timing oracle).
 */
async function dummyCompare(plain: string): Promise<false> {
  if (!dummyHash) {
    dummyHash = await bcrypt.hash(randomUUID(), BCRYPT_ROUNDS);
  }
  await bcrypt.compare(plain, dummyHash);
  return false;
}

export async function countOwners(): Promise<number> {
  const db = getDb();
  const rows = await db.select({ count: sql<number>`count(*)` }).from(users);
  return rows[0]?.count ?? 0;
}

export async function findOwnerByEmail(email: string): Promise<User | undefined> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);
  return rows[0];
}

export async function findOwnerById(id: string): Promise<User | undefined> {
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0];
}

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: "INVALID_CREDENTIALS" };

/** Verify email + password. Never reveals whether the account exists. */
export async function authenticate(
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await findOwnerByEmail(email);
  if (!user) {
    await dummyCompare(password);
    return { ok: false, error: "INVALID_CREDENTIALS" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "INVALID_CREDENTIALS" };

  return { ok: true, user };
}

export async function createOwner(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const db = getDb();
  const record: NewUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: await hashPassword(input.password),
  };
  await db.insert(users).values(record);
  return {
    ...record,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateOwnerPassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  const db = getDb();
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function updateOwnerProfile(
  userId: string,
  input: { name: string; email: string },
): Promise<void> {
  const db = getDb();
  await db
    .update(users)
    .set({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}
