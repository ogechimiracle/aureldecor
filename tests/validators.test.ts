import { describe, expect, it } from "vitest";
import {
  projectFormSchema,
  projectListQuerySchema,
  slugSchema,
} from "@/server/validators/project";
import { categoryFormSchema } from "@/server/validators/category";
import {
  brandSettingsSchema,
  homeSettingsSchema,
  socialLinkSchema,
} from "@/server/validators/settings";
import {
  changePasswordSchema,
  loginSchema,
  ownerSetupSchema,
} from "@/server/validators/auth";

const validProject = {
  title: "Harbour Loft",
  slug: "harbour-loft",
  shortDescription: "A light-filled loft overlooking the harbour.",
  description:
    "A complete renovation of a waterfront loft with a restrained palette and custom joinery throughout.",
  categoryId: "category-1",
};

describe("projectFormSchema", () => {
  it("applies sensible defaults", () => {
    const parsed = projectFormSchema.parse(validProject);
    expect(parsed.status).toBe("draft");
    expect(parsed.featured).toBe(false);
    expect(parsed.mediaType).toBe("image");
    expect(parsed.additionalCategoryIds).toEqual([]);
    expect(parsed.challenges).toEqual([]);
    expect(parsed.beforeAfterMediaIds).toEqual({ before: null, after: null });
  });

  it("rejects punctuation in slugs and short summaries", () => {
    const result = projectFormSchema.safeParse({
      ...validProject,
      slug: "Harbour Loft!",
      shortDescription: "Too short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0]);
      expect(fields).toContain("slug");
      expect(fields).toContain("shortDescription");
    }
  });

  it("validates optional video URLs", () => {
    expect(
      projectFormSchema.safeParse({
        ...validProject,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      }).success,
    ).toBe(true);
    expect(
      projectFormSchema.safeParse({
        ...validProject,
        videoUrl: "https://example.com/not-a-video",
      }).success,
    ).toBe(false);
  });

  it("normalises list query defaults", () => {
    expect(projectListQuerySchema.parse({})).toEqual({ status: "all", page: 1 });
  });
});

describe("slugSchema", () => {
  it("accepts lowercase kebab-case", () => {
    expect(slugSchema.safeParse("living-room-2025").success).toBe(true);
  });

  it("rejects leading, trailing and doubled hyphens", () => {
    for (const slug of ["-room", "room-", "living--room", "Living Room"]) {
      expect(slugSchema.safeParse(slug).success).toBe(false);
    }
  });
});

describe("categoryFormSchema", () => {
  it("coerces the sort order and trims fields", () => {
    const parsed = categoryFormSchema.parse({
      name: "  Lighting  ",
      slug: "lighting",
      description: "",
      sortOrder: "3",
    });
    expect(parsed.name).toBe("Lighting");
    expect(parsed.sortOrder).toBe(3);
  });
});

describe("settings schemas", () => {
  it("requires a brand name and wordmark", () => {
    expect(
      brandSettingsSchema.safeParse({ brandName: "", wordmark: "" }).success,
    ).toBe(false);
    expect(
      brandSettingsSchema.safeParse({
        brandName: "Aurelia Interiors",
        wordmark: "AURELIA",
      }).success,
    ).toBe(true);
  });

  it("only allows http(s) social links with known icons", () => {
    expect(
      socialLinkSchema.safeParse({
        label: "Instagram",
        href: "https://instagram.com/studio",
        icon: "instagram",
      }).success,
    ).toBe(true);
    expect(
      socialLinkSchema.safeParse({
        label: "Bad",
        href: "javascript:alert(1)",
        icon: "instagram",
      }).success,
    ).toBe(false);
    expect(
      socialLinkSchema.safeParse({
        label: "Other",
        href: "https://example.com",
        icon: "tiktok",
      }).success,
    ).toBe(false);
  });

  it("accepts blank homepage copy", () => {
    expect(homeSettingsSchema.safeParse({}).success).toBe(true);
  });
});

describe("auth schemas", () => {
  it("validates login emails", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });

  it("requires 12 character passwords", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "old-password-123",
        newPassword: "short",
        confirmPassword: "short",
      }).success,
    ).toBe(false);
  });

  it("requires matching passwords on setup", () => {
    const base = {
      name: "Studio Owner",
      email: "owner@example.com",
      password: "aurelia-owner-pw-2026",
      confirmPassword: "different-password",
    };
    expect(ownerSetupSchema.safeParse(base).success).toBe(false);
    expect(
      ownerSetupSchema.safeParse({
        ...base,
        confirmPassword: "aurelia-owner-pw-2026",
      }).success,
    ).toBe(true);
  });
});
