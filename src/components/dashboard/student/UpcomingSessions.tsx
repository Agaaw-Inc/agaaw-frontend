"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Video, Calendar, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import Avatar from "@/components/ui/Avatar";
import { getSessions, resolveFileUrl, type SessionListItem } from "@/lib/api";
import { formatSessionWhen } from "@/lib/sessionFormat";

export default function UpcomingSessions() {
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
            description="Your next mentor calls, one tap away."
            icon={CalendarClock}
            className="h-full flex flex-col"
            footer={
                <Link href="/dashboard/student/sessions" className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                    View all sessions
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No upcoming sessions yet.</div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => {
                        const mentor = session.counterpart;
                        const name = `${mentor.firstName} ${mentor.lastName}`;
                        const CardContent = (
                            <div
                                className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${session.isToday
                                        ? "border-teal-200 bg-teal-50/40"
                                        : "border-gray-100 bg-gray-50/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                        <Avatar src={resolveFileUrl(mentor.profileImage)} name={name} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                                        <p className="text-xs text-gray-500 font-medium truncate">
                                            {formatSessionWhen(session.scheduledAt)} &middot; {session.title}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${session.canJoin
                                            ? "bg-teal-600 text-white"
                                            : "bg-white border border-gray-200 text-gray-600"
                                        }`}
                                >
                                    {session.canJoin ? <Video size={18} /> : <Calendar size={18} />}
                                </div>
                            </div>
                        );

                        return session.canJoin ? (
                            // Plain <a>, not <Link> — this loads a heavyweight third-party
                            // (Daily) SDK into an isolated full-screen page, so a clean
                            // full navigation is more robust than a client-side SPA route.
                            <a key={session.id} href={`/session/${session.id}/call`}>
                                {CardContent}
                            </a>
                        ) : (
                            <div key={session.id}>{CardContent}</div>
                        );
                    })}
                </div>
            )}
        </SectionCard>
    );
}
