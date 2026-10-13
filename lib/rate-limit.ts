/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * This is a best-effort safeguard suitable for a single serverless region and
 * low-volume contact forms. On Vercel, memory is per-instance, so this limits
 * bursts within an instance but is not a global guarantee. For stronger,
 * cross-instance protection, back this with a shared store such as Upstash
 * Redis and swap the implementation below.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Periodically evict stale buckets so the map does not grow unbounded. */
export function pruneRateLimitBuckets() {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
