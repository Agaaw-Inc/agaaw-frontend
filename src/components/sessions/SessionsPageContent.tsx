"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Video, CalendarClock, Ban, User, Loader2, CalendarX2 } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import RescheduleSessionModal from "@/components/sessions/RescheduleSessionModal";
import CancelSessionModal from "@/components/sessions/CancelSessionModal";
import { getSessions, resolveFileUrl, type SessionListItem, type SessionListScope } from "@/lib/api";
import { formatSessionWhen } from "@/lib/sessionFormat";

const TABS: { label: string; value: SessionListScope }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
    scheduled: "bg-amber-100 text-amber-700",
    in_progress: "bg-teal-100 text-teal-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-600",
    no_show: "bg-gray-100 text-gray-500",
};

const LIMIT = 10;

interface SessionsPageContentProps {
    role: "mentor" | "student";
}

export default function SessionsPageContent({ role }: SessionsPageContentProps) {
    const [activeTab, setActiveTab] = useState<SessionListScope>("upcoming");
    const [page, setPage] = useState(1);
    const [sessions, setSessions] = useState<SessionListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [reschedulingSession, setReschedulingSession] = useState<SessionListItem | null>(null);
    const [cancellingSession, setCancellingSession] = useState<SessionListItem | null>(null);
    const { toast, showToast, hideToast } = useToast();

    const fetchSessions = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getSessions({ scope: activeTab, page, limit: LIMIT });
            setSessions(result.data);
            setTotal(result.meta.total);
        } catch (err) {
            console.error("Failed to load sessions:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, page]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const profileBase = role === "mentor" ? "/profile/student" : "/profile/mentor";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Sessions</h1>
                    <p className="text-gray-600 mt-1">
                        {role === "mentor" ? "Manage your scheduled mentoring calls." : "Your scheduled mentor calls."}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setActiveTab(tab.value);
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.value
                                    ? "bg-teal-600 text-white"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <CalendarX2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-semibold">No {activeTab} sessions.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => {
                            const counterpart = session.counterpart;
                            const counterpartName = `${counterpart.firstName} ${counterpart.lastName}`;
                            return (
                                <div key={session.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-5 items-start">
                                        <div className="flex items-center gap-4 min-w-[220px]">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                                <Avatar src={resolveFileUrl(counterpart.profileImage)} name={counterpartName} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{counterpartName}</h3>
                                                <span
                                                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${STATUS_STYLES[session.status]}`}
                                                >
                                                    {session.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full space-y-1">
                                            <p className="font-semibold text-gray-900 text-sm">{session.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatSessionWhen(session.scheduledAt)} &middot; {session.durationMinutes} min
                                            </p>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-end md:justify-start">
                                            {session.canJoin && (
                                                // Plain <a>, not <Link> — this loads a heavyweight third-party
                                                // (Daily) SDK into an isolated full-screen page, so a clean
                                                // full navigation is more robust than a client-side SPA route.
                                                <a
                                                    href={`/session/${session.id}/call`}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    <Video size={16} /> Join
                                                </a>
                                            )}
                                            {session.status === "scheduled" && role === "mentor" && (
                                                <button
                                                    onClick={() => setReschedulingSession(session)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    <CalendarClock size={16} /> Reschedule
                                                </button>
                                            )}
                                            {session.status === "scheduled" && (
                                                <button
                                                    onClick={() => setCancellingSession(session)}
                                                    className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    <Ban size={16} /> Cancel
                                                </button>
                                            )}
                                            <Link
                                                href={`${profileBase}/${counterpart.id}`}
                                                className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                <User size={16} /> Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
            <Footer />

            {reschedulingSession && (
                <RescheduleSessionModal
                    session={reschedulingSession}
                    onClose={() => setReschedulingSession(null)}
                    onSuccess={() => {
                        setReschedulingSession(null);
                        showToast("Session rescheduled");
                        fetchSessions();
                    }}
                />
            )}

            {cancellingSession && (
                <CancelSessionModal
                    session={cancellingSession}
                    onClose={() => setCancellingSession(null)}
                    onSuccess={() => {
                        setCancellingSession(null);
                        showToast("Session cancelled");
                        fetchSessions();
                    }}
                />
            )}

            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
}
