"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/session";
import { markInquiryRead } from "@/server/services/contact";

/** Mark a contact enquiry as read (owner only). */
export async function markInquiryReadAction(id: string): Promise<void> {
  await requireOwner();
  await markInquiryRead(id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
