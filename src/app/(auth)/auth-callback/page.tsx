"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken, setUserInfo } from "@/lib/auth";
import { getMe } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access_token = searchParams.get("access_token");

    if (access_token) {
      // 1. Save access token to localStorage
      setToken(access_token);

      // 2. Fetch user info using the token
      getMe()
        .then((user) => {
          // 3. Save user info to localStorage
          setUserInfo(user);

          // 4. Redirect to dashboard based on role
          if (user.role === "mentor") {
            router.push("/welcome/mentor");
          } else {
            router.push("/welcome/student");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user info:", err);
          setError("Failed to complete authentication. Please try logging in again.");
          setTimeout(() => router.push("/login"), 3000);
        });
    } else {
      setError("No authentication token found.");
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm w-full">
        {error ? (
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Finalizing Login</h2>
            <p className="text-sm text-gray-500 text-center">
              Please wait while we sync your account information...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
