import { z } from "zod";

export const serviceOptions = [
  "Residential Interior Design",
  "Commercial Interior Design",
  "Space Planning & Layout",
  "Furniture Selection & Styling",
  "Interior Decoration & Finishing",
  "Renovation & Remodelling Consultation",
  "Colour Consultation",
  "Custom Interior Concept",
  "Not sure yet — please advise",
] as const;

export const propertyTypeOptions = [
  "Apartment",
  "House",
  "Villa",
  "Office",
  "Retail space",
  "Hospitality space",
  "Other",
] as const;

export const budgetOptions = [
  "Prefer not to say",
  "Under 10,000",
  "10,000 – 25,000",
  "25,000 – 50,000",
  "50,000 – 100,000",
  "100,000+",
] as const;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z
    .email("Please enter a valid email address.")
    .max(200, "Email is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  service: z.enum(serviceOptions, {
    message: "Please choose a service.",
  }),
  propertyType: z.enum(propertyTypeOptions, {
    message: "Please choose a property type.",
  }),
  projectLocation: z
    .string()
    .trim()
    .min(2, "Please tell us where the project is located.")
    .max(160, "Location is too long."),
  budget: z.enum(budgetOptions).optional().or(z.literal("")),
  startDate: z.string().trim().max(40).optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(20, "Please describe your project in at least 20 characters.")
    .max(4000, "Please keep your message under 4000 characters."),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please accept the privacy notice to continue.",
    }),
  // Simple honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactFormDefaults: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  service: "Not sure yet — please advise",
  propertyType: "Apartment",
  projectLocation: "",
  budget: "Prefer not to say",
  startDate: "",
  description: "",
  consent: false,
  company: "",
};
