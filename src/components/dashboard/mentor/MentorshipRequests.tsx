"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, User, GraduationCap, BookOpen, Clock, Inbox, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import Toast from "@/components/ui/Toast";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import {
    getMentorshipRequests,
    acceptMentorshipRequest,
    declineMentorshipRequest,
    resolveFileUrl,
    type MentorshipRequestItem,
} from "@/lib/api";

export default function MentorshipRequests() {
    const [requests, setRequests] = useState<MentorshipRequestItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const { toast, showToast, hideToast } = useToast();

    const fetchRequests = useCallback(async () => {
        try {
            const result = await getMentorshipRequests({ status: "pending", limit: 5 });
            setRequests(result.data);
            setTotal(result.meta.total);
        } catch (err) {
            console.error("Failed to load mentorship requests:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAccept = async (request: MentorshipRequestItem) => {
        setActioningId(request.id);
        try {
            await acceptMentorshipRequest(request.id);
            setRequests((prev) => prev.filter((r) => r.id !== request.id));
            setTotal((prev) => Math.max(0, prev - 1));
            showToast(`You're now connected with ${request.student.firstName}!`);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to accept request", "error");
        } finally {
            setActioningId(null);
        }
    };

    const handleDecline = async (request: MentorshipRequestItem) => {
        setActioningId(request.id);
        try {
            await declineMentorshipRequest(request.id);
            setRequests((prev) => prev.filter((r) => r.id !== request.id));
            setTotal((prev) => Math.max(0, prev - 1));
            showToast("Request declined");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to decline request", "error");
        } finally {
            setActioningId(null);
        }
    };

    return (
        <SectionCard
            title="Mentorship Requests"
            icon={Inbox}
            badge={
                total > 0 ? (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                        {total} New
                    </span>
                ) : undefined
            }
            footer={
                <Link
                    href="/dashboard/mentor/requests"
                    className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors"
                >
                    View all requests
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No pending requests right now.</div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => {
                        const studentName = `${request.student.firstName} ${request.student.lastName}`;
                        const isActioning = actioningId === request.id;
                        return (
                            <div key={request.id} className="border border-gray-100 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition-all group">
                                <div className="flex flex-col md:flex-row gap-5 items-start">
                                    {/* Avatar & Info */}
                                    <div className="flex items-center gap-4 min-w-[250px]">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase">
                                            <Avatar src={resolveFileUrl(request.student.profileImage)} name={studentName} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base">{studentName}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Clock size={10} /> Pending
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 w-full flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            {request.student.studentProfile?.institution && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <GraduationCap size={14} className="text-gray-400 shrink-0" />
                                                    <span className="font-semibold text-gray-800 line-clamp-1">
                                                        {request.student.studentProfile.institution}
                                                    </span>
                                                </div>
                                            )}
                                            {request.student.studentProfile?.degreeLevel && (
                                                <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-100 whitespace-nowrap">
                                                    {request.student.studentProfile.degreeLevel}
                                                </span>
                                            )}
                                            {request.student.studentProfile?.fieldOfInterest && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <BookOpen size={14} className="text-gray-400 shrink-0" />
                                                    <span className="line-clamp-1">
                                                        {request.student.studentProfile.fieldOfInterest}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3 line-clamp-2">
                                                &quot;{request.message}&quot;
                                            </p>
                                        </div>
                                        {request.requestedServices.length > 0 && (
                                            <p className="text-xs font-semibold text-teal-700">
                                                {request.requestedServices.length} service(s) requested &bull; Total {request.requestedServices[0].currency || "$"}{request.totalPrice}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:justify-start">
                                        <button
                                            onClick={() => handleAccept(request)}
                                            disabled={isActioning}
                                            className="flex-1 flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isActioning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Accept
                                        </button>
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => handleDecline(request)}
                                                disabled={isActioning}
                                                className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                <XCircle size={16} /> Decline
                                            </button>
                                            <Link
                                                href={`/profile/student/${request.studentId}`}
                                                className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                <User size={16} /> Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <Toast toast={toast} onHide={hideToast} />
        </SectionCard>
    );
}
