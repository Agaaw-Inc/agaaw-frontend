"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { getUserInfo } from "@/lib/auth";
import { getStudentPublicProfile } from "@/lib/api";

import StudentProfileHeader from "@/components/profile/student/sections/StudentProfileHeader";
import PersonalInfoCard from "@/components/profile/student/sections/PersonalInfoCard";
import AcademicInfoCard from "@/components/profile/student/sections/AcademicInfoCard";
import ExperienceCard from "@/components/profile/student/sections/ExperienceCard";
import SkillsCard from "@/components/profile/student/sections/SkillsCard";
import CertificationsCard from "@/components/profile/student/sections/CertificationsCard";
import ResearchCard from "@/components/profile/student/sections/ResearchCard";
import VolunteerCard from "@/components/profile/student/sections/VolunteerCard";
import AchievementsCard from "@/components/profile/student/sections/AchievementsCard";
import SocialLinksCard from "@/components/profile/student/sections/SocialLinksCard";

type Status = "loading" | "ready" | "denied" | "not-found";

export default function StudentPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [status, setStatus] = useState<Status>("loading");
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const viewer = getUserInfo();

        if (!viewer) {
            router.replace("/login");
            return;
        }

        // Students manage their own profile from the dashboard, not here.
        if (viewer.role === "student" && viewer.id === id) {
            router.replace("/dashboard/student/profile");
            return;
        }

        if (viewer.role !== "mentor" && viewer.role !== "admin") {
            setStatus("denied");
            return;
        }

        let cancelled = false;
        (async () => {
            const data = await getStudentPublicProfile(id);
            if (cancelled) return;
            if (!data) {
                setStatus("not-found");
                return;
            }
            setProfile(data);
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
                <p className="text-sm font-semibold text-gray-500">Loading student profile...</p>
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
                            {status === "denied" ? "Access Restricted" : "Student Not Found"}
                        </h2>
                        <p className="text-slate-500 mb-6">
                            {status === "denied"
                                ? "Only mentors and admins can view student profiles."
                                : "This student profile doesn't exist."}
                        </p>
                        <Link
                            href="/students"
                            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                        >
                            Browse Students
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const hasItems = (value: unknown) => Array.isArray(value) && value.length > 0;

    const hasPersonalInfo = Boolean(
        profile.dateOfBirth || profile.gender || profile.nationality ||
        profile.testScores?.some((ts: any) => ts.testType === "ielts")
    );
    const hasAcademicInfo = Boolean(
        profile.institution || profile.degreeLevel || profile.department ||
        profile.studentId || profile.currentSemester || profile.expectedGraduation ||
        profile.cgpa || profile.ranking
    );
    const hasExperience = hasItems(profile.experience);
    const hasSkills = hasItems(profile.skills);
    const hasCertifications = hasItems(profile.certifications);
    const hasResearch = hasItems(profile.research);
    const hasVolunteer = hasItems(profile.volunteer);
    const hasAchievements = hasItems(profile.achievements);
    const hasSocialLinks = hasItems(profile.socialLinks);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <MainNavbar />
            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 w-full">
                <StudentProfileHeader profile={profile} />
                {/* Phone & financial/guardian details are only shared with admins. */}
                {/* Every card below is only shown if the student actually added that information. */}
                {hasPersonalInfo && <PersonalInfoCard profile={profile} />}
                {hasAcademicInfo && <AcademicInfoCard profile={profile} />}
                {hasExperience && <ExperienceCard profile={profile} />}
                {/* Uploaded documents are never exposed to other users. */}
                {hasSkills && <SkillsCard profile={profile} />}
                {hasCertifications && <CertificationsCard profile={profile} />}
                {hasResearch && <ResearchCard profile={profile} />}
                {hasVolunteer && <VolunteerCard profile={profile} />}
                {hasAchievements && <AchievementsCard profile={profile} />}
                {hasSocialLinks && <SocialLinksCard profile={profile} />}
            </main>
            <Footer />
        </div>
    );
}
