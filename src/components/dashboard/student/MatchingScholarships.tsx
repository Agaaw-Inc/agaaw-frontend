"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getScholarships, type PublicScholarship } from "@/lib/api";

const MAX_SCHOLARSHIPS = 10;

export default function MatchingScholarships() {
    const [scholarships, setScholarships] = useState<PublicScholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchScholarships() {
            try {
                setIsLoading(true);
                // Placeholder until profile-based matching exists — takes the first N scholarships.
                const result = await getScholarships({ limit: MAX_SCHOLARSHIPS });
                setScholarships(result.data || []);
            } catch (err) {
                console.error("Failed to fetch matching scholarships:", err);
                setError("Could not load scholarships");
            } finally {
                setIsLoading(false);
            }
        }
        fetchScholarships();
    }, []);

    return (
        <SectionCard
            title="Scholarships Matching Your Profile"
            description="Curated for your academic level and interests."
            icon={GraduationCap}
            className="h-full flex flex-col"
            footer={
                <Link href="/scholarships" className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors">
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
            ) : scholarships.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No matching scholarships yet.</div>
            ) : (
                <div className="flex flex-wrap gap-2.5">
                    {scholarships.map((sch) => (
                        <Link
                            key={sch.slug}
                            href={`/scholarships/${sch.slug}`}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 pl-4 pr-3 py-2 text-sm font-semibold text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                            {sch.name}
                            <ArrowUpRight size={13} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
                        </Link>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
