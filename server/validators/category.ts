import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Enter a category name.").max(60),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a slug.")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only."),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormDefaults: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
};
