"use client";

import React, { useEffect, useState } from "react";
import MentorWelcome, { type MentorStat } from "@/components/dashboard/mentor/MentorWelcome";
import EarningsOverview from "@/components/dashboard/mentor/EarningsOverview";
import MentorshipRequests from "@/components/dashboard/mentor/MentorshipRequests";
import ActiveStudents from "@/components/dashboard/mentor/ActiveStudents";
import MentorUpcomingSessions from "@/components/dashboard/mentor/MentorUpcomingSessions";
import MentorReviews from "@/components/dashboard/mentor/MentorReviews";
import MentorBlogs from "@/components/dashboard/mentor/MentorBlogs";
import Footer from "@/components/landing/Footer";
import { getMentorProfile, getConnections, getMentorReviews, type MentorReviewStats } from "@/lib/api";
import { getUserInfo } from "@/lib/auth";

export default function MentorDashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [totalStudents, setTotalStudents] = useState<number | null>(null);
    const [activeStudents, setActiveStudents] = useState<number | null>(null);
    const [reviewStats, setReviewStats] = useState<MentorReviewStats | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMentorProfile();
                setProfile(data);
            } catch (err) {
                console.error("Failed to load mentor profile on dashboard:", err);
            } finally {
                setIsProfileLoading(false);
            }
        };
        fetchProfile();

        const fetchConnectionCounts = async () => {
            try {
                const [active, all] = await Promise.all([getConnections("active"), getConnections()]);
                setActiveStudents(active.length);
                setTotalStudents(all.length);
            } catch (err) {
                console.error("Failed to load connection counts:", err);
            }
        };
        fetchConnectionCounts();

        const user = getUserInfo();
        if (user) {
            getMentorReviews(user.id)
                .then((result) => setReviewStats(result.stats))
                .catch((err) => console.error("Failed to load review stats:", err));
        }
    }, []);

    // Real numbers only — the old "Profile views: coming soon" tile is gone.
    const stats: MentorStat[] = [
        { label: "Students mentored", value: totalStudents === null ? "—" : String(totalStudents), sub: "All time" },
        { label: "Active now", value: activeStudents === null ? "—" : String(activeStudents), sub: "Current students" },
        {
            label: "Average rating",
            value: reviewStats === null ? "—" : reviewStats.totalReviews > 0 ? reviewStats.averageRating.toFixed(1) : "—",
            sub: reviewStats === null ? undefined : `${reviewStats.totalReviews} review${reviewStats.totalReviews === 1 ? "" : "s"}`,
        },
        {
            label: "Profile",
            value: profile?.isApproved ? "Live" : "In review",
            sub: profile?.isApproved ? "Students can find you" : "Waiting for approval",
        },
    ];

    return (
        <div className="min-h-screen bg-paper">
            <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 space-y-10">

                <MentorWelcome profile={profile} isLoading={isProfileLoading} stats={stats} />

                {/* Main Content Layout */}
                <div className="space-y-8">
                    <EarningsOverview />
                    <MentorUpcomingSessions />
                    <MentorshipRequests />
                    <ActiveStudents />
                    <MentorBlogs />
                    <MentorReviews />
                </div>

            </div>
            <Footer />
        </div>
    );
}
