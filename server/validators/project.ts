import { z } from "zod";
import { isValidVideoUrl } from "@/lib/media/video-url";

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .max(160, "Slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only (e.g. meadowbrook-residence).",
  );

const optionalShort = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional().or(z.literal(""));

export const challengeSchema = z.object({
  challenge: z.string().trim().min(3, "Describe the challenge.").max(300),
  solution: z.string().trim().min(3, "Describe the solution.").max(600),
});

export const swatchSchema = z.object({
  name: z.string().trim().min(1, "Name the colour.").max(40),
  hex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Use a hex colour such as #E4DBCB."),
});

export const projectFormSchema = z.object({
  title: z.string().trim().min(2, "Enter a project title.").max(120),
  slug: slugSchema,
  shortDescription: z
    .string()
    .trim()
    .min(10, "Write a short summary of at least 10 characters.")
    .max(300, "Keep the summary under 300 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Write a description of at least 20 characters.")
    .max(12000, "Keep the description under 12,000 characters."),
  categoryId: z.string().min(1, "Choose a primary category."),
  additionalCategoryIds: z.array(z.string()).max(5).default([]),
  location: optionalShort(160),
  completionDate: optionalShort(40),
  propertyType: optionalShort(80),
  area: optionalShort(40),
  mediaType: z.enum(["image", "video", "mixed"]).default("image"),
  videoUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isValidVideoUrl(value), {
      message:
        "Use a YouTube, Vimeo or direct .mp4/.webm URL starting with https://.",
    }),
  brief: optionalShort(2000),
  concept: optionalShort(4000),
  challenges: z.array(challengeSchema).max(10).default([]),
  materials: z.array(z.string().trim().min(1).max(80)).max(24).default([]),
  palette: z.array(swatchSchema).max(12).default([]),
  outcomes: z.array(z.string().trim().min(3).max(240)).max(10).default([]),
  coverMediaId: z.string().nullable().default(null),
  mediaIds: z.array(z.string()).max(60).default([]),
  beforeAfterMediaIds: z
    .object({
      before: z.string().nullable().default(null),
      after: z.string().nullable().default(null),
    })
    .default({ before: null, after: null }),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const projectFormDefaults: ProjectFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  additionalCategoryIds: [],
  location: "",
  completionDate: "",
  propertyType: "",
  area: "",
  mediaType: "image",
  videoUrl: "",
  brief: "",
  concept: "",
  challenges: [],
  materials: [],
  palette: [],
  outcomes: [],
  coverMediaId: null,
  mediaIds: [],
  beforeAfterMediaIds: { before: null, after: null },
  status: "draft",
  featured: false,
};

/** Search / filter schema for the admin project list. */
export const projectListQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  status: z.enum(["all", "draft", "published"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
});

export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
