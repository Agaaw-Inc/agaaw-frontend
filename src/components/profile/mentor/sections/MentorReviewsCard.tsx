"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface MentorReviewsCardProps {
    profile?: any;
    emptyMessage?: string;
}

export default function MentorReviewsCard({ profile, emptyMessage = "No reviews yet." }: MentorReviewsCardProps) {
    const rawReviews = profile?.reviews || [];

    if (rawReviews.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Reviews & Ratings</h2>
                <p className="text-sm text-gray-400 italic py-6 text-center">{emptyMessage}</p>
            </div>
        );
    }

    const averageRating = profile?.stats?.rating ?? 0;
    const totalReviews = profile?.stats?.totalReviews ?? rawReviews.length;

    // Calculate dynamic distribution from reviews if available
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
        const count = rawReviews.filter((r: any) => Math.round(r.rating) === stars).length;
        const percentage = rawReviews.length > 0 ? Math.round((count / rawReviews.length) * 100) : 0;
        return { stars, count, percentage };
    });

    const displayedReviews = rawReviews.slice(0, 4);

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
                {displayedReviews.map((review: any) => (
                    <div key={review.id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                <Image
                                    src={review.authorImage || "https://i.pravatar.cc/100?img=33"}
                                    alt={review.authorName}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="text-sm font-bold text-gray-900">{review.authorName}</p>
                                    <span className="text-xs text-gray-400 shrink-0 font-medium">{review.date}</span>
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
                ))}
            </div>

            {rawReviews.length > 4 && (
                <div className="mt-6 text-center border-t border-gray-50 pt-4">
                    <Link 
                        href="/dashboard/mentor/reviews"
                        className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        See all {rawReviews.length} reviews →
                    </Link>
                </div>
            )}
        </div>
    );
}
