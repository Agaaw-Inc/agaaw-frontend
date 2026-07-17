"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import Footer from "@/components/landing/Footer";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { getSavedScholarships, type SavedScholarship } from "@/lib/api";

const FALLBACK_IMAGE = "/images/scholarship-agaaw.png";

function formatDeadline(deadline: string | null) {
    if (!deadline) return "Ongoing";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(deadline));
}

function formatCoverage(coverage: SavedScholarship["coverage"]) {
    return {
        full: "Full Coverage",
        partial: "Partial Coverage",
        varies: "Varies",
    }[coverage];
}

export default function SavedScholarshipsPage() {
    const [scholarships, setScholarships] = useState<SavedScholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getSavedScholarships();
                setScholarships(data);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const handleSavedChange = (id: string, saved: boolean) => {
        if (!saved) {
            setScholarships((prev) => prev.filter((s) => s.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Saved Scholarships</h1>
                    <p className="text-sm text-gray-500">Scholarships you&apos;ve bookmarked for later.</p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-teal-600" />
                        <p className="text-sm">Loading saved scholarships...</p>
                    </div>
                ) : scholarships.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
                        <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-700">No saved scholarships yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Browse scholarships and tap the bookmark icon to save them here.
                        </p>
                        <Link
                            href="/scholarships"
                            className="inline-block mt-6 text-elm font-semibold hover:underline"
                        >
                            Browse Scholarships →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {scholarships.map((sch) => (
                            <ScholarshipCard
                                key={sch.id}
                                id={sch.id}
                                slug={sch.slug}
                                title={sch.name}
                                university={sch.provider}
                                deadline={formatDeadline(sch.deadline)}
                                image={sch.bannerImage || FALLBACK_IMAGE}
                                funding={formatCoverage(sch.coverage)}
                                amount={sch.amount || undefined}
                                isSavedInitially
                                onSavedChange={handleSavedChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
