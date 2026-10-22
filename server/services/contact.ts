import { randomUUID } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contactInquiries, type ContactInquiry } from "@/db/schema";
import type { ContactFormValues } from "@/lib/schemas/contact";

/**
 * Persist a contact enquiry. Recordings happen regardless of whether an email
 * could be delivered, so no message is ever lost when email is unconfigured.
 */
export async function createInquiry(
  data: ContactFormValues,
  options: { emailSent: boolean },
): Promise<void> {
  const db = getDb();
  await db.insert(contactInquiries).values({
    id: randomUUID(),
    name: data.fullName,
    email: data.email,
    phone: data.phone || null,
    service: data.service,
    propertyType: data.propertyType || null,
    projectLocation: data.projectLocation || null,
    budget: data.budget || null,
    startDate: data.startDate || null,
    description: data.description,
    status: "new",
    emailSent: options.emailSent,
    createdAt: new Date(),
  });
}

export async function listRecentInquiries(limit = 5): Promise<ContactInquiry[]> {
  const db = getDb();
  return db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt))
    .limit(limit);
}

export async function countNewInquiries(): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactInquiries)
    .where(eq(contactInquiries.status, "new"));
  return rows[0]?.count ?? 0;
}

export async function markInquiryRead(id: string): Promise<void> {
  const db = getDb();
  await db
    .update(contactInquiries)
    .set({ status: "read" })
    .where(eq(contactInquiries.id, id));
}
