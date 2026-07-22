"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Users, Loader2, Calendar, Video, CalendarClock, Ban } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/ui/Toast";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import ScheduleSessionModal from "@/components/sessions/ScheduleSessionModal";
import RescheduleSessionModal from "@/components/sessions/RescheduleSessionModal";
import CancelSessionModal from "@/components/sessions/CancelSessionModal";
import {
    getConnections,
    getSessions,
    resolveFileUrl,
    type ConnectionItem,
    type SessionListItem,
} from "@/lib/api";
import { formatSessionWhen } from "@/lib/sessionFormat";

export default function MentorStudentsPage() {
    const [connections, setConnections] = useState<ConnectionItem[]>([]);
    const [sessionByStudentId, setSessionByStudentId] = useState<Map<string, SessionListItem>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [schedulingConnection, setSchedulingConnection] = useState<ConnectionItem | null>(null);
    const [reschedulingSession, setReschedulingSession] = useState<SessionListItem | null>(null);
    const [cancellingSession, setCancellingSession] = useState<SessionListItem | null>(null);
    const { toast, showToast, hideToast } = useToast();

    const fetchData = useCallback(async () => {
        try {
            const [connectionsData, sessionsResult] = await Promise.all([
                getConnections("active"),
                getSessions({ scope: "upcoming", limit: 50 }),
            ]);
            setConnections(connectionsData);
            // Only "scheduled" sessions are reschedulable/cancellable — an
            // in_progress one (rare: the call is happening right now) falls
            // through to showing nothing extra rather than a button that's
            // guaranteed to error.
            const reschedulable = sessionsResult.data.filter((s) => s.status === "scheduled");
            setSessionByStudentId(new Map(reschedulable.map((s) => [s.counterpart.id, s])));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Students</h1>
                    <p className="text-gray-600 mt-1">
                        {connections.length} student{connections.length !== 1 && "s"} currently connected with you.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : connections.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-semibold">You don&apos;t have any connected students yet.</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Accept a pending mentorship request to start mentoring.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {connections.map((conn) => {
                            const student = conn.counterpart;
                            const name = `${student.firstName} ${student.lastName}`;
                            const upcomingSession = sessionByStudentId.get(student.id) || null;
                            return (
                                <div
                                    key={conn.id}
                                    className="bg-white border border-gray-100 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition-all flex flex-col"
                                >
                                    <Link href={`/profile/student/${student.id}`} className="flex items-center gap-3 mb-3">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                            <Avatar src={resolveFileUrl(student.profileImage)} name={name} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                <Calendar size={12} className="text-gray-400" /> Connected {new Date(conn.startedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Link>

                                    {upcomingSession && (
                                        <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-2.5 py-1.5 mb-3 font-semibold truncate">
                                            {formatSessionWhen(upcomingSession.scheduledAt)} &middot; {upcomingSession.title}
                                        </p>
                                    )}

                                    <div className="mt-auto flex items-center justify-between gap-2">
                                        <Link href={`/profile/student/${student.id}`} className="text-xs font-semibold text-teal-600 hover:text-teal-700 shrink-0">
                                            View Profile &rarr;
                                        </Link>
                                        {upcomingSession ? (
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setReschedulingSession(upcomingSession)}
                                                    title="Reschedule session"
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                                                >
                                                    <CalendarClock size={13} /> Reschedule
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCancellingSession(upcomingSession)}
                                                    title="Cancel session"
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-700 hover:text-red-600 transition-colors"
                                                >
                                                    <Ban size={13} /> Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setSchedulingConnection(conn)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                                            >
                                                <Video size={13} /> Schedule Session
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />

            {schedulingConnection && (
                <ScheduleSessionModal
                    connectionId={schedulingConnection.id}
                    studentName={`${schedulingConnection.counterpart.firstName} ${schedulingConnection.counterpart.lastName}`}
                    onClose={() => setSchedulingConnection(null)}
                    onSuccess={() => {
                        setSchedulingConnection(null);
                        showToast("Session scheduled!");
                        fetchData();
                    }}
                />
            )}

            {reschedulingSession && (
                <RescheduleSessionModal
                    session={reschedulingSession}
                    onClose={() => setReschedulingSession(null)}
                    onSuccess={() => {
                        setReschedulingSession(null);
                        showToast("Session rescheduled");
                        fetchData();
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
                        fetchData();
                    }}
                />
            )}

            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
}
