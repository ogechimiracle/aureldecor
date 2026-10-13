import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas/contact";
import { EmailConfigError, isEmailConfigured, sendContactEmail } from "@/lib/email/send-contact";
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "We could not read your request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please review the highlighted fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: if this hidden field has content, treat as spam and silently succeed.
  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true, message: "Thank you for your enquiry." });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });

  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many submissions. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  if (!isEmailConfigured()) {
    // Clear, actionable configuration error — no secrets are exposed.
    console.error(
      "[contact] Email provider is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "The contact form is not yet connected to an email service. Please email the studio directly in the meantime.",
        code: "EMAIL_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  try {
    await sendContactEmail(data);
    pruneRateLimitBuckets();
    return NextResponse.json({
      ok: true,
      message: "Thank you — your enquiry has been sent.",
    });
  } catch (error) {
    if (error instanceof EmailConfigError) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "The contact form is not yet connected to an email service. Please email the studio directly in the meantime.",
          code: "EMAIL_NOT_CONFIGURED",
        },
        { status: 503 },
      );
    }

    console.error("[contact] Failed to send enquiry email.");
    return NextResponse.json(
      {
        ok: false,
        message:
          "Something went wrong sending your enquiry. Please try again or email the studio directly.",
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
