"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Users, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getConnections, resolveFileUrl, type ConnectionItem } from "@/lib/api";

const MAX_MENTORS = 3;

export default function ConnectedMentors() {
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

    const connectedMentors = connections.slice(0, MAX_MENTORS);

    return (
        <SectionCard
            title="Your Connected Mentors"
            description="Mentors actively guiding your application."
            icon={Users}
            className="h-full flex flex-col"
            footer={
                <Link href="/dashboard/student/messages" className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                    Message your mentors
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : connectedMentors.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No connected mentors yet.</div>
            ) : (
                <div className="space-y-3">
                    {connectedMentors.map((conn) => {
                        const mentor = conn.counterpart;
                        const name = `${mentor.firstName} ${mentor.lastName}`;
                        return (
                            <Link
                                key={conn.id}
                                href={`/profile/mentor/${mentor.id}`}
                                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-teal-200 hover:bg-teal-50/40 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase">
                                        {mentor.profileImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={resolveFileUrl(mentor.profileImage)}
                                                alt={name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            mentor.firstName?.substring(0, 2)
                                        )}
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                    <MessageCircle size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </SectionCard>
    );
}
