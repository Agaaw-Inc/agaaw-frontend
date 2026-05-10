"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordType } from "@/lib/validators/auth";
import { useState } from "react";
import { resetPassword } from "@/lib/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordType>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordType) => {
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await resetPassword({
                token,
                password: data.password,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token && !success) {
        return (
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
                <p className="text-red-600 font-medium">Invalid or expired reset link.</p>
                <Link href="/forgot-password" className="mt-4 inline-block text-blue-600 hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <Image
                    src="/Agaaw_logo_noBG.png"
                    alt="Agaaw Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                />
            </div>

            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Set new password</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Please choose a strong password that you haven&apos;t used before.
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200 text-center">
                    {error}
                </div>
            )}

            {success ? (
                <div className="text-center space-y-6">
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-100">
                        Password has been reset successfully!
                    </div>
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline text-sm block">
                        Log in with new password
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="New password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            placeholder="Confirm new password"
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="w-full pt-2">
                        <Button
                            className="w-full flex justify-center items-center py-4 text-base"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
