"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import MentorsSection from "@/components/dashboard/student/MentorsSection";
import UpcomingDeadlines from "@/components/dashboard/student/UpcomingDeadlines";
import MatchingCountries from "@/components/dashboard/student/MatchingCountries";
import MatchingScholarships from "@/components/dashboard/student/MatchingScholarships";
import ConnectedMentors from "@/components/dashboard/student/ConnectedMentors";
import UpcomingSessions from "@/components/dashboard/student/UpcomingSessions";
import ScholarshipsPreview from "@/components/scholarships/ScholarshipsPreview";
import CountriesPreview from "@/components/countries/CountriesPreview";
import BlogsPreview from "@/components/shared/BlogsPreview";
import Footer from "@/components/landing/Footer";
import { getToken, getUserInfo, type UserInfo } from "@/lib/auth";

function getStoredUser(): UserInfo | null {
    const token = getToken();
    const userInfo = getUserInfo();
    return token && userInfo ? userInfo : null;
}

function subscribeToUserStore(onStoreChange: () => void) {
    if (typeof window === "undefined") return () => { };
    window.addEventListener("storage", onStoreChange);
    window.addEventListener("focus", onStoreChange);
    window.addEventListener("agaaw-auth-change", onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("focus", onStoreChange);
        window.removeEventListener("agaaw-auth-change", onStoreChange);
    };
}

export default function StudentDashboardPage() {
    const user = useSyncExternalStore(subscribeToUserStore, getStoredUser, () => null);

    const userFirstName = user?.firstName || "Student";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                            Welcome back, {userFirstName}
                        </h1>
                        <p className="text-gray-600 text-base">
                            Your journey to world-class education continues here.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/mentors"
                            className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                            <Search size={18} />
                            Find a mentor
                        </Link>
                        <Link
                            href="/dashboard/student/checklist"
                            className="flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                        >
                            View Checklist
                        </Link>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <UpcomingDeadlines />

                {/* Profile Matches */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <MatchingCountries />
                    <MatchingScholarships />
                </div>

                {/* Mentors & Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ConnectedMentors />
                    <UpcomingSessions />
                </div>

                {/* Discovery Modules */}
                <div className="space-y-4">
                    <MentorsSection />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                        </div>
                        <CountriesPreview />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                        </div>
                        <ScholarshipsPreview />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                        </div>
                        <BlogsPreview />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
