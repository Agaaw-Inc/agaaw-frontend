"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import StudentWelcome from "@/components/dashboard/student/StudentWelcome";
import CategoryRail from "@/components/dashboard/student/CategoryRail";
import ScholarshipBoard from "@/components/dashboard/student/ScholarshipBoard";
import SuggestedMentors from "@/components/dashboard/student/SuggestedMentors";
import SuggestedReading from "@/components/dashboard/student/SuggestedReading";
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
 * The student's home, shaped by the categories they chose: mentors and
 * reading for those areas, and the scholarship tools only if they're
 * studying abroad.
 */
export default function StudentDashboardPage() {
    const user = useSyncExternalStore(subscribeToUserStore, getStoredUser, () => null);
    const { data, isLoading, setData } = useStudentDashboard();

    const mySlugs = useMemo(() => new Set(data.myCategories.map((c) => c.slug)), [data.myCategories]);
    // Students who haven't picked yet (older accounts) see everything.
    const studyingAbroad = mySlugs.size === 0 || mySlugs.has("study-abroad");

    return (
        <div className="min-h-screen bg-paper">
            <div className="mx-auto max-w-7xl space-y-12 px-6 py-10 md:py-14">
                <StudentWelcome
                    firstName={user?.firstName || "there"}
                    sessions={data.sessions}
                    // Deadlines only count for students who are studying abroad.
                    scholarships={studyingAbroad ? data.scholarships : []}
                    isLoading={isLoading}
                />

                <CategoryRail categories={data.categories} mySlugs={mySlugs} isLoading={isLoading} />

                <SuggestedMentors
                    mentors={data.mentors}
                    myCategories={data.myCategories}
                    connections={data.connections}
                    pendingMentorIds={data.pendingMentorIds}
                    isLoading={isLoading}
                />

                {studyingAbroad ? (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <ScholarshipBoard
                            scholarships={data.scholarships}
                            savedIds={data.savedIds}
                            targetCountries={data.targetCountries}
                            isLoading={isLoading}
                            onSavedChange={(savedIds) => setData((d) => ({ ...d, savedIds }))}
                        />
                        <div className="space-y-6">
                            <MyMentorsCard mentors={data.connections} isLoading={isLoading} />
                            <TargetCountriesCard countries={data.targetCountries} isLoading={isLoading} />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        <SuggestedReading blogs={data.blogs} myCategories={data.myCategories} isLoading={isLoading} />
                        <MyMentorsCard mentors={data.connections} isLoading={isLoading} />
                    </div>
                )}

                {studyingAbroad && <SuggestedReading blogs={data.blogs} myCategories={data.myCategories} isLoading={isLoading} />}
            </div>

            <Footer />
        </div>
    );
}
