import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/auth/session";
import {
  listUnattachedMedia,
  uploadMedia,
} from "@/server/services/media";

export const runtime = "nodejs";

/** List media not yet attached to a project (upload picker). */
export async function GET(request: NextRequest) {
  const owner = await requireOwnerApi();
  if (!owner) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const scope = request.nextUrl.searchParams.get("scope");
  if (scope === "unattached") {
    const media = await listUnattachedMedia();
    return NextResponse.json({ ok: true, media });
  }

  return NextResponse.json({ ok: true, media: [] });
}

/** Store an uploaded image/video (owner only). */
export async function POST(request: NextRequest) {
  const owner = await requireOwnerApi();
  if (!owner) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  const kindField = form.get("kind");
  const kind = kindField === "video" ? "video" : "image";
  const altText = typeof form.get("altText") === "string" ? (form.get("altText") as string) : undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
  }

  const result = await uploadMedia({ file, kind, altText });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  }
  return NextResponse.json({ ok: true, media: result.media }, { status: 201 });
}
