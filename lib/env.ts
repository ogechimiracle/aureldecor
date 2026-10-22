import path from "node:path";
import { randomBytes } from "node:crypto";
import { z } from "zod";

/**
 * Server-side environment validation.
 *
 * Values are parsed once and cached. Secrets are never exported to the client
 * — this module must only ever be imported from server code.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_FILE: z.string().trim().min(1).optional(),
  MEDIA_DIR: z.string().trim().min(1).optional(),
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters long.")
    .optional(),
  MAX_IMAGE_UPLOAD_MB: z.coerce.number().positive().max(512).default(15),
  MAX_VIDEO_UPLOAD_MB: z.coerce.number().positive().max(4096).default(250),
});

export interface ServerConfig {
  nodeEnv: "development" | "production" | "test";
  /** Absolute path to the SQLite database file. */
  databaseFile: string;
  /** Absolute path to the local media (uploads) directory. */
  mediaDir: string;
  /** Secret used to seal session cookies (≥ 32 chars). */
  sessionSecret: string;
  maxImageBytes: number;
  maxVideoBytes: number;
}

let cached: ServerConfig | null = null;
let warnedAboutDevSecret = false;

function resolveSessionSecret(parsed: z.infer<typeof envSchema>): string {
  if (parsed.SESSION_SECRET) return parsed.SESSION_SECRET;

  if (parsed.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is required in production. Generate one with: " +
        `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`,
    );
  }

  // Development / test fallback: a per-process random secret. Sessions are
  // invalidated when the dev server restarts — set SESSION_SECRET in
  // .env.local for stable development sessions. Never a hardcoded secret.
  if (!warnedAboutDevSecret) {
    warnedAboutDevSecret = true;
    console.warn(
      "[env] SESSION_SECRET is not set — using a temporary development-only secret. Sessions will reset when the server restarts.",
    );
  }
  return randomBytes(48).toString("hex");
}

export function getServerConfig(): ServerConfig {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n  - ");
    throw new Error(`Invalid environment configuration:\n  - ${issues}`);
  }

  const env = parsed.data;
  cached = {
    nodeEnv: env.NODE_ENV,
    databaseFile: env.DATABASE_FILE
      ? path.resolve(env.DATABASE_FILE)
      : path.resolve(process.cwd(), "data", "app.db"),
    mediaDir: env.MEDIA_DIR
      ? path.resolve(env.MEDIA_DIR)
      : path.resolve(process.cwd(), "data", "uploads"),
    sessionSecret: resolveSessionSecret(env),
    maxImageBytes: Math.round(env.MAX_IMAGE_UPLOAD_MB * 1024 * 1024),
    maxVideoBytes: Math.round(env.MAX_VIDEO_UPLOAD_MB * 1024 * 1024),
  };

  return cached;
}

/**
 * Whether a usable `SESSION_SECRET` is present in the environment.
 *
 * Never throws, so it is safe to call from render paths that must degrade
 * gracefully (for example the admin sign-in page) instead of surfacing a
 * server error when the environment has not been configured yet.
 */
export function isSessionConfigured(): boolean {
  const secret = process.env.SESSION_SECRET;
  return typeof secret === "string" && secret.length >= 32;
}

/** Test helper — clears the cached config. */
export function resetServerConfigCache() {
  cached = null;
}
