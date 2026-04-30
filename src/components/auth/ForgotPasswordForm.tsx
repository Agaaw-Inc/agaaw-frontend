"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordType } from "@/lib/validators/auth";
import { useState } from "react";

import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordType>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordType) => {
        setLoading(true);
        // Mock password reset delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Password reset requested for:", data);
        setLoading(false);
        setSuccess(true);
    };

    return (
        <div className="flex flex-col w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-8 relative">
                <Link
                    href="/login"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-900 hover:text-blue-600 transition-colors"
                >
                    <ChevronLeft size={24} />
                </Link>
                <Image
                    src="/agaaw_logo_noBG.png"
                    alt="Agaaw Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                />
            </div>

            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reset your password</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Enter your Agaaw email address so we can reset your password.
                </p>
            </div>

            {success ? (
                <div className="text-center space-y-6">
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm font-medium border border-blue-100">
                        Check your email for a reset link.
                    </div>
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline text-sm block">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Input
                            placeholder="Enter email"
                            type="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="w-full pt-2">
                        <Button
                            className="w-full flex justify-center items-center py-4 text-base"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "Sending..." : "Next"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
