"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUserInfo } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = getToken();
        const user = getUserInfo();

        if (!token || !user) {
            router.push("/login");
        } else if (user.role !== "mentor") {
            router.push(`/dashboard/${user.role}`);
        } else if (user.onboardingCompleted === false) {
            router.push("/register/mentor/onboarding");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Checking authorization...</p>
            </div>
        );
    }

    return <>{children}</>;
}
