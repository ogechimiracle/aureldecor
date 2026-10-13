/**
 * Server-only email delivery.
 * This module reads secrets from the environment and must never be imported
 * into a Client Component.
 */
import { Resend } from "resend";
import { buildContactEmail } from "@/lib/email/templates";
import type { ContactFormValues } from "@/lib/schemas/contact";

export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.CONTACT_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL,
  );
}

export async function sendContactEmail(data: ContactFormValues) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    throw new EmailConfigError(
      "Email delivery is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
    );
  }

  const { subject, html, text } = buildContactEmail(data);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    text,
    replyTo: data.email,
  });

  if (error) {
    throw new Error(`Email provider error: ${error.message}`);
  }
}
