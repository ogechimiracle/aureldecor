import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { media as mediaTable } from "@/db/schema";
import { requireOwnerApi } from "@/lib/auth/session";
import { deleteMedia } from "@/server/services/media";

export const runtime = "nodejs";

/**
 * Delete unattached media (uploads not yet saved to a project).
 * Attached media is removed through the project editor instead.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const owner = await requireOwnerApi();
  if (!owner) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  void request;

  const { id } = await params;
  const db = getDb();
  const rows = await db
    .select({ id: mediaTable.id, projectId: mediaTable.projectId })
    .from(mediaTable)
    .where(eq(mediaTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ ok: true });
  }
  if (row.projectId) {
    return NextResponse.json(
      { ok: false, error: "This file belongs to a project. Remove it from the project editor." },
      { status: 409 },
    );
  }

  const result = await deleteMedia(id);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "Could not delete the file." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
