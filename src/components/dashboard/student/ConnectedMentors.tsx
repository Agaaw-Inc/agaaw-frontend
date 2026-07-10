"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Users } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";

const MAX_MENTORS = 3;

// Placeholder until student-mentor connections are wired up to the backend.
const connectedMentors = [
    { id: "1", name: "Nadia Islam", image: "https://i.pravatar.cc/150?img=5" },
    { id: "2", name: "Arif Rahman", image: "https://i.pravatar.cc/150?img=11" },
    { id: "3", name: "Tanvir Ahmed", image: "https://i.pravatar.cc/150?img=13" },
].slice(0, MAX_MENTORS);

export default function ConnectedMentors() {
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
            {connectedMentors.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No connected mentors yet.</div>
            ) : (
                <div className="space-y-3">
                    {connectedMentors.map((mentor) => (
                        <Link
                            key={mentor.id}
                            href={`/profile/mentor/${mentor.id}`}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-teal-200 hover:bg-teal-50/40 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
                                </div>
                                <p className="font-bold text-gray-900 text-sm truncate">{mentor.name}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                <MessageCircle size={16} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
