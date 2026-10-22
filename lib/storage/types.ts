/**
 * Storage abstraction for uploaded media.
 *
 * Two providers are supported:
 *  - `local`  → files written to a configurable directory (default `data/uploads`).
 *               In production this MUST be a persistent volume/path, not the
 *               ephemeral filesystem of a serverless platform.
 *  - `remote` → absolute https URLs (CDN / object storage). Used for imported
 *               or externally hosted assets; no bytes are stored locally.
 *
 * The media table stores metadata + a storage reference; binaries never live
 * in SQLite.
 */

export interface StorageAdapter {
  /** Persist bytes under a safe, unique key. */
  put(key: string, data: Uint8Array): Promise<void>;
  /** Read bytes for a key, or null when missing. */
  get(key: string): Promise<Uint8Array | null>;
  /** Remove a stored object (ignores missing files). */
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  /** Public URL used to serve this key through the application. */
  publicUrl(key: string): string;
}

/** Keys are uuid-like filenames: alphanumeric, dash, underscore + short extension. */
export const STORAGE_KEY_PATTERN = /^[A-Za-z0-9_-]{8,64}\.[a-z0-9]{2,8}$/;

export function isValidStorageKey(key: string): boolean {
  if (key.includes("..") || key.includes("/") || key.includes("\\")) return false;
  return STORAGE_KEY_PATTERN.test(key);
}

/** Build the application URL that serves a given storage reference. */
export function mediaUrl(
  media: { storageProvider: "local" | "remote"; storageKey: string } | null | undefined,
): string | null {
  if (!media) return null;
  if (media.storageProvider === "remote") return media.storageKey;
  if (!isValidStorageKey(media.storageKey)) return null;
  return `/api/media/${media.storageKey}`;
}
