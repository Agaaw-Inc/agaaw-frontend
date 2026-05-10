import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  flagImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  currency: z.string().optional(),
  language: z.string().optional(),
  tuitionCost: z.string().optional(),
  workRights: z.string().optional(),
  visaInfo: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
  sections: z.array(z.object({
    sectionKey: z.string(),
    content: z.string(),
    order: z.number(),
  })).optional(),
});

export type CountryFormValues = z.infer<typeof countrySchema>;