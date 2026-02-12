"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "@/lib/validators/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    setLoading(true);
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Logged in with:", data);
    setLoading(false);
    router.push("/dashboard/student"); // Default redirect for now
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

        <p className="text-sm text-bombay mt-1 leading-none">
          Welcome Back
        </p>

        <p className="text-xs text-bombay/80 mt-1 leading-none">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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

        <div>
          <label className="text-sm font-medium text-codgray">Password</label>
          <Input
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
          <div className="flex justify-end mt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-bombay hover:text-elm transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="w-full flex justify-center pt-2">
          <Button
            className="w-1/3 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-bombay">
        Don&apos;t have an account?{" "}
        <Link href="/register/student" className="text-elm hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
