import { getDb } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { siteConfig } from "@/lib/config";
import type { SocialLink } from "@/types";
import {
  brandSettingsSchema,
  contactSettingsSchema,
  homeSettingsSchema,
  seoSettingsSchema,
  socialSettingsSchema,
} from "@/server/validators/settings";
import type { ActionResult } from "@/server/services/projects";

export interface SiteSettings {
  brand: {
    brandName: string;
    wordmark: string;
    tagline: string;
    description: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    serviceArea: string;
  };
  social: SocialLink[];
  seo: { seoTitle: string; seoDescription: string };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    studioTitle: string;
    studioBody: string;
    ctaTitle: string;
    ctaDescription: string;
  };
}

/**
 * Fallback content — mirrors the original static site so the design and copy
 * are preserved until the owner edits these values in the dashboard.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    brandName: siteConfig.brandName,
    wordmark: siteConfig.wordmark,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
  },
  contact: {
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    address: siteConfig.address,
    serviceArea: siteConfig.serviceArea,
  },
  social: siteConfig.social,
  seo: {
    seoTitle: "",
    seoDescription: "",
  },
  home: {
    heroEyebrow: "Residential & Commercial Interior Design",
    heroTitle: "Spaces Designed to Inspire Living.",
    heroDescription:
      "A full-service interior design studio creating warm, architectural interiors — considered from the first sketch to the final styled room, and built to be lived in for years.",
    studioTitle: "Design that begins with how you actually live.",
    studioBody:
      "I keep the studio intentionally small so every commission receives close, personal attention — from the first conversation to the day the last cushion is placed.",
    ctaTitle: "Have a project in mind?",
    ctaDescription:
      "Let's talk about the space you want to create. Book a consultation and we'll map out how to get there — together.",
  },
};

const SETTING_KEYS = ["brand", "contact", "social", "seo", "home"] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

function isSettingKey(value: string): value is SettingKey {
  return (SETTING_KEYS as readonly string[]).includes(value);
}

function readJson<T>(raw: unknown, fallback: T): T {
  if (
    (typeof raw !== "string" || raw.length === 0) &&
    (raw === null || typeof raw !== "object" || Array.isArray(raw))
  ) {
    return fallback;
  }

  try {
    const parsed =
      typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fallback;
    }
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

/**
 * Read editable site content, merging stored values over the defaults.
 * Never throws — if the database is unavailable the site still renders with
 * its built-in content.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getDb();
    const rows = await db.select().from(settingsTable);
    const byKey = new Map(rows.map((row) => [row.key, row.value]));

    const brand = readJson(byKey.get("brand"), DEFAULT_SETTINGS.brand);
    const contact = readJson(byKey.get("contact"), DEFAULT_SETTINGS.contact);
    const socialSettings = readJson(byKey.get("social"), {
      social: DEFAULT_SETTINGS.social,
    });
    const parsedSocial = socialSettingsSchema.safeParse(socialSettings);
    const social = parsedSocial.success
      ? parsedSocial.data.social
      : DEFAULT_SETTINGS.social;
    const seo = readJson(byKey.get("seo"), DEFAULT_SETTINGS.seo);
    const home = readJson(byKey.get("home"), DEFAULT_SETTINGS.home);

    return { brand, contact, social, seo, home };
  } catch (error) {
    console.error("[settings] falling back to defaults", error);
    return DEFAULT_SETTINGS;
  }
}

export async function getHomeSettings(): Promise<SiteSettings["home"]> {
  const settings = await getSiteSettings();
  return settings.home;
}

const SECTION_SCHEMAS = {
  brand: brandSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  seo: seoSettingsSchema,
  home: homeSettingsSchema,
} as const;

/** Validate and persist one settings section. */
export async function updateSettingsSection(
  key: SettingKey,
  values: unknown,
): Promise<ActionResult> {
  if (!isSettingKey(key)) {
    return { ok: false, error: "Unknown settings section." };
  }

  const schema = SECTION_SCHEMAS[key];
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? key);
      fieldErrors[field] = fieldErrors[field] ?? [];
      fieldErrors[field].push(issue.message);
    }
    return { ok: false, fieldErrors };
  }

  try {
    const db = getDb();
    await db
      .insert(settingsTable)
      .values({ key, value: parsed.data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value: parsed.data, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[settings] update failed", error);
    return { ok: false, error: "Could not save settings." };
  }

  return { ok: true };
}
