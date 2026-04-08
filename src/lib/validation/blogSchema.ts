import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.string().optional(), // comma-separated string, split on save
  is_published: z.boolean().optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
