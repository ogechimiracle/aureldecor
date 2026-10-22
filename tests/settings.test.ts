import { beforeEach, describe, expect, it, vi } from "vitest";

const settingsRows = vi.hoisted(() => ({
  current: [] as Array<{ key: string; value: unknown }>,
}));

vi.mock("@/db", () => ({
  getDb: () => ({
    select: () => ({
      from: async () => settingsRows.current,
    }),
  }),
}));

import { DEFAULT_SETTINGS, getSiteSettings } from "@/server/services/settings";

describe("getSiteSettings", () => {
  beforeEach(() => {
    settingsRows.current = [];
  });

  it("uses stored JSON objects and merges their partial values over defaults", async () => {
    settingsRows.current = [
      { key: "brand", value: { brandName: "Updated Studio" } },
      { key: "contact", value: { email: "hello@example.com" } },
      { key: "social", value: { social: [] } },
      { key: "seo", value: { seoTitle: "New title" } },
      { key: "home", value: { heroTitle: "New homepage headline" } },
    ];

    const settings = await getSiteSettings();

    expect(settings.brand).toEqual({
      ...DEFAULT_SETTINGS.brand,
      brandName: "Updated Studio",
    });
    expect(settings.contact).toEqual({
      ...DEFAULT_SETTINGS.contact,
      email: "hello@example.com",
    });
    expect(settings.social).toEqual([]);
    expect(settings.seo).toEqual({
      ...DEFAULT_SETTINGS.seo,
      seoTitle: "New title",
    });
    expect(settings.home).toEqual({
      ...DEFAULT_SETTINGS.home,
      heroTitle: "New homepage headline",
    });
  });

  it("continues to read serialized JSON values", async () => {
    settingsRows.current = [
      { key: "brand", value: JSON.stringify({ brandName: "Serialized Studio" }) },
    ];

    const settings = await getSiteSettings();

    expect(settings.brand.brandName).toBe("Serialized Studio");
    expect(settings.brand.wordmark).toBe(DEFAULT_SETTINGS.brand.wordmark);
  });
});
