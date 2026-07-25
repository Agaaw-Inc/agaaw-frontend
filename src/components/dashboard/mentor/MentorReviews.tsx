"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, MessageCircle, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getMentorReviews, type MentorReviewsResult } from "@/lib/api";
import { getUserInfo } from "@/lib/auth";

const PREVIEW_COUNT = 3;

export default function MentorReviews() {
    const [reviews, setReviews] = useState<MentorReviewsResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = getUserInfo();
        if (!user) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const result = await getMentorReviews(user.id);
                if (!cancelled) setReviews(result);
            } catch (err) {
                console.error("Failed to load mentor reviews:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const stats = reviews?.stats;
    const items = reviews?.data ?? [];

    return (
        <SectionCard
            title="Reviews & Testimonials"
            icon={MessageCircle}
            actions={
                stats && stats.totalReviews > 0 ? (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                        <div className="flex items-center text-amber-500">
                            <span className="text-xl font-black mr-1">{stats.averageRating}</span>
                            <Star size={18} fill="currentColor" />
                        </div>
                        <div className="h-6 w-px bg-amber-200"></div>
                        <span className="text-xs font-semibold text-amber-800">
                            Based on {stats.totalReviews} Review{stats.totalReviews === 1 ? "" : "s"}
                        </span>
                    </div>
                ) : undefined
            }
            footer={
                items.length > PREVIEW_COUNT ? (
                    <Link
                        href="/dashboard/mentor/reviews"
                        className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors inline-block"
                    >
                        View all reviews
                    </Link>
                ) : undefined
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-6 text-center">
                    No reviews yet. Reviews from your students will appear here.
                </p>
            ) : (
                <div className="space-y-4">
                    {items.slice(0, PREVIEW_COUNT).map((review) => (
                        <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">
                                        {review.student.firstName} {review.student.lastName}
                                    </h3>
                                    {review.student.nationality && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                            <MapPin size={12} className="text-gray-400" /> {review.student.nationality}
                                        </div>
                                    )}
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < review.rating ? "text-amber-500" : "text-gray-300"}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">&quot;{review.text}&quot;</p>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}
