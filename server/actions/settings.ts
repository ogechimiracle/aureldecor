"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/session";
import type { ActionResult } from "@/server/services/projects";
import { updateSettingsSection, type SettingKey } from "@/server/services/settings";

/** Persist one editable site-content section (owner only). */
export async function saveSettingsAction(
  key: SettingKey,
  input: unknown,
): Promise<ActionResult> {
  await requireOwner();

  const result = await updateSettingsSection(key, input);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/admin/settings");
    revalidatePath("/about");
    revalidatePath("/contact");
  }
  return result;
}
