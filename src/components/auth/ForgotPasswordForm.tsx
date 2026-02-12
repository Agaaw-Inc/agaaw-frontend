"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, ForgotPasswordType } from "@/lib/validators/auth";
import { useState } from "react";

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
        <div className="flex flex-col space-y-6">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-2">
                <Image
                    src="/agaaw_logo_noBG.png"
                    alt="Agaaw Logo"
                    width={50}
                    height={50}
                    className="object-contain mb-1"
                />

                <span className="text-xl font-semibold text-codgray leading-none mb-2">
                    Agaaw
                </span>

                <h1 className="text-lg font-medium text-codgray mt-1 leading-none">
                    Forgot Password?
                </h1>

                <p className="text-xs text-bombay/80 mt-2 text-center max-w-[250px]">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {success ? (
                <div className="text-center space-y-4">
                    <div className="bg-elm/10 text-elm p-4 rounded-lg text-sm">
                        Check your email for a reset link.
                    </div>
                    <Link href="/login" className="text-elm hover:underline text-sm block">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-codgray">Email</label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="w-full flex flex-col items-center space-y-4 pt-2">
                        <Button
                            className="w-full sm:w-1/2 flex justify-center items-center"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? "Sending..." : "Send Link"}
                        </Button>

                        <Link href="/login" className="text-xs text-bombay hover:text-elm transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}
