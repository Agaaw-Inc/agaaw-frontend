"use client";

import React from "react";
import { Edit3 } from "lucide-react";

interface MentorExpertiseCardProps {
    onEdit: () => void;
}

export default function MentorExpertiseCard({ onEdit }: MentorExpertiseCardProps) {
    const expertise = [
        "Scholarship Essays",
        "UK Universities",
        "Personal Statements",
        "IELTS Preparation",
        "Application Strategy",
        "Interview Coaching"
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Expertise</h2>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                    <Edit3 size={14} /> Edit
                </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {expertise.map((tag, index) => (
                    <span 
                        key={index} 
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-default"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
