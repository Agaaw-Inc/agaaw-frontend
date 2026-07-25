"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { resolveFileUrl, type MentorReviewItem, type MentorReviewStats } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";

interface MentorReviewsCardProps {
    reviews: MentorReviewItem[];
    stats: MentorReviewStats;
    emptyMessage?: string;
    /** When set, shows a "See all" link if there are more reviews than fit the card. */
    viewAllHref?: string;
}

export function formatReviewDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function MentorReviewsCard({
    reviews,
    stats,
    emptyMessage = "No reviews yet.",
    viewAllHref,
}: MentorReviewsCardProps) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Reviews & Ratings</h2>
                <p className="text-sm text-gray-400 italic py-6 text-center">{emptyMessage}</p>
            </div>
        );
    }

    const { averageRating, totalReviews } = stats;

    const distribution = stats.distribution.map((d) => ({
        ...d,
        percentage: totalReviews > 0 ? Math.round((d.count / totalReviews) * 100) : 0,
    }));

    const displayedReviews = reviews.slice(0, 4);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Reviews & Ratings</h2>

            {/* Summary */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-100 sm:pr-8">
                    <p className="text-4xl font-extrabold text-gray-900">{averageRating}</p>
                    <div className="flex gap-0.5 my-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={16}
                                className={
                                    s <= Math.round(averageRating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-200"
                                }
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{totalReviews} reviews</p>
                </div>

                {/* Distribution Bars */}
                <div className="flex-1 space-y-2">
                    {distribution.map((d) => (
                        <div key={d.stars} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-3 text-right font-semibold">{d.stars}</span>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-500 rounded-full transition-all duration-700"
                                    style={{ width: `${d.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400 w-6 text-right font-semibold">{d.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-5">
                {displayedReviews.map((review) => {
                    const authorName = `${review.student.firstName} ${review.student.lastName}`;
                    return (
                        <div key={review.id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-sm uppercase">
                                    <Avatar
                                        src={resolveFileUrl(review.student.profileImage)}
                                        name={review.student.firstName}
                                        alt={authorName}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="text-sm font-bold text-gray-900">{authorName}</p>
                                        <span className="text-xs text-gray-400 shrink-0 font-medium">
                                            {formatReviewDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={12}
                                                className={
                                                    s <= review.rating
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-200"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {viewAllHref && reviews.length > displayedReviews.length && (
                <div className="mt-6 text-center border-t border-gray-50 pt-4">
                    <Link
                        href={viewAllHref}
                        className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        See all {reviews.length} reviews →
                    </Link>
                </div>
            )}
        </div>
    );
}
