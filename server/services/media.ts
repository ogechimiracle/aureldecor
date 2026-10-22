import { randomUUID } from "node:crypto";
import { asc, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { media as mediaTable, type Media } from "@/db/schema";
import { getServerConfig } from "@/lib/env";
import { getImageDimensions } from "@/lib/media/image-dimensions";
import {
  extensionForMime,
  sanitizeFilename,
  validateUpload,
} from "@/lib/media/file-validation";
import { getStorage, mediaUrl } from "@/lib/storage";

export interface MediaDto {
  id: string;
  mediaType: "image" | "video";
  url: string;
  altText: string;
  originalFilename: string | null;
  mimeType: string;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: Date;
}

export function toMediaDto(row: Media): MediaDto {
  return {
    id: row.id,
    mediaType: row.mediaType,
    url: mediaUrl(row) ?? "",
    altText: row.altText ?? "",
    originalFilename: row.originalFilename,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    width: row.width,
    height: row.height,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
  };
}

export type UploadResult =
  | { ok: true; media: MediaDto }
  | { ok: false; error: string };

/**
 * Validate and store an uploaded file.
 * Auth MUST be verified by the caller (route handler / server action).
 */
export async function uploadMedia(input: {
  file: File;
  projectId?: string | null;
  kind: "image" | "video";
  altText?: string;
  sortOrder?: number;
}): Promise<UploadResult> {
  const { file, kind, projectId = null } = input;
  const config = getServerConfig();
  const maxBytes = kind === "image" ? config.maxImageBytes : config.maxVideoBytes;

  if (!file || typeof file === "string" || file.size === 0) {
    return { ok: false, error: "No file received." };
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return { ok: false, error: "Could not read the uploaded file." };
  }

  const validation = validateUpload({
    bytes,
    claimedMime: file.type ?? "",
    kind,
    maxBytes,
  });
  if (!validation.ok) return { ok: false, error: validation.error };

  const key = `${randomUUID()}.${extensionForMime(validation.mime)}`;
  const storage = getStorage();

  try {
    await storage.put(key, bytes);
  } catch (error) {
    console.error("[media] failed to store upload", error);
    return { ok: false, error: "Could not store the file. Please try again." };
  }

  const dimensions = kind === "image" ? getImageDimensions(bytes, validation.mime) : null;

  try {
    const row: Media = {
      id: randomUUID(),
      projectId,
      mediaType: kind,
      storageProvider: "local",
      storageKey: key,
      originalFilename: sanitizeFilename(file.name || "upload"),
      mimeType: validation.mime,
      sizeBytes: bytes.length,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      durationSeconds: null,
      altText: input.altText?.trim() || null,
      sortOrder: input.sortOrder ?? 0,
      createdAt: new Date(),
    };

    const db = getDb();
    await db.insert(mediaTable).values(row);

    return { ok: true, media: toMediaDto(row) };
  } catch (error) {
    console.error("[media] failed to record upload", error);
    await storage.delete(key).catch(() => undefined);
    return { ok: false, error: "Could not save the upload record." };
  }
}

export async function listProjectMedia(projectId: string): Promise<MediaDto[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.projectId, projectId))
    .orderBy(asc(mediaTable.sortOrder), asc(mediaTable.createdAt));
  return rows.map(toMediaDto);
}

export async function listUnattachedMedia(): Promise<MediaDto[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(mediaTable)
    .where(isNull(mediaTable.projectId))
    .orderBy(asc(mediaTable.createdAt));
  return rows.map(toMediaDto);
}

export async function getMediaById(id: string): Promise<Media | null> {
  const db = getDb();
  const rows = await db.select().from(mediaTable).where(eq(mediaTable.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Delete a media row and its stored file (owner-only; caller must auth). */
export async function deleteMedia(id: string): Promise<{ ok: boolean; error?: string }> {
  const db = getDb();
  const rows = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return { ok: true };

  try {
    await db.delete(mediaTable).where(eq(mediaTable.id, id));
  } catch (error) {
    console.error("[media] delete failed", error);
    return { ok: false, error: "Could not remove the media." };
  }

  if (row.storageProvider === "local") {
    await getStorage().delete(row.storageKey).catch(() => undefined);
  }
  return { ok: true };
}

/** Look up several media records at once (used when attaching uploads). */
export async function getMediaByIds(ids: string[]): Promise<Media[]> {
  if (ids.length === 0) return [];
  const db = getDb();
  return db.select().from(mediaTable).where(inArray(mediaTable.id, ids));
}
