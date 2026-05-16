"use client";

/**
 * Admin Login Page
 *
 * A dark, minimal, secure-looking login page specifically for admin access.
 * Visually distinct from the student/mentor auth at /(auth)/login.
 *
 * Features:
 * - Dark slate background with subtle grid pattern
 * - Shield icon branding ("Admin Portal")
 * - Form validation via react-hook-form + zod
 * - Error feedback on invalid credentials
 * - Loading state on submit
 * - Auto-redirect if already authenticated
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { AdminLoginSchema, type AdminLoginType } from "@/lib/validators/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginType>({
    resolver: zodResolver(AdminLoginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/internal-hq");
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data: AdminLoginType) => {
    setError(null);
    setSubmitting(true);

    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  // Don't render login form if already authenticated (redirect in progress)
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ── Background grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Subtle glow accent ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#181b23] border border-[#2a2d38] rounded-2xl shadow-2xl p-8">
          {/* ── Header ── */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-teal-400" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to access the control panel
            </p>
          </div>

          {/* ── Error Alert ── */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@agaaw.com"
                {...register("email")}
                className="w-full px-4 py-2.5 bg-[#0f1117] border border-[#2a2d38] rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 py-2.5 pr-11 bg-[#0f1117] border border-[#2a2d38] rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* ── Footer ── */}
          <div className="mt-6 pt-6 border-t border-[#2a2d38]">
            <p className="text-center text-xs text-gray-600">
              Protected area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* ── Branding ── */}
        <p className="text-center text-xs text-gray-700 mt-6">
          Agaaw Admin Console &middot; v1.0
        </p>
      </div>
    </div>
  );
}
