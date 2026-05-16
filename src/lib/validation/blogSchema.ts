import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  authorId: z.string().uuid("Please select an author"),
  category: z.enum(["scholarship", "visa", "career", "general", "test_prep"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  excerpt: z.string().max(300, "Excerpt must be under 300 characters").optional().nullable(),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional().nullable(),
  coverImage: z.string().url("Please enter a valid URL").or(z.string().regex(/^\//, "Internal paths must start with /")).or(z.literal("")).optional().nullable(),
  readTime: z.number().int().min(1).optional().nullable(),
  tags: z.string().optional(), // Comma-separated string in form, processed to string[] for API
  isPublished: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
