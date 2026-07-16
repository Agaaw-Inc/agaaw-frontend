"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import MentorCard, { type MentorListItem, type MentorRequestStatus } from "@/components/mentors/MentorCard";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { getMentorsList, getMentorshipRequests, getConnections, getStudentProfile } from "@/lib/api";

const PREVIEW_COUNT = 8;

export default function MentorsSection() {
    const [mentors, setMentors] = useState<MentorListItem[]>([]);
    const [targetCountries, setTargetCountries] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestStatusMap, setRequestStatusMap] = useState<Record<string, MentorRequestStatus>>({});
    const [requestModalMentor, setRequestModalMentor] = useState<{ id: string; name: string } | null>(null);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        async function fetchMentors() {
            try {
                const [mentorsData, pendingRequests, activeConnections, studentProfile] = await Promise.all([
                    getMentorsList(),
                    getMentorshipRequests({ status: "pending", limit: 50 }),
                    getConnections("active"),
                    getStudentProfile(),
                ]);
                setMentors(Array.isArray(mentorsData) ? mentorsData : []);

                const countries = (studentProfile?.preferredCountries || [])
                    .map((pc: any) => pc.country?.name)
                    .filter(Boolean);
                setTargetCountries(countries);

                const statusMap: Record<string, MentorRequestStatus> = {};
                pendingRequests.data.forEach((req) => {
                    statusMap[req.mentorId] = "pending";
                });
                activeConnections.forEach((conn) => {
                    statusMap[conn.counterpart.id] = "connected";
                });
                setRequestStatusMap(statusMap);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMentors();
    }, []);

    const previewMentors = useMemo(() => {
        const sorted = [...mentors].sort((a, b) => {
            const aMatches = targetCountries.includes(a.country) ? 1 : 0;
            const bMatches = targetCountries.includes(b.country) ? 1 : 0;
            if (aMatches !== bMatches) return bMatches - aMatches;
            return (b.experienceYears || 0) - (a.experienceYears || 0);
        });
        return sorted.slice(0, PREVIEW_COUNT);
    }, [mentors, targetCountries]);

    if (!isLoading && mentors.length === 0) {
        return null;
    }

    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Find a Mentor</h2>
                </div>
                <Link
                    href="/mentors"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 group bg-teal-50 px-4 py-2 rounded-full transition-colors"
                >
                    See all mentors
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : (
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {previewMentors.map((mentor) => (
                        <div key={mentor.id} className="flex-shrink-0 w-[320px]">
                            <MentorCard
                                mentor={mentor}
                                isMatch={targetCountries.includes(mentor.country)}
                                requestStatus={requestStatusMap[mentor.id] || "none"}
                                onRequestMentorship={() =>
                                    setRequestModalMentor({ id: mentor.id, name: mentor.name })
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {requestModalMentor && (
                <RequestMentorshipModal
                    mentorId={requestModalMentor.id}
                    mentorName={requestModalMentor.name}
                    onClose={() => setRequestModalMentor(null)}
                    onSuccess={() => {
                        setRequestStatusMap((prev) => ({ ...prev, [requestModalMentor.id]: "pending" }));
                        setRequestModalMentor(null);
                        showToast("Mentorship request sent!");
                    }}
                />
            )}
            <Toast toast={toast} onHide={hideToast} />
        </section>
    );
}
