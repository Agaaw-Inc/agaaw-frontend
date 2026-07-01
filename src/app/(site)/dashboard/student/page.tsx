"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Users, Search, GraduationCap } from "lucide-react";
import MentorsSection from "@/components/dashboard/student/MentorsSection";
import ApplicationProgress from "@/components/dashboard/student/ApplicationProgress";
import UpcomingSessions from "@/components/dashboard/student/UpcomingSessions";
import ScholarshipsPreview from "@/components/scholarships/ScholarshipsPreview";
import CountriesPreview from "@/components/countries/CountriesPreview";
import BlogsPreview from "@/components/shared/BlogsPreview";
import Footer from "@/components/landing/Footer";
import { getToken, getUserInfo, type UserInfo } from "@/lib/auth";
import { getMentorCount } from "@/lib/api";

function getStoredUser(): UserInfo | null {
    const token = getToken();
    const userInfo = getUserInfo();
    return token && userInfo ? userInfo : null;
}

function subscribeToUserStore(onStoreChange: () => void) {
    if (typeof window === "undefined") return () => {};
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
    const [mentorCount, setMentorCount] = useState<number | null>(null);

    useEffect(() => {
        getMentorCount()
            .then(setMentorCount)
            .catch(() => setMentorCount(0));
    }, []);

    const userFirstName = user?.firstName || "Student";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* Hero Section & Metrics */}
                <div className="space-y-6">
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

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Active Mentors</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {mentorCount !== null ? mentorCount : (
                                    <span className="inline-block w-12 h-8 bg-gray-100 rounded animate-pulse" />
                                )}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Universities</p>
                            <p className="text-3xl font-bold text-gray-900">500+</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Success Rate</p>
                            <p className="text-3xl font-bold text-teal-600">94%</p>
                        </div>
                        <div className="bg-black rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Next Deadline</p>
                                <p className="text-xl font-bold text-white">DAAD - 12 days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress & Sessions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ApplicationProgress />
                    </div>
                    <div className="lg:col-span-1">
                        <UpcomingSessions />
                    </div>
                </div>

                {/* Discovery Modules */}
                <div className="space-y-12">
                    <MentorsSection />
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Explore Countries</h2>
                        </div>
                        <CountriesPreview />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Scholarships</h2>
                        </div>
                        <ScholarshipsPreview />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Latest Blogs</h2>
                        </div>
                        <BlogsPreview />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
