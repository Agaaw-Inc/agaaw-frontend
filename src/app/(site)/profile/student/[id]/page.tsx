"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert, CheckCircle2, XCircle, Inbox } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { getUserInfo } from "@/lib/auth";
import {
    getStudentPublicProfile,
    getStudentProfileForMentor,
    getStudentDocumentsForMentor,
    getMentorshipRequests,
    getConnections,
    getSessions,
    acceptMentorshipRequest,
    declineMentorshipRequest,
    type MentorshipRequestItem,
    type ConnectionItem,
    type SessionListItem,
} from "@/lib/api";

import StudentProfileHeader from "@/components/profile/student/sections/StudentProfileHeader";
import ScheduleSessionModal from "@/components/sessions/ScheduleSessionModal";
import RescheduleSessionModal from "@/components/sessions/RescheduleSessionModal";
import CancelSessionModal from "@/components/sessions/CancelSessionModal";
import PersonalInfoCard from "@/components/profile/student/sections/PersonalInfoCard";
import AcademicInfoCard from "@/components/profile/student/sections/AcademicInfoCard";
import ExperienceCard from "@/components/profile/student/sections/ExperienceCard";
import SkillsCard from "@/components/profile/student/sections/SkillsCard";
import CertificationsCard from "@/components/profile/student/sections/CertificationsCard";
import ResearchCard from "@/components/profile/student/sections/ResearchCard";
import VolunteerCard from "@/components/profile/student/sections/VolunteerCard";
import AchievementsCard from "@/components/profile/student/sections/AchievementsCard";
import SocialLinksCard from "@/components/profile/student/sections/SocialLinksCard";
import FinancialDetailsCard from "@/components/profile/student/sections/FinancialDetailsCard";
import DocumentsCard from "@/components/profile/student/sections/DocumentsCard";

type Status = "loading" | "ready" | "denied" | "not-found";

