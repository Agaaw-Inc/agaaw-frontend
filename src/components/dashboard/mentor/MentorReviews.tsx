"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

export default function MentorReviews() {
    const reviews = [
        {
            id: "1",
            studentName: "Ayman S.",
            country: "Bangladesh",
            rating: 5,
            text: "Helped me secure admission to my dream university. The insights on the SOP were invaluable!",
        },
        {
            id: "2",
            studentName: "Sarah M.",
            country: "India",
            rating: 5,
            text: "Very professional and friendly. Answered all my questions regarding the visa process.",
        },
        {
            id: "3",
            studentName: "David K.",
            country: "Nigeria",
            rating: 4,
            text: "Great guidance on finding the right scholarships in Germany. Highly recommended.",
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Reviews & Testimonials</h2>
                
                {/* Overall Rating Summary */}
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                    <div className="flex items-center text-amber-500">
                        <span className="text-xl font-black mr-1">4.9</span>
                        <Star size={18} fill="currentColor" />
                    </div>
                    <div className="h-6 w-px bg-amber-200"></div>
                    <span className="text-xs font-semibold text-amber-800">Based on 120 Reviews</span>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{review.studentName}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                    <MapPin size={12} className="text-gray-400" /> {review.country}
                                </div>
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
                        <p className="text-sm text-gray-600 italic">"{review.text}"</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <Link 
                    href="/dashboard/mentor/reviews"
                    className="text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors inline-block"
                >
                    View all reviews
                </Link>
            </div>
        </div>
    );
}
