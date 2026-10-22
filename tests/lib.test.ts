import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";
import { isValidVideoUrl, parseVideoUrl } from "@/lib/media/video-url";
import { isValidStorageKey, mediaUrl } from "@/lib/storage";
import {
  detectMime,
  mimeForExtension,
  sanitizeFilename,
  validateUpload,
} from "@/lib/media/file-validation";
import { getCategoryLabel } from "@/lib/data/projects";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Warm Living Room Redesign")).toBe("warm-living-room-redesign");
  });

  it("strips punctuation and trims separators", () => {
    expect(slugify("  Café & Lounge — Paris!  ")).toBe("cafe-lounge-paris");
  });

  it("returns an empty string for non-latin input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("parseVideoUrl", () => {
  it("parses YouTube watch, short and embed URLs", () => {
    expect(parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      id: "dQw4w9WgXcQ",
    });
    expect(parseVideoUrl("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      id: "dQw4w9WgXcQ",
    });
    expect(parseVideoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toEqual({
      kind: "youtube",
      id: "dQw4w9WgXcQ",
    });
  });

  it("parses Vimeo URLs", () => {
    expect(parseVideoUrl("https://vimeo.com/123456789")).toEqual({
      kind: "vimeo",
      id: "123456789",
    });
  });

  it("accepts direct video files and rejects other protocols", () => {
    expect(parseVideoUrl("https://cdn.example.com/tour.mp4")).toEqual({
      kind: "direct",
      url: "https://cdn.example.com/tour.mp4",
    });
    expect(parseVideoUrl("http://cdn.example.com/tour.mp4")).toBeNull();
    expect(parseVideoUrl("javascript:alert(1)")).toBeNull();
    expect(isValidVideoUrl("https://example.com/tour")).toBe(false);
  });
});

describe("storage keys", () => {
  it("validates safe keys", () => {
    expect(isValidStorageKey("aBcD1234efGh.jpeg")).toBe(true);
    expect(isValidStorageKey("../etc/passwd")).toBe(false);
    expect(isValidStorageKey("short.png")).toBe(false);
  });

  it("builds media URLs without double encoding", () => {
    expect(mediaUrl({ storageProvider: "local", storageKey: "aBcD1234efGh.jpeg" })).toBe(
      "/api/media/aBcD1234efGh.jpeg",
    );
    expect(
      mediaUrl({
        storageProvider: "remote",
        storageKey: "https://images.example.com/photo.jpg",
      }),
    ).toBe("https://images.example.com/photo.jpg");
    expect(mediaUrl({ storageProvider: "local", storageKey: "../../secret" })).toBeNull();
  });
});

describe("sanitizeFilename", () => {
  it("strips directories and control characters", () => {
    expect(sanitizeFilename("../../etc/passw\u0000d.png")).toBe("passwd.png");
    expect(sanitizeFilename('a<>:"|?*b.jpg')).toBe("ab.jpg");
    expect(sanitizeFilename("")).toBe("file");
  });
});

describe("file validation", () => {
  it("sniffs PNG and rejects mismatched uploads", () => {
    const png = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]);
    expect(detectMime(png)).toBe("image/png");
    expect(
      validateUpload({
        bytes: png,
        claimedMime: "image/jpeg",
        kind: "image",
        maxBytes: 1024,
      }).ok,
    ).toBe(false);
  });

  it("accepts a jpeg under the size limit", () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
    const result = validateUpload({
      bytes: jpeg,
      claimedMime: "image/jpeg",
      kind: "image",
      maxBytes: 1024,
    });
    expect(result.ok).toBe(true);
  });

  it("maps extensions to MIME types", () => {
    expect(mimeForExtension("jpg")).toBe("image/jpeg");
    expect(mimeForExtension("webm")).toBe("video/webm");
    expect(mimeForExtension("exe")).toBeNull();
  });
});

describe("getCategoryLabel", () => {
  it("uses known labels and prettifies custom slugs", () => {
    expect(getCategoryLabel("living-room")).toBe("Living Room");
    expect(getCategoryLabel("home-office")).toBe("Home Office");
  });
});
