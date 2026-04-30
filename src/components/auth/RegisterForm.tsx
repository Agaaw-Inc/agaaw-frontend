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
import { registerUser } from "@/lib/api";

import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm({ role }: { role: "student" | "mentor" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: role,
      });
      router.push("/otp");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const roleLabel =
    role === "student" ? "Register as a Student" : "Register as a Mentor";

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-4 text-center">
        <Image
          src="/agaaw_logo_noBG.png"
          alt="Agaaw Logo"
          width={100}
          height={32}
          className="object-contain mb-3"
        />
        <h4 className="text-xl font-semibold text-gray-900">{roleLabel}</h4>
      </div>

      {/* Social Logins */}
      <div className="space-y-2 mb-4">
        <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Image src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width={20} height={20} alt="Google" />
          <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
        </button>
        <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
        <div className="mb-3 bg-red-50 text-red-500 p-2 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              placeholder="First Name"
              {...register("firstName")}
              className="border-gray-200 focus:border-[#20B2AA]"
            />
            {errors.firstName && (
              <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Input
              placeholder="Last Name"
              {...register("lastName")}
              className="border-gray-200 focus:border-[#20B2AA]"
            />
            {errors.lastName && (
              <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            placeholder="Email"
            type="email"
            {...register("email")}
            className="border-gray-200 focus:border-[#20B2AA]"
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
            className="border-gray-200 focus:border-[#20B2AA] pr-10"
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

        <div className="flex items-start gap-2 py-1">
          <input
            type="checkbox"
            required
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA]"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to the Agaaw <Link href="#" className="text-[#20B2AA] hover:underline">User Agreement</Link> and <Link href="#" className="text-[#20B2AA] hover:underline">Privacy Policy</Link>.
          </span>
        </div>

        <div className="w-full pt-1">
          <Button
            className="w-full flex justify-center items-center py-4 text-base bg-gray-900"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Agaaw"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center space-y-2 border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#20B2AA] font-semibold hover:underline">
            Log in
          </Link>
        </div>

        <div className="text-sm">
          {role === "student" ? (
            <Link href="/register/mentor" className="text-gray-500 hover:text-[#20B2AA] transition-colors font-medium">
              Join as a mentor
            </Link>
          ) : (
            <Link href="/register/student" className="text-gray-500 hover:text-[#20B2AA] transition-colors font-medium">
              Join as a student
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
