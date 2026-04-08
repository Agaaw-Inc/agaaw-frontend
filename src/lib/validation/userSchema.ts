import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  role: z.enum(["student", "mentor"]),
  profile_image: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  is_verified: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const editUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});
