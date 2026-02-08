"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterType } from "@/lib/validators/auth";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm({ role }: { role: "student" | "mentor" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const roleLabel =
    role === "student" ? "Register as a Student" : "Register as a Mentor";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    setLoading(true);
    // Mock registration delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Registered as ${role} with:`, data);
    setLoading(false);

    if (role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/dashboard/mentor");
    }
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
          Create Account
        </p>

        <p className="text-xs text-bombay/80 mt-1 leading-none">
          {roleLabel}
        </p>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-codgray">Full Name</label>
          <Input
            placeholder="Enter your full name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

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
            placeholder="Create a password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-codgray">
            Confirm Password
          </label>
          <Input
            placeholder="Confirm your password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            className="w-1/2 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-bombay">
        Already have an account?{" "}
        <Link href="/login" className="text-elm hover:underline">
          Sign In
        </Link>
      </p>

    </div>
  );
}
