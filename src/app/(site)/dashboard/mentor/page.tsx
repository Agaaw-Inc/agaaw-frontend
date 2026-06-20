import React from "react";
import MentorHero from "@/components/dashboard/mentor/MentorHero";
import EarningsOverview from "@/components/dashboard/mentor/EarningsOverview";
import MentorshipRequests from "@/components/dashboard/mentor/MentorshipRequests";
import ActiveStudents from "@/components/dashboard/mentor/ActiveStudents";
import MentorUpcomingSessions from "@/components/dashboard/mentor/MentorUpcomingSessions";
import MentorReviews from "@/components/dashboard/mentor/MentorReviews";
import MentorNotifications from "@/components/dashboard/mentor/MentorNotifications";
import MentorBlogs from "@/components/dashboard/mentor/MentorBlogs";
import Footer from "@/components/landing/Footer";
import StatCard from "@/components/ui/StatCard";
import { Users, UserCheck, Eye, Star } from "lucide-react";

export default function MentorDashboardPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                
                {/* Hero Section & Verification */}
                <MentorHero />

                {/* Profile Performance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Students Mentored" value="125" sub="+12 this month" color="bg-teal-600" />
                    <StatCard icon={UserCheck} label="Active Students" value="18" sub="Currently mentoring" color="bg-blue-600" />
                    <StatCard icon={Eye} label="Profile Views" value="4,850" sub="+15% from last month" color="bg-purple-600" />
                    <StatCard icon={Star} label="Average Rating" value="4.9 ★" sub="Based on 120 reviews" color="bg-amber-500" />
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
