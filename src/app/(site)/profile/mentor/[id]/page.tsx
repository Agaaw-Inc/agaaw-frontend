"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { getUserInfo } from "@/lib/auth";
import { getMentorPublicProfile, getMentorshipRequests, getConnections } from "@/lib/api";

import MentorProfileHeader from "@/components/profile/mentor/sections/MentorProfileHeader";
import MentorAboutCard from "@/components/profile/mentor/sections/MentorAboutCard";
import MentorDetailsCard from "@/components/profile/mentor/sections/MentorDetailsCard";
import MentorExpertiseCard from "@/components/profile/mentor/sections/MentorExpertiseCard";
import MentorAchievementsCard from "@/components/profile/mentor/sections/MentorAchievementsCard";
import MentorServicesCard from "@/components/profile/mentor/sections/MentorServicesCard";
import MentorReviewsCard from "@/components/profile/mentor/sections/MentorReviewsCard";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

type Status = "loading" | "ready" | "denied" | "not-found";

export default function MentorPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [status, setStatus] = useState<Status>("loading");
    const [profile, setProfile] = useState<any>(null);
    const [relationshipStatus, setRelationshipStatus] = useState<"none" | "pending" | "connected">("none");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const { toast, showToast, hideToast } = useToast();
    const viewer = getUserInfo();

    useEffect(() => {

        if (!viewer) {
            router.replace("/login");
            return;
        }

        // Mentors manage/preview their own profile from the dashboard, not here.
        if (viewer.role === "mentor" && viewer.id === id) {
            router.replace("/dashboard/mentor/profile");
            return;
        }

        if (viewer.role !== "student" && viewer.role !== "admin") {
            setStatus("denied");
            return;
        }

        let cancelled = false;
        (async () => {
            const data = await getMentorPublicProfile(id);
            if (cancelled) return;
            if (!data) {
                setStatus("not-found");
                return;
            }
            setProfile(data);

            if (viewer.role === "student") {
                try {
                    const [pendingRequests, activeConnections] = await Promise.all([
                        getMentorshipRequests({ status: "pending", limit: 50 }),
                        getConnections("active"),
                    ]);
                    if (cancelled) return;
                    if (activeConnections.some((c) => c.counterpart.id === id)) {
                        setRelationshipStatus("connected");
                    } else if (pendingRequests.data.some((r) => r.mentorId === id)) {
                        setRelationshipStatus("pending");
                    } else {
                        setRelationshipStatus("none");
                    }
                } catch (err) {
                    console.error("Failed to load relationship status:", err);
                }
            }

            setStatus("ready");
        })();

        return () => {
            cancelled = true;
        };
    }, [id, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Loading mentor profile...</p>
            </div>
        );
    }

    if (status === "denied" || status === "not-found") {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <MainNavbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center px-6">
                        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-700 mb-2">
                            {status === "denied" ? "Access Restricted" : "Mentor Not Found"}
                        </h2>
                        <p className="text-slate-500 mb-6">
                            {status === "denied"
                                ? "Only students and admins can view mentor profiles."
                                : "This mentor profile doesn't exist or isn't available."}
                        </p>
                        <Link
                            href="/mentors"
                            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                        >
                            Browse Mentors
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const hasItems = (value: unknown) => Array.isArray(value) && value.length > 0;

    const hasAbout = Boolean(profile.bio);
    const hasDetails = Boolean(
        profile.currentUniversity || profile.countryName || profile.experienceYears ||
        profile.hourlyRate || profile.languages?.length || profile.degree ||
        profile.subject || profile.semester || profile.visaStatus || profile.cityName
    );
    const hasExpertise = hasItems(profile.expertiseTags?.map((et: any) => et.tag));
    const hasAchievements = hasItems(profile.achievements);
    const hasServices = hasItems(profile.services);
    const hasReviews = hasItems(profile.reviews);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <MainNavbar />
            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 w-full">
                <MentorProfileHeader
                    profile={profile}
                    relationshipStatus={viewer?.role === "student" ? relationshipStatus : undefined}
                    onRequestMentorship={() => setShowRequestModal(true)}
                />
                {/* Phone number is only shared with admins — never with students. */}
                {/* Every card below is only shown if the mentor actually added that information. */}
                {hasAbout && <MentorAboutCard profile={profile} />}
                {hasDetails && <MentorDetailsCard profile={profile} hidePhone />}
                {hasExpertise && <MentorExpertiseCard profile={profile} />}
                {hasAchievements && <MentorAchievementsCard profile={profile} />}
                {hasServices && <MentorServicesCard profile={profile} />}
                {hasReviews && <MentorReviewsCard profile={profile} />}
            </main>
            <Footer />

            {showRequestModal && (
                <RequestMentorshipModal
                    mentorId={id}
                    mentorName={`${profile.user?.firstName || ""} ${profile.user?.lastName || ""}`.trim()}
                    onClose={() => setShowRequestModal(false)}
                    onSuccess={() => {
                        setRelationshipStatus("pending");
                        setShowRequestModal(false);
                        showToast("Mentorship request sent!");
                    }}
                />
            )}
            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
}
