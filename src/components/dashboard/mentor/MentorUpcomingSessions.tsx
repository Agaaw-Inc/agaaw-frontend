"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Video, Clock, CalendarClock, ChevronRight, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getSessions, type SessionListItem } from "@/lib/api";
import { formatSessionDateShort, formatSessionTimeRange } from "@/lib/sessionFormat";

export default function MentorUpcomingSessions() {
    const [sessions, setSessions] = useState<SessionListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await getSessions({ scope: "upcoming", limit: 5 });
                if (!cancelled) setSessions(data);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <SectionCard
            title="Upcoming Sessions"
            icon={CalendarClock}
            footer={
                <Link
                    href="/dashboard/mentor/sessions"
                    className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors inline-flex items-center gap-1"
                >
                    View all sessions <ChevronRight size={14} />
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                    No upcoming sessions. Schedule one from{" "}
                    <Link href="/dashboard/mentor/students" className="text-teal-600 font-semibold hover:underline">
                        My Students
                    </Link>
                    .
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map((session) => {
                        const student = session.counterpart;
                        const { month, day } = formatSessionDateShort(session.scheduledAt);
                        return (
                            <div key={session.id} className={`flex gap-4 p-4 rounded-xl border ${session.isToday ? 'border-teal-200 bg-teal-50/40' : 'border-gray-100 bg-gray-50/50'}`}>
                                {/* Calendar Icon Date */}
                                <div className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg ${session.isToday ? 'bg-teal-100 text-teal-700' : 'bg-white border border-gray-200 text-gray-700'} shrink-0`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{month}</span>
                                    <span className="text-xl font-black leading-none mt-0.5">{day}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-base truncate">{student.firstName} {student.lastName}</h4>
                                    <p className="text-xs text-gray-500 font-semibold truncate mb-2">{session.title}</p>

                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                        <Clock size={12} />
                                        <span>{formatSessionTimeRange(session.scheduledAt, session.durationMinutes)}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {session.canJoin ? (
                                            // Plain <a>, not <Link> — this loads a heavyweight third-party
                                            // (Daily) SDK into an isolated full-screen page, so a clean
                                            // full navigation is more robust than a client-side SPA route.
                                            <a
                                                href={`/session/${session.id}/call`}
                                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors bg-teal-600 hover:bg-teal-700 text-white"
                                            >
                                                <Video size={14} /> Join Meeting
                                            </a>
                                        ) : (
                                            <Link
                                                href="/dashboard/mentor/sessions"
                                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                                            >
                                                Manage
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </SectionCard>
    );
}
