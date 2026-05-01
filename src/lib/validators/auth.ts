import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
    .object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// ─── Admin Login ─────────────────────────────────────────────
// Separate schema for admin auth — currently mirrors LoginSchema,
// but can diverge later (e.g., add 2FA code, captcha token, etc.)
export const AdminLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type RegisterType = z.infer<typeof RegisterSchema>;
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
export type AdminLoginType = z.infer<typeof AdminLoginSchema>;
