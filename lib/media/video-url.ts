/**
 * Validate and classify external video URLs.
 *
 * Only https URLs are accepted, and they must resolve to a known embed
 * provider (YouTube, Vimeo) or a direct .mp4/.webm file. Anything else —
 * including arbitrary HTML embeds — is rejected, so no untrusted markup can
 * ever reach the page.
 */

export type ParsedVideoUrl =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "direct"; url: string }
  | null;

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID = /^\d{6,12}$/;

export function parseVideoUrl(raw: string): ParsedVideoUrl {
  const value = raw.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const id = url.searchParams.get("v");
    if (id && YOUTUBE_ID.test(id)) return { kind: "youtube", id };
    const embed = /^\/embed\/([A-Za-z0-9_-]{6,20})$/.exec(url.pathname);
    if (embed) return { kind: "youtube", id: embed[1] };
    const shorts = /^\/shorts\/([A-Za-z0-9_-]{6,20})$/.exec(url.pathname);
    if (shorts) return { kind: "youtube", id: shorts[1] };
    return null;
  }

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0] ?? "";
    if (YOUTUBE_ID.test(id)) return { kind: "youtube", id };
    return null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const segment = url.pathname.split("/").filter(Boolean).pop() ?? "";
    if (VIMEO_ID.test(segment)) return { kind: "vimeo", id: segment };
    return null;
  }

  const pathname = url.pathname.toLowerCase();
  if (pathname.endsWith(".mp4") || pathname.endsWith(".webm")) {
    return { kind: "direct", url: url.toString() };
  }

  return null;
}

export function isValidVideoUrl(raw: string): boolean {
  return parseVideoUrl(raw) !== null;
}
