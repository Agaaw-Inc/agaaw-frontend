"use client";

import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "@/lib/validators/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/api";
import { setToken, setUserInfo } from "@/lib/auth";

import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(data);
      setToken(response.access_token);
      setUserInfo(response.user);

      const role = response.user.role;
      if (redirect) {
        router.push(redirect);
      } else if (role === "mentor") {
        router.push("/dashboard/mentor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-6 text-center">
        <Image
          src="/Agaaw_logo_noBG.png"
          alt="Agaaw Logo"
          width={100}
          height={32}
          className="object-contain mb-4"
        />
        <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
      </div>

      {/* Social Logins */}
      <div className="space-y-2 mb-4">
        <button type="button" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`} className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Image src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width={20} height={20} alt="Google" />
          <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
        </button>
        <button type="button" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/facebook`} className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Image src="https://www.vectorlogo.zone/logos/facebook/facebook-official.svg" width={20} height={20} alt="Facebook" />
          <span className="text-sm font-semibold text-gray-700">Continue with Facebook</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-bold">OR</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            placeholder="Email or Username"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Input
            placeholder="Password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA]" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#20B2AA] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="w-full pt-1">
          <Button
            className="w-full flex justify-center items-center py-4 text-base"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register/student" className="text-[#20B2AA] font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
