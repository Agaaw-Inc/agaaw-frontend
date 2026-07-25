"use client";

import React, { useEffect, useState } from "react";
import MentorHero from "@/components/dashboard/mentor/MentorHero";
import EarningsOverview from "@/components/dashboard/mentor/EarningsOverview";
import MentorshipRequests from "@/components/dashboard/mentor/MentorshipRequests";
import ActiveStudents from "@/components/dashboard/mentor/ActiveStudents";
import MentorUpcomingSessions from "@/components/dashboard/mentor/MentorUpcomingSessions";
import MentorReviews from "@/components/dashboard/mentor/MentorReviews";
import MentorBlogs from "@/components/dashboard/mentor/MentorBlogs";
import Footer from "@/components/landing/Footer";
import StatCard from "@/components/ui/StatCard";
import { Users, UserCheck, Eye, Star } from "lucide-react";
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

    const stats = [
        {
            icon: Users,
            label: "Total Students Mentored",
            value: totalStudents === null ? "—" : String(totalStudents),
            sub: "All-time connections",
            color: "bg-teal-600",
        },
        {
            icon: UserCheck,
            label: "Active Students",
            value: activeStudents === null ? "—" : String(activeStudents),
            sub: "Currently mentoring",
            color: "bg-blue-600",
        },
        { icon: Eye, label: "Profile Views", value: "—", sub: "Coming soon", color: "bg-purple-600" },
        {
            icon: Star,
            label: "Average Rating",
            value: reviewStats === null ? "—" : reviewStats.totalReviews > 0 ? String(reviewStats.averageRating) : "N/A",
            sub:
                reviewStats === null
                    ? "Loading..."
                    : `${reviewStats.totalReviews} review${reviewStats.totalReviews === 1 ? "" : "s"}`,
            color: "bg-amber-500",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

                {/* Hero Section & Verification */}
                <MentorHero profile={profile} isLoading={isProfileLoading} />

                {/* Profile Performance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

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
