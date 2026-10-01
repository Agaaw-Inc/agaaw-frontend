"use client";

import React, { useSyncExternalStore } from "react";
import MentorsSection from "@/components/dashboard/student/MentorsSection";
import StudentWelcome from "@/components/dashboard/student/StudentWelcome";
import CategoryRail from "@/components/dashboard/student/CategoryRail";
import ScholarshipBoard from "@/components/dashboard/student/ScholarshipBoard";
import { MyMentorsCard, TargetCountriesCard } from "@/components/dashboard/student/DashboardSideCards";
import Footer from "@/components/landing/Footer";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
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

/**
 * The student's home: what's next, where to get help, and scholarships that
 * fit them — instead of every preview on the site stacked in one column.
 */
export default function StudentDashboardPage() {
    const user = useSyncExternalStore(subscribeToUserStore, getStoredUser, () => null);
    const { data, isLoading, setData } = useStudentDashboard();

    return (
        <div className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl space-y-12 px-6 py-10 md:py-14">
                <StudentWelcome
                    firstName={user?.firstName || "there"}
                    sessions={data.sessions}
                    scholarships={data.scholarships}
                    isLoading={isLoading}
                />

                <CategoryRail categories={data.categories} isLoading={isLoading} />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <ScholarshipBoard
                        scholarships={data.scholarships}
                        savedIds={data.savedIds}
                        targetCountries={data.targetCountries}
                        isLoading={isLoading}
                        onSavedChange={(savedIds) => setData((d) => ({ ...d, savedIds }))}
                    />
                    <div className="space-y-6">
                        <MyMentorsCard mentors={data.mentors} isLoading={isLoading} />
                        <TargetCountriesCard countries={data.targetCountries} isLoading={isLoading} />
                    </div>
                </div>

                <MentorsSection />
            </div>

            <Footer />
        </div>
    );
}
