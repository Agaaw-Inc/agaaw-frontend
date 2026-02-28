import { z } from "zod";

export const scholarshipSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and use - only"),
  name: z.string().min(3, "Name is required"),
  provider: z.string().min(2, "Provider is required"),
  country: z.string().min(2, "Country is required"),
  level: z.string().min(2, "Level is required"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  benefits: z.array(z.string().min(2)).min(1, "Add at least one benefit"),
  eligibility: z.array(z.string().min(2)).min(1, "Add at least one eligibility"),
  applicationSteps: z
    .array(z.string().min(2))
    .min(1, "Add at least one step"),

  officialLink: z.string().url("Must be a valid URL"),
});

export type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;