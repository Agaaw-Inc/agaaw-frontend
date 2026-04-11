"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/data/profileTypes";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isOwner: boolean;
}

export default function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  isOwner,
}: ReviewsSectionProps) {
  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    percentage:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => Math.round(r.rating) === stars).length /
              reviews.length) *
              100
          )
        : 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        Reviews & Ratings
      </h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
        {/* Average rating */}
        <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-100 sm:pr-8">
          <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
          <div className="flex gap-0.5 my-1">
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
          <p className="text-xs text-gray-500">{totalReviews} reviews</p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 text-right">
                {d.stars}
              </span>
              <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image
                  src={review.authorImage}
                  alt={review.authorName}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {review.authorName}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {review.date}
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
                <p className="text-sm text-gray-600 leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write review button (for non-owners only) */}
      {!isOwner && (
        <button className="mt-5 w-full py-3 border-2 border-dashed border-teal-200 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors">
          ✍️ Write a Review
        </button>
      )}
    </div>
  );
}
