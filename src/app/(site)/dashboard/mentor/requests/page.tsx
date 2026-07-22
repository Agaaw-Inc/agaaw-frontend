"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, User, Clock, Loader2, Inbox } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/hooks/useToast";
import {
    getMentorshipRequests,
    acceptMentorshipRequest,
    declineMentorshipRequest,
    resolveFileUrl,
    type MentorshipRequestItem,
    type MentorshipRequestStatus,
} from "@/lib/api";

const TABS: { label: string; value: MentorshipRequestStatus | "all" }[] = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Declined", value: "declined" },
    { label: "Withdrawn", value: "withdrawn" },
    { label: "All", value: "all" },
];

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-emerald-100 text-emerald-700",
    declined: "bg-red-100 text-red-600",
    withdrawn: "bg-gray-100 text-gray-500",
};

const LIMIT = 10;

export default function MentorRequestsInboxPage() {
    const [activeTab, setActiveTab] = useState<MentorshipRequestStatus | "all">("pending");
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState<MentorshipRequestItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const { toast, showToast, hideToast } = useToast();

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getMentorshipRequests({
                status: activeTab === "all" ? undefined : activeTab,
                page,
                limit: LIMIT,
            });
            setRequests(result.data);
            setTotal(result.meta.total);
        } catch (err) {
            console.error("Failed to load mentorship requests:", err);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, page]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAccept = async (request: MentorshipRequestItem) => {
        setActioningId(request.id);
        try {
            await acceptMentorshipRequest(request.id);
            showToast(`You're now connected with ${request.student.firstName}!`);
            fetchRequests();
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
            showToast("Request declined");
            fetchRequests();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to decline request", "error");
        } finally {
            setActioningId(null);
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Mentorship Requests</h1>
                    <p className="text-gray-600 mt-1">Review and respond to requests from students.</p>
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
                ) : requests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-semibold">No {activeTab !== "all" ? activeTab : ""} requests found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => {
                            const studentName = `${request.student.firstName} ${request.student.lastName}`;
                            const isActioning = actioningId === request.id;
                            const isPending = request.status === "pending";
                            return (
                                <div key={request.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-5 items-start">
                                        <div className="flex items-center gap-4 min-w-[220px]">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                                <Avatar src={resolveFileUrl(request.student.profileImage)} name={studentName} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{studentName}</h3>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${STATUS_STYLES[request.status]}`}
                                                >
                                                    <Clock size={10} /> {request.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full space-y-2">
                                            <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">
                                                &quot;{request.message}&quot;
                                            </p>
                                            {request.requestedServices.length > 0 && (
                                                <p className="text-xs font-semibold text-teal-700">
                                                    {request.requestedServices.map((s) => s.title).join(", ")} &bull; Total {request.requestedServices[0].currency || "$"}{request.totalPrice}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400">
                                                Sent {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-end md:justify-start">
                                            {isPending && (
                                                <>
                                                    <button
                                                        onClick={() => handleAccept(request)}
                                                        disabled={isActioning}
                                                        className="flex-1 flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        {isActioning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecline(request)}
                                                        disabled={isActioning}
                                                        className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle size={16} /> Decline
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                href={`/profile/student/${request.studentId}`}
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
            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
}
