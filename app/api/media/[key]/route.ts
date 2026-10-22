import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { NextRequest } from "next/server";
import { mimeForExtension } from "@/lib/media/file-validation";
import { getServerConfig } from "@/lib/env";
import { isValidStorageKey } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

/** Serve a stored upload, with byte-range support for audio/video seeking. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  if (!isValidStorageKey(key)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = key.split(".").pop() ?? "";
  const mime = mimeForExtension(extension);
  if (!mime) {
    return new Response("Not found", { status: 404 });
  }

  const baseDir = path.resolve(getServerConfig().mediaDir);
  const filePath = path.resolve(baseDir, key);
  if (filePath !== baseDir && !filePath.startsWith(baseDir + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let stats: Awaited<ReturnType<typeof fs.stat>>;
  try {
    stats = await fs.stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!stats.isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const size = stats.size;
  const rangeHeader = request.headers.get("range");

  const headers = {
    "Content-Type": mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": IMMUTABLE_CACHE,
    "X-Content-Type-Options": "nosniff",
  } as const;

  if (!rangeHeader) {
    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
    return new Response(stream, {
      status: 200,
      headers: { ...headers, "Content-Length": String(size) },
    });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) {
    return new Response("Invalid range", {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const [, startRaw, endRaw] = match;
  let start: number;
  let end: number;

  if (startRaw === "" && endRaw === "") {
    return new Response("Invalid range", {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  if (startRaw === "") {
    // Suffix range: last N bytes.
    const suffix = Number(endRaw);
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(startRaw);
    end = endRaw === "" ? size - 1 : Math.min(Number(endRaw), size - 1);
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start > end ||
    start >= size
  ) {
    return new Response("Range not satisfiable", {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const stream = Readable.toWeb(
    createReadStream(filePath, { start, end }),
  ) as ReadableStream;

  return new Response(stream, {
    status: 206,
    headers: {
      ...headers,
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
    },
  });
}
