"use client";

import React, { useEffect, useState } from "react";
import { Star, MapPin, MessageCircle, Loader2 } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Avatar from "@/components/ui/Avatar";
import { getMentorReviews, resolveFileUrl, type MentorReviewsResult } from "@/lib/api";
import { getUserInfo } from "@/lib/auth";
import { formatReviewDate } from "@/components/profile/mentor/sections/MentorReviewsCard";

export default function MentorReviewsPage() {
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
                console.error("Failed to load reviews:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Loading reviews...</p>
            </div>
        );
    }

    const stats = reviews?.stats;
    const items = reviews?.data ?? [];

    const distribution = (stats?.distribution ?? []).map((d) => ({
        ...d,
        percentage:
            stats && stats.totalReviews > 0 ? Math.round((d.count / stats.totalReviews) * 100) : 0,
    }));

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <MessageCircle size={18} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Reviews</h1>
                        <p className="text-sm text-gray-500">What your students say about your mentorship</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-10 shadow-sm text-center">
                        <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <h2 className="text-lg font-bold text-gray-700 mb-1">No reviews yet</h2>
                        <p className="text-sm text-gray-400">
                            Once your students leave reviews, they will show up here.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Summary */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-100 sm:pr-8">
                                    <p className="text-4xl font-extrabold text-gray-900">{stats?.averageRating}</p>
                                    <div className="flex gap-0.5 my-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={16}
                                                className={
                                                    s <= Math.round(stats?.averageRating ?? 0)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-200"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {stats?.totalReviews} review{stats?.totalReviews === 1 ? "" : "s"}
                                    </p>
                                </div>
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
                        </div>

                        {/* All Reviews */}
                        <div className="space-y-4">
                            {items.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-sm uppercase">
                                            <Avatar
                                                src={resolveFileUrl(review.student.profileImage)}
                                                name={review.student.firstName}
                                                alt={`${review.student.firstName} ${review.student.lastName}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {review.student.firstName} {review.student.lastName}
                                                    </p>
                                                    {review.student.nationality && (
                                                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                            <MapPin size={12} className="text-gray-400" />
                                                            {review.student.nationality}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 shrink-0 font-medium">
                                                    {formatReviewDate(review.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5 my-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={14}
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
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
