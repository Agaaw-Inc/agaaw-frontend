import { z } from "zod";

export const countrySchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and use - only"),

  name: z.string().min(2, "Country name is required"),
  shortIntro: z.string().min(10, "Short intro must be at least 10 characters"),

  opportunities: z.array(z.string().min(2)).min(1, "Add at least one opportunity"),
  universities: z.array(z.string().min(2)).min(1, "Add at least one university"),
  howToApply: z.array(z.string().min(2)).min(1, "Add at least one step"),
  jobOpportunities: z
    .array(z.string().min(2))
    .min(1, "Add at least one job opportunity"),

  whenToApply: z.string().min(10, "When to apply must be at least 10 characters"),
  visaPolicy: z.string().min(10, "Visa policy must be at least 10 characters"),
  avgCost: z.string().min(5, "Average cost must be at least 5 characters"),
});

export type CountryFormValues = z.infer<typeof countrySchema>;