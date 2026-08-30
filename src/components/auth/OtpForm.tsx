"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { verifyEmail, resendVerification, loginUser } from "@/lib/api";
import { setToken, setUserInfo } from "@/lib/auth";

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const role = searchParams.get("role");
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = element.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Only take the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError(null);
    try {
      const response = await verifyEmail(otpValue);
      
      // Attempt auto-login if backend returns token directly
      if (response && response.access_token && response.user) {
        setToken(response.access_token);
        setUserInfo(response.user);

        if (!response.user.onboardingCompleted) {
          if (role === "mentor") {
            router.push("/register/mentor/onboarding");
          } else {
            router.push("/register/student/student-onboarding");
          }
        } else {
          if (role === "mentor") {
            router.push("/dashboard/mentor");
          } else {
            router.push("/dashboard/student");
          }
        }
        return;
      } else {
        // Fallback: auto-login using the password saved in sessionStorage during registration
        const tempPassword = sessionStorage.getItem("temp_reg_password");
        if (email && tempPassword) {
          try {
            const loginResponse = await loginUser({ email, password: tempPassword });
            if (loginResponse && loginResponse.access_token && loginResponse.user) {
              setToken(loginResponse.access_token);
              setUserInfo(loginResponse.user);

              // Clean up temporary password
              sessionStorage.removeItem("temp_reg_password");

              if (!loginResponse.user.onboardingCompleted) {
                if (role === "mentor") {
                  router.push("/register/mentor/onboarding");
                } else {
                  router.push("/register/student/student-onboarding");
                }
              } else {
                if (role === "mentor") {
                  router.push("/dashboard/mentor");
                } else {
                  router.push("/dashboard/student");
                }
              }
              return;
            }
          } catch (loginErr) {
            console.error("Auto-login after OTP verification failed:", loginErr);
            // Fall through to manual login redirect
          }
        }
      }

      // If no token is returned, fallback to login page
      let redirectUrl = "/login";
      if (role === "student") {
        redirectUrl = `/login?redirect=${encodeURIComponent("/register/student/student-onboarding")}`;
      } else if (role === "mentor") {
        redirectUrl = `/login?redirect=${encodeURIComponent("/register/mentor/onboarding")}`;
      }
      
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please try registering again.");
      return;
    }

    setResending(true);
    setError(null);
    setSuccess(null);
    try {
      await resendVerification(email);
      setSuccess("Verification code resent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <Image
          src="/Agaaw_logo_noBG.png"
          alt="Agaaw Logo"
          width={120}
          height={40}
          className="object-contain mb-6"
        />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-sm text-gray-600 leading-relaxed px-4">
          We&apos;ve sent a 6-digit code to your email address.
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-md text-sm border border-green-200 text-center">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          ))}
        </div>

        <div className="w-full">
          <Button
            className="w-full flex justify-center items-center py-4 text-base"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Didn&apos;t receive the code?{" "}
        <button 
          type="button" 
          onClick={handleResend}
          disabled={resending}
          className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
