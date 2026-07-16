"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Users, Loader2, Calendar } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getConnections, resolveFileUrl, type ConnectionItem } from "@/lib/api";

const PREVIEW_COUNT = 6;

export default function ActiveStudents() {
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

    const preview = connections.slice(0, PREVIEW_COUNT);

    return (
        <SectionCard
            title="Active Students"
            icon={Users}
            actions={
                connections.length > PREVIEW_COUNT ? (
                    <Link
                        href="/dashboard/mentor/students"
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                        View All <ChevronRight size={14} />
                    </Link>
                ) : undefined
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : preview.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                    No active students yet. Accept a mentorship request to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {preview.map((conn) => {
                        const student = conn.counterpart;
                        const name = `${student.firstName} ${student.lastName}`;
                        return (
                            <Link
                                key={conn.id}
                                href={`/profile/student/${student.id}`}
                                className="border border-gray-100 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition-all flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase shrink-0">
                                        {student.profileImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={resolveFileUrl(student.profileImage)}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            student.firstName?.substring(0, 2)
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
        </SectionCard>
    );
}
