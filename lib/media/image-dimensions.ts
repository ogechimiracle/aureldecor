/**
 * Best-effort intrinsic dimension extraction for the image formats we accept.
 * Returns null when the format is unsupported or the header is malformed —
 * dimensions are optional metadata, so callers must tolerate null.
 */

function readUInt16BE(buffer: Uint8Array, offset: number): number {
  return (buffer[offset] << 8) | buffer[offset + 1];
}

function readUInt32BE(buffer: Uint8Array, offset: number): number {
  return (
    ((buffer[offset] << 24) |
      (buffer[offset + 1] << 16) |
      (buffer[offset + 2] << 8) |
      buffer[offset + 3]) >>>
    0
  );
}

function pngDimensions(buffer: Uint8Array) {
  // IHDR chunk follows the 8-byte signature: length(4) type(4) then w/h.
  if (buffer.length < 24) return null;
  const width = readUInt32BE(buffer, 16);
  const height = readUInt32BE(buffer, 20);
  if (!width || !height) return null;
  return { width, height };
}

function jpegDimensions(buffer: Uint8Array) {
  let offset = 2; // skip SOI
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // Standalone markers without a length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = readUInt16BE(buffer, offset + 2);
    if (length < 2) return null;
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      if (offset + 9 >= buffer.length) return null;
      const height = readUInt16BE(buffer, offset + 5);
      const width = readUInt16BE(buffer, offset + 7);
      if (!width || !height) return null;
      return { width, height };
    }
    offset += 2 + length;
  }
  return null;
}

function webpDimensions(buffer: Uint8Array) {
  if (buffer.length < 30) return null;
  const format = String.fromCharCode(
    buffer[12],
    buffer[13],
    buffer[14],
    buffer[15],
  );
  if (format === "VP8X") {
    const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
    const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
    return { width, height };
  }
  if (format === "VP8 ") {
    // Lossy: 3-byte frame tag, 3-byte sync code, then 14-bit LE dimensions.
    if (buffer.length < 30) return null;
    const width = (buffer[26] | (buffer[27] << 8)) & 0x3fff;
    const height = (buffer[28] | (buffer[29] << 8)) & 0x3fff;
    if (!width || !height) return null;
    return { width, height };
  }
  if (format === "VP8L") {
    const bits =
      buffer[21] | (buffer[22] << 8) | (buffer[23] << 16) | (buffer[24] << 24);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    if (!width || !height) return null;
    return { width, height };
  }
  return null;
}

export function getImageDimensions(
  buffer: Uint8Array,
  mime: string,
): { width: number; height: number } | null {
  try {
    switch (mime) {
      case "image/png":
        return pngDimensions(buffer);
      case "image/jpeg":
        return jpegDimensions(buffer);
      case "image/webp":
        return webpDimensions(buffer);
      default:
        // AVIF (and unknown formats) — not parsed; dimensions stay optional.
        return null;
    }
  } catch {
    return null;
  }
}
