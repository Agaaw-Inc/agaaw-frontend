"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Video, Calendar } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";

const sessions = [
    {
        id: "1",
        mentorName: "Nadia Islam",
        image: "https://i.pravatar.cc/150?img=5",
        time: "Today, 4:00 PM",
        isToday: true,
    },
    {
        id: "2",
        mentorName: "Arif Rahman",
        image: "https://i.pravatar.cc/150?img=11",
        time: "Tomorrow, 10:00 AM",
        isToday: false,
    },
];

export default function UpcomingSessions() {
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
            {sessions.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No upcoming sessions yet.</div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all ${session.isToday
                                    ? "border-teal-200 bg-teal-50/40"
                                    : "border-gray-100 bg-gray-50/50"
                                }`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <Image src={session.image} alt={session.mentorName} fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{session.mentorName}</p>
                                    <p className="text-xs text-gray-500 font-medium truncate">{session.time}</p>
                                </div>
                            </div>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${session.isToday
                                        ? "bg-teal-600 text-white"
                                        : "bg-white border border-gray-200 text-gray-600"
                                    }`}
                            >
                                {session.isToday ? <Video size={18} /> : <Calendar size={18} />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
