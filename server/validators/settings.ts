import { z } from "zod";

const optional = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional().or(z.literal(""));

export const brandSettingsSchema = z.object({
  brandName: z.string().trim().min(1, "Enter the business name.").max(80),
  wordmark: z.string().trim().min(1, "Enter a wordmark.").max(24),
  tagline: optional(140),
  description: optional(400),
});

export const contactSettingsSchema = z.object({
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Enter a valid email address.",
    }),
  phone: optional(40),
  whatsapp: optional(40),
  address: optional(160),
  serviceArea: optional(160),
});

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  href: z
    .string()
    .trim()
    .url("Enter a full URL, including https://")
    .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {
      message: "Only http(s) links are allowed.",
    }),
  icon: z.enum(["instagram", "facebook", "pinterest", "linkedin"]),
});

export const socialSettingsSchema = z.object({
  social: z.array(socialLinkSchema).max(8),
});

export const seoSettingsSchema = z.object({
  seoTitle: optional(70),
  seoDescription: optional(180),
});

export const homeSettingsSchema = z.object({
  heroEyebrow: optional(120),
  heroTitle: optional(140),
  heroDescription: optional(400),
  studioTitle: optional(160),
  studioBody: optional(500),
  ctaTitle: optional(140),
  ctaDescription: optional(400),
});

export type BrandSettings = z.infer<typeof brandSettingsSchema>;
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
export type SocialSettings = z.infer<typeof socialSettingsSchema>;
export type SeoSettings = z.infer<typeof seoSettingsSchema>;
export type HomeSettings = z.infer<typeof homeSettingsSchema>;
