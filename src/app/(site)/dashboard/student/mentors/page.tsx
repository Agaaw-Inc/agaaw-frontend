"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Loader2, Calendar } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { getConnections, resolveFileUrl, type ConnectionItem } from "@/lib/api";

export default function StudentMentorsPage() {
    const [connections, setConnections] = useState<ConnectionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getConnections("active");
                if (!cancelled) setConnections(data);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Mentors</h1>
                    <p className="text-gray-600 mt-1">
                        {connections.length} mentor{connections.length !== 1 && "s"} currently connected with you.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : connections.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-semibold">You don&apos;t have any connected mentors yet.</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Send a mentorship request from the mentor directory to get started.
                        </p>
                        <Link
                            href="/mentors"
                            className="inline-block mt-6 text-teal-600 font-semibold hover:underline"
                        >
                            Browse Mentors &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {connections.map((conn) => {
                            const mentor = conn.counterpart;
                            const name = `${mentor.firstName} ${mentor.lastName}`;
                            return (
                                <Link
                                    key={conn.id}
                                    href={`/profile/mentor/${mentor.id}`}
                                    className="bg-white border border-gray-100 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition-all flex flex-col"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                            {mentor.profileImage ? (
                                                <img
                                                    src={resolveFileUrl(mentor.profileImage)}
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                mentor.firstName?.substring(0, 2)
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                <Calendar size={12} className="text-gray-400" /> Connected {new Date(conn.startedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="mt-auto text-xs font-semibold text-teal-600">View Profile &rarr;</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
