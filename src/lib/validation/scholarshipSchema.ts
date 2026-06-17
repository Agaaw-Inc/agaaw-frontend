import { z } from "zod";

export const scholarshipSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  provider: z.string().min(1, "Provider is required"),
  countryId: z.string().uuid("Invalid country selection"),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  level: z.array(z.enum(["bachelors", "masters", "phd", "other"])).min(1, "At least one level is required"),
  coverage: z.enum(["fully_funded", "partial", "varies"]),
  deadline: z.string().optional().or(z.literal("")),
  description: z.string().min(10, "Description is too short"),
  benefits: z.string().optional(),
  eligibility: z.string().optional(),
  amount: z.string().optional(),
  howToApply: z.string().min(1, "How to apply is required"),
  requiredDocuments: z.string().min(1, "Required documents are required"),
  officialLink: z.string().url().optional().or(z.literal("")),
  bannerImage: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean(),
  faqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    order: z.number(),
  })).optional(),
});

export type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
