import type { ContactFormValues } from "@/lib/schemas/contact";

export interface ContactEmail {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;font-weight:600;color:#26231f;vertical-align:top;white-space:nowrap;">${escapeHtml(
      label,
    )}</td>
    <td style="padding:8px 12px;color:#3f3a34;">${escapeHtml(value)}</td>
  </tr>`;
}

export function buildContactEmail(data: ContactFormValues): ContactEmail {
  const subject = `New enquiry — ${data.fullName} (${data.service})`;

  const text = [
    "New project enquiry",
    "-------------------",
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `Service: ${data.service}`,
    `Property type: ${data.propertyType}`,
    `Project location: ${data.projectLocation}`,
    data.budget ? `Budget: ${data.budget}` : null,
    data.startDate ? `Preferred start: ${data.startDate}` : null,
    "",
    "Project description:",
    data.description,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f2ec;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ec;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6dfd3;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid #e6dfd3;">
                <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#b0603f;">New project enquiry</p>
                <h1 style="margin:8px 0 0;font-size:20px;color:#26231f;">${escapeHtml(subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Name", data.fullName)}
                  ${row("Email", data.email)}
                  ${row("Phone", data.phone ?? "")}
                  ${row("Service", data.service)}
                  ${row("Property type", data.propertyType)}
                  ${row("Location", data.projectLocation)}
                  ${row("Budget", data.budget ?? "")}
                  ${row("Preferred start", data.startDate ?? "")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;">
                <p style="margin:16px 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6b655c;">Project description</p>
                <p style="margin:0;white-space:pre-wrap;color:#3f3a34;line-height:1.6;">${escapeHtml(
                  data.description,
                )}</p>
              </td>
            </tr>
          </table>
          <p style="max-width:600px;margin:16px auto 0;font-size:12px;color:#8a8378;text-align:center;">
            Sent from the website contact form. The visitor has consented to the privacy notice.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
