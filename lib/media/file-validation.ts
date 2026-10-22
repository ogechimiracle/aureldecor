/**
 * Content-based file type detection.
 *
 * Uploads are never trusted by extension or by the browser-provided MIME
 * type: the actual bytes are sniffed against known signatures, then the
 * detected type must also match the claimed type.
 */

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const VIDEO_MIME_TYPES = ["video/mp4", "video/webm"] as const;

export type ImageMime = (typeof IMAGE_MIME_TYPES)[number];
export type VideoMime = (typeof VIDEO_MIME_TYPES)[number];
export type AllowedMime = ImageMime | VideoMime;

const EXTENSIONS: Record<AllowedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function extensionForMime(mime: AllowedMime): string {
  return EXTENSIONS[mime];
}

const MIME_BY_EXTENSION: Record<string, AllowedMime> = Object.fromEntries(
  Object.entries(EXTENSIONS).map(([mime, ext]) => [ext, mime as AllowedMime]),
) as Record<string, AllowedMime>;

/** Resolve the content type for a stored file from its extension. */
export function mimeForExtension(extension: string): AllowedMime | null {
  return MIME_BY_EXTENSION[extension.toLowerCase()] ?? null;
}

export function isImageMime(mime: string): mime is ImageMime {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(mime);
}

export function isVideoMime(mime: string): mime is VideoMime {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(mime);
}

function ascii(buffer: Uint8Array, start: number, end: number): string {
  let out = "";
  for (let i = start; i < end && i < buffer.length; i++) {
    out += String.fromCharCode(buffer[i]);
  }
  return out;
}

function startsWith(buffer: Uint8Array, bytes: number[]): boolean {
  if (buffer.length < bytes.length) return false;
  return bytes.every((byte, index) => buffer[index] === byte);
}

/** ISO-BMFF (mp4/avif): "ftyp" at offset 4, followed by the major brand. */
function isoBmffBrand(buffer: Uint8Array): string | null {
  if (buffer.length < 16) return null;
  if (ascii(buffer, 4, 8) !== "ftyp") return null;
  const major = ascii(buffer, 8, 12);
  const compatible = [
    ascii(buffer, 16, 20),
    ascii(buffer, 20, 24),
    ascii(buffer, 24, 28),
  ];
  return [major, ...compatible].join(" ");
}

/**
 * Detect the real media type from file content.
 * Returns null when the bytes do not match any supported type.
 */
export function detectMime(buffer: Uint8Array): AllowedMime | null {
  // JPEG: FF D8 FF
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    buffer.length >= 16 &&
    ascii(buffer, 0, 4) === "RIFF" &&
    ascii(buffer, 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  // WebM (EBML/matroska): 1A 45 DF A3, DocType must be "webm".
  if (startsWith(buffer, [0x1a, 0x45, 0xdf, 0xa3])) {
    const header = ascii(buffer, 0, Math.min(buffer.length, 256));
    if (header.includes("webm")) return "video/webm";
    return null; // .mkv etc. are not accepted
  }

  // ISO-BMFF: mp4 and avif both use an "ftyp" box.
  const brand = isoBmffBrand(buffer);
  if (brand) {
    const brands = brand.split(/\s+/);
    if (brands.some((entry) => entry === "avif" || entry === "avis")) {
      return "image/avif";
    }
    if (
      brands.some((entry) =>
        /^iso|^mp4|^mp7|^avc1|^dash|^msnv|^f4v$|^m4v$/.test(entry),
      )
    ) {
      return "video/mp4";
    }
    return null;
  }

  return null;
}

/**
 * Validate an upload: sniffed content type, claimed MIME type, kind
 * (image/video) and byte size must all agree.
 */
export function validateUpload(options: {
  bytes: Uint8Array;
  claimedMime: string;
  kind: "image" | "video";
  maxBytes: number;
}): { ok: true; mime: AllowedMime } | { ok: false; error: string } {
  const { bytes, claimedMime, kind, maxBytes } = options;

  if (bytes.length === 0) {
    return { ok: false, error: "The file is empty." };
  }
  if (bytes.length > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024));
    return { ok: false, error: `File is larger than the ${limitMb} MB limit.` };
  }

  const detected = detectMime(bytes);
  if (!detected) {
    return {
      ok: false,
      error: "Unsupported or unrecognized file format.",
    };
  }

  if (kind === "image" && !isImageMime(detected)) {
    return { ok: false, error: "That file is not a supported image." };
  }
  if (kind === "video" && !isVideoMime(detected)) {
    return { ok: false, error: "That file is not a supported video." };
  }

  // The browser's declared type must be compatible with the real content
  // (browsers may send an empty or generic type, which we accept).
  if (claimedMime && !claimedMime.startsWith("application/octet-stream")) {
    const claimedIsImage = isImageMime(claimedMime);
    const claimedIsVideo = isVideoMime(claimedMime);
    if ((claimedIsImage || claimedIsVideo) && claimedMime !== detected) {
      return {
        ok: false,
        error: "File content does not match the declared file type.",
      };
    }
  }

  return { ok: true, mime: detected };
}

/** Sanitise a user-supplied filename for display/storage metadata. */
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"|?*]/g, "")
    .trim()
    .slice(0, 120) || "file";
}
