"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getScholarships, type PublicScholarship } from "@/lib/api";

const MAX_DEADLINES = 5;

function formatDeadline(deadline: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(deadline));
}

function daysUntil(deadline: string) {
    const diffMs = new Date(deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function urgencyDotClasses(days: number) {
    if (days <= 7) return "bg-rose-500";
    if (days <= 30) return "bg-amber-500";
    return "bg-teal-500";
}

function urgencyTextClasses(days: number) {
    if (days <= 7) return "text-rose-600";
    if (days <= 30) return "text-amber-600";
    return "text-teal-600";
}

export default function UpcomingDeadlines() {
    const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDeadlines() {
            try {
                setIsLoading(true);
                const result = await getScholarships({ limit: 50 });
                setScholarships(result.data || []);
            } catch (err) {
                console.error("Failed to fetch upcoming deadlines:", err);
                setError("Could not load upcoming deadlines");
            } finally {
                setIsLoading(false);
            }
        }
        fetchDeadlines();
    }, []);

    const today = new Date().setHours(0, 0, 0, 0);
    const upcoming = scholarships
        .filter((sch): sch is PublicScholarship & { deadline: string } =>
            Boolean(sch.deadline) && new Date(sch.deadline as string).getTime() >= today
        )
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, MAX_DEADLINES);

    return (
        <SectionCard
            title="Upcoming Scholarship Deadlines"
            description="Your soonest deadlines, sorted so nothing sneaks past you."
            icon={CalendarClock}
            iconClassName="bg-rose-50 text-rose-600"
            footer={
                <Link href="/scholarships" className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors">
                    View all scholarships
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-gray-500 text-sm">{error}</div>
            ) : upcoming.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No upcoming deadlines right now.</div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {upcoming.map((sch) => {
                        const days = daysUntil(sch.deadline);
                        return (
                            <li key={sch.slug}>
                                <Link
                                    href={`/scholarships/${sch.slug}`}
                                    className="group flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${urgencyDotClasses(days)}`} />
                                        <span className="font-semibold text-gray-800 text-base truncate group-hover:text-teal-700 group-hover:underline underline-offset-2 transition-colors">
                                            {sch.name}
                                        </span>
                                        <span className="text-sm text-gray-400 truncate hidden sm:inline">
                                            {sch.provider}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold shrink-0 ${urgencyTextClasses(days)}`}>
                                        {formatDeadline(sch.deadline)}
                                        <span className="text-gray-400 font-medium">
                                            {" "}· {days === 0 ? "Today" : days === 1 ? "1 day left" : `${days}d left`}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </SectionCard>
    );
}
