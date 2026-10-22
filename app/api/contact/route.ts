import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas/contact";
import { EmailConfigError, isEmailConfigured, sendContactEmail } from "@/lib/email/send-contact";
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rate-limit";
import { createInquiry } from "@/server/services/contact";

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

  const configured = isEmailConfigured();
  let emailSent = false;
  let failure: "unconfigured" | "send" | null = configured ? null : "unconfigured";

  if (configured) {
    try {
      await sendContactEmail(data);
      emailSent = true;
    } catch (error) {
      failure = error instanceof EmailConfigError ? "unconfigured" : "send";
      if (failure === "unconfigured") {
        console.error(
          "[contact] Email provider is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
        );
      } else {
        console.error("[contact] Failed to send enquiry email.");
      }
    }
  } else {
    console.error(
      "[contact] Email provider is not configured. The enquiry was saved to the dashboard inbox.",
    );
  }

  // Persist the enquiry whether or not email delivery succeeded, so nothing is lost.
  try {
    await createInquiry(data, { emailSent });
  } catch {
    console.error("[contact] Failed to persist the enquiry.");
    if (!emailSent) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Something went wrong saving your enquiry. Please try again or email the studio directly.",
        },
        { status: 500 },
      );
    }
  }

  pruneRateLimitBuckets();

  if (failure === "unconfigured") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Your message was saved for the studio, but the email service is not yet configured.",
        code: "EMAIL_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  if (failure === "send") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Your message was saved for the studio, but the confirmation email could not be sent. We will still see it.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you — your enquiry has been sent.",
  });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