export default function StudentPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const viewer = getUserInfo();

    const [status, setStatus] = useState<Status>("loading");
    const [profile, setProfile] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [hasFullAccess, setHasFullAccess] = useState(false);
    const [pendingRequest, setPendingRequest] = useState<MentorshipRequestItem | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connection, setConnection] = useState<ConnectionItem | null>(null);
    const [isActioning, setIsActioning] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [upcomingSession, setUpcomingSession] = useState<SessionListItem | null>(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const refreshUpcomingSession = async () => {
        const { data } = await getSessions({ scope: "upcoming", limit: 50 });
        setUpcomingSession(data.find((s) => s.counterpart.id === id && s.status === "scheduled") || null);
    };

    useEffect(() => {
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
            try {
                if (viewer.role === "mentor") {
                    const [pendingRes, activeConnections, sessionsRes] = await Promise.all([
                        getMentorshipRequests({ status: "pending", limit: 50 }),
                        getConnections("active"),
                        getSessions({ scope: "upcoming", limit: 50 }),
                    ]);
                    if (cancelled) return;

                    const match = pendingRes.data.find((r) => r.studentId === id) || null;
                    const matchedConnection = activeConnections.find((c) => c.counterpart.id === id) || null;
                    setPendingRequest(match);
                    setIsConnected(!!matchedConnection);
                    setConnection(matchedConnection);
                    setUpcomingSession(
                        sessionsRes.data.find((s) => s.counterpart.id === id && s.status === "scheduled") || null,
                    );

                    if (match || matchedConnection) {
                        const [fullProfile, docs] = await Promise.all([
                            getStudentProfileForMentor(id),
                            getStudentDocumentsForMentor(id),
                        ]);
                        if (cancelled) return;
                        if (!fullProfile) {
                            setStatus("not-found");
                            return;
                        }
                        setProfile(fullProfile);
                        setDocuments(docs);
                        setHasFullAccess(true);
                        setStatus("ready");
                    } else {
                        const basic = await getStudentPublicProfile(id);
                        if (cancelled) return;
                        if (!basic) {
                            setStatus("not-found");
                            return;
                        }
                        setProfile(basic);
                        setHasFullAccess(false);
                        setStatus("ready");
                    }
                } else {
                    const data = await getStudentPublicProfile(id);
                    if (cancelled) return;
                    if (!data) {
                        setStatus("not-found");
                        return;
                    }
                    setProfile(data);
                    setStatus("ready");
                }
            } catch (err) {
                console.error("Failed to load student profile:", err);
                if (!cancelled) setStatus("not-found");
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, router]);

    const handleAccept = async () => {
        if (!pendingRequest) return;
        setIsActioning(true);
        try {
            const result = await acceptMentorshipRequest(pendingRequest.id);
            setIsConnected(true);
            setConnection({
                id: result.connection.id,
                status: result.connection.status,
                startedAt: result.connection.startedAt,
                endedAt: null,
                conversationId: result.conversationId,
                counterpart: {
                    id: profile.user.id,
                    firstName: profile.user.firstName,
                    lastName: profile.user.lastName,
                    profileImage: profile.user.profileImage,
                    role: "student",
                },
            });
            setPendingRequest(null);
            showToast(`You're now connected with ${pendingRequest.student.firstName}!`);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to accept request", "error");
        } finally {
            setIsActioning(false);
        }
    };

    const handleDecline = async () => {
        if (!pendingRequest) return;
        setIsActioning(true);
        try {
            await declineMentorshipRequest(pendingRequest.id);
            showToast("Request declined");
            router.push("/dashboard/mentor/requests");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to decline request", "error");
            setIsActioning(false);
        }
    };

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
    const hasFinancialDetails = hasFullAccess && profile.financialDetails && Object.keys(profile.financialDetails).length > 0;
    const hasDocuments = hasFullAccess && documents.length > 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <MainNavbar />
            <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 w-full">
                <StudentProfileHeader
                    profile={profile}
                    showConnectedActions={viewer?.role === "mentor" && isConnected}
                    onMessage={() =>
                        router.push(
                            connection?.conversationId
                                ? `/dashboard/mentor/messages?conversation=${connection.conversationId}`
                                : "/dashboard/mentor/messages"
                        )
                    }
                    onScheduleMeeting={() => setShowScheduleModal(true)}
                    upcomingSession={upcomingSession}
                    onRescheduleMeeting={() => setShowRescheduleModal(true)}
                    onCancelMeeting={() => setShowCancelModal(true)}
                />

                {viewer?.role === "mentor" && (pendingRequest || isConnected) && (
                    <div className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isConnected ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                        }`}>
                        <div className="flex items-start gap-3">
                            <Inbox size={20} className={isConnected ? "text-emerald-600 mt-0.5" : "text-amber-600 mt-0.5"} />
                            <div>
                                <p className="font-bold text-gray-900">
                                    {isConnected ? "You are connected with this student" : "This student sent you a mentorship request"}
                                </p>
                                {pendingRequest && !isConnected && (
                                    <p className="text-sm text-gray-600 mt-1 max-w-xl">&quot;{pendingRequest.message}&quot;</p>
                                )}
                            </div>
                        </div>
                        {pendingRequest && !isConnected && (
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={handleAccept}
                                    disabled={isActioning}
                                    className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    {isActioning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Accept
                                </button>
                                <button
                                    onClick={handleDecline}
                                    disabled={isActioning}
                                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    <XCircle size={16} /> Decline
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Phone is only shared with admins. Financial & document details require a connection. */}
                {/* Every card below is only shown if the student actually added that information. */}
                {hasPersonalInfo && <PersonalInfoCard profile={profile} />}
                {hasAcademicInfo && <AcademicInfoCard profile={profile} />}
                {hasExperience && <ExperienceCard profile={profile} />}
                {hasFinancialDetails && <FinancialDetailsCard profile={profile} />}
                {hasDocuments && <DocumentsCard documents={documents} />}
                {hasSkills && <SkillsCard profile={profile} />}
                {hasCertifications && <CertificationsCard profile={profile} />}
                {hasResearch && <ResearchCard profile={profile} />}
                {hasVolunteer && <VolunteerCard profile={profile} />}
                {hasAchievements && <AchievementsCard profile={profile} />}
                {hasSocialLinks && <SocialLinksCard profile={profile} />}
            </main>
            <Footer />

            {showScheduleModal && connection && (
                <ScheduleSessionModal
                    connectionId={connection.id}
                    studentName={`${connection.counterpart.firstName} ${connection.counterpart.lastName}`}
                    onClose={() => setShowScheduleModal(false)}
                    onSuccess={() => {
                        setShowScheduleModal(false);
                        showToast("Session scheduled!");
                        refreshUpcomingSession();
                    }}
                />
            )}

            {showRescheduleModal && upcomingSession && (
                <RescheduleSessionModal
                    session={upcomingSession}
                    onClose={() => setShowRescheduleModal(false)}
                    onSuccess={() => {
                        setShowRescheduleModal(false);
                        showToast("Session rescheduled");
                        refreshUpcomingSession();
                    }}
                />
            )}

            {showCancelModal && upcomingSession && (
                <CancelSessionModal
                    session={upcomingSession}
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={() => {
                        setShowCancelModal(false);
                        showToast("Session cancelled");
                        refreshUpcomingSession();
                    }}
                />
            )}

            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
}
