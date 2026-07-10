"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getMentorsList } from "@/lib/api";
import type { MentorListItem } from "@/components/mentors/MentorCard";

export default function MentorsSection() {
    const [mentors, setMentors] = useState<MentorListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMentors() {
            try {
                const data = await getMentorsList();
                setMentors(Array.isArray(data) ? data : []);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMentors();
    }, []);

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
                    {mentors.map((mentor) => (
                        <Link
                            key={mentor.id}
                            href={`/profile/mentor/${mentor.id}`}
                            className="flex-shrink-0 w-[240px] flex flex-col items-center bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={mentor.image || `https://i.pravatar.cc/150?u=${mentor.id}`}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 text-center w-full truncate">
                                {mentor.name}
                            </h3>
                            <p className="text-xs font-semibold text-teal-600 text-center w-full truncate mb-4">
                                {mentor.university || "Mentor"}
                            </p>

                            {mentor.expertise.length > 0 && (
                                <div className="flex gap-2">
                                    {mentor.expertise.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md truncate max-w-[100px]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
