"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, X, Check, Loader2 } from "lucide-react";
import type { Review } from "@/data/profileTypes";

interface ReviewsSectionProps {
  username: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isOwner: boolean;
}

export default function ReviewsSection({
  username,
  reviews,
  averageRating,
  totalReviews,
  isOwner,
}: ReviewsSectionProps) {
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = localReviews.filter((r) => Math.round(r.rating) === stars).length;
    return {
      stars,
      count,
      percentage:
        localReviews.length > 0
          ? Math.round((count / localReviews.length) * 100)
          : 0,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newAuthor.trim()) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const newReviewItem: Review = {
        id: `r-new-${Date.now()}`,
        authorName: newAuthor,
        authorImage: `https://i.pravatar.cc/80?u=${encodeURIComponent(newAuthor)}`,
        rating: newRating,
        text: newText,
        date: new Date().toISOString().split("T")[0],
      };

      setLocalReviews([newReviewItem, ...localReviews]);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setNewText("");
        setNewAuthor("");
        setNewRating(5);
      }, 1000);
    }, 800);
  };

  const displayedReviews = localReviews.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Reviews & Ratings
      </h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
        {/* Average rating */}
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
          <p className="text-xs text-gray-500 font-semibold">{localReviews.length} reviews</p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 text-right font-semibold">
                {d.stars}
              </span>
              <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right font-semibold">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
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
                  <p className="text-sm font-bold text-gray-900">
                    {review.authorName}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0 font-medium">
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

      {/* See all / Actions Footer */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {localReviews.length > 4 ? (
          <Link
            href={`/profile/${username}/reviews`}
            className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            See all {localReviews.length} reviews →
          </Link>
        ) : (
          <div />
        )}

        {/* Write review button (for non-owners only) */}
        {!isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors"
          >
            ✍️ Write a Review
          </button>
        )}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Write a Review</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                  <Check size={24} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Review Submitted!</h4>
                <p className="text-sm text-gray-500">Thank you for sharing your experience.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform active:scale-95"
                      >
                        <Star
                          size={28}
                          className={
                            star <= (hoverRating ?? newRating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="reviewer-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="reviewer-name"
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Sarah J."
                    className="w-full border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-2.5 text-sm outline-none font-semibold text-gray-800 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reviewer-comment" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    id="reviewer-comment"
                    required
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Describe your experience with this mentor..."
                    rows={4}
                    className="w-full border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-2.5 text-sm outline-none font-semibold text-gray-800 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
