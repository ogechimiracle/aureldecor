import fs from "node:fs/promises";
import path from "node:path";
import { getServerConfig } from "@/lib/env";
import {
  isValidStorageKey,
  type StorageAdapter,
} from "./types";

/**
 * Local filesystem storage. Files live OUTSIDE `public/` and are only ever
 * served through the controlled `/api/media/[key]` route handler, which
 * validates keys, enforces content types and supports HTTP range requests.
 */
export class LocalStorage implements StorageAdapter {
  constructor(private readonly baseDir: string) {}

  private resolve(key: string): string {
    if (!isValidStorageKey(key)) {
      throw new Error("Invalid storage key.");
    }
    // Belt and braces: the resolved path must stay inside baseDir.
    const target = path.resolve(this.baseDir, key);
    const base = path.resolve(this.baseDir);
    if (target !== base && !target.startsWith(base + path.sep)) {
      throw new Error("Invalid storage key.");
    }
    return target;
  }

  async put(key: string, data: Uint8Array): Promise<void> {
    const target = this.resolve(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, data);
  }

  async get(key: string): Promise<Uint8Array | null> {
    try {
      return await fs.readFile(this.resolve(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.resolve(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  publicUrl(key: string): string {
    if (!isValidStorageKey(key)) throw new Error("Invalid storage key.");
    return `/api/media/${key}`;
  }
}

let cached: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!cached) {
    cached = new LocalStorage(getServerConfig().mediaDir);
  }
  return cached;
}

/** Test helper — resets the singleton. */
export function resetStorageCache() {
  cached = null;
}
