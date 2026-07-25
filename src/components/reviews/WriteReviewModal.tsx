"use client";

import React, { useEffect, useState } from "react";
import { X, Star, Loader2, AlertCircle, Send } from "lucide-react";
import { getMyMentorReview, submitMentorReview } from "@/lib/api";

const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 1000;

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
};

interface WriteReviewModalProps {
    mentorId: string;
    mentorName: string;
    onClose: () => void;
    /** Called after a successful save. `isUpdate` is true when an existing review was edited. */
    onSuccess: (isUpdate: boolean) => void;
}

export default function WriteReviewModal({
    mentorId,
    mentorName,
    onClose,
    onSuccess,
}: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState("");
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const existing = await getMyMentorReview(mentorId);
                if (cancelled) return;
                if (existing) {
                    setRating(existing.rating);
                    setText(existing.text);
                    setHasExistingReview(true);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mentorId]);

    const trimmedLength = text.trim().length;
    const isValid = rating >= 1 && trimmedLength >= MIN_TEXT_LENGTH && trimmedLength <= MAX_TEXT_LENGTH;
    const displayRating = hoverRating || rating;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const result = await submitMentorReview(mentorId, { rating, text: text.trim() });
            onSuccess(Boolean(result?.isUpdate));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {hasExistingReview ? "Update Your Review" : "Write a Review"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Share your experience with {mentorName}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
                        <div className="p-6 space-y-6 flex-1">
                            {error && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Star Rating */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Your Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                className="p-1 transition-transform hover:scale-110 disabled:opacity-50"
                                                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                                            >
                                                <Star
                                                    size={30}
                                                    className={
                                                        star <= displayRating
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-gray-200"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {displayRating > 0 && (
                                        <span className="text-sm font-semibold text-gray-600">
                                            {RATING_LABELS[displayRating]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    value={text}
                                    maxLength={MAX_TEXT_LENGTH}
                                    onChange={(e) => setText(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-50"
                                    placeholder="How did this mentor help you? What stood out about the experience?"
                                />
                                <p
                                    className={`text-xs ${
                                        trimmedLength >= MIN_TEXT_LENGTH
                                            ? "text-gray-400"
                                            : "text-amber-600 font-semibold"
                                    }`}
                                >
                                    {trimmedLength}/{MIN_TEXT_LENGTH} characters minimum
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} /> {hasExistingReview ? "Update Review" : "Submit Review"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
