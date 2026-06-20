"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function MentorReviewsCard() {
    const averageRating = 4.9;
    const totalReviews = 38;

    const distribution = [
        { stars: 5, count: 34, percentage: 89 },
        { stars: 4, count: 3, percentage: 8 },
        { stars: 3, count: 1, percentage: 3 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
    ];

    const reviews = [
        {
            id: 1,
            authorName: "Sarah Johnson",
            authorImage: "https://i.pravatar.cc/100?img=47",
            rating: 5,
            date: "2026-03-15",
            text: "Arif helped me secure a full scholarship to Oxford. His guidance on the personal statement was invaluable. I couldn't have done it without him!",
        },
        {
            id: 2,
            authorName: "James Lee",
            authorImage: "https://i.pravatar.cc/100?img=12",
            rating: 5,
            date: "2026-02-28",
            text: "Extremely knowledgeable about UK universities. The mock interview session was incredibly helpful. Arif pointed out areas I never would have thought to improve.",
        },
    ];

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
                {reviews.map((review) => (
                    <div key={review.id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                <Image
                                    src={review.authorImage}
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
        </div>
    );
}
