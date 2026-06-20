"use client";

import React, { useState } from "react";
import { Edit3 } from "lucide-react";

interface MentorAboutCardProps {
    onEdit: () => void;
}

export default function MentorAboutCard({ onEdit }: MentorAboutCardProps) {
    const [expanded, setExpanded] = useState(false);

    const bio = `Scholarship consultant and study abroad expert with 8+ years of experience helping students achieve their academic dreams. I've personally guided over 300 students through successful applications to top universities in the UK, US, and Europe. My approach combines strategic planning with personalized application review to ensure every student presents their best self to admissions committees.`;

    const shortBio = bio.slice(0, 220) + "...";

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">About</h2>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                    <Edit3 size={14} /> Edit
                </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
                {expanded ? bio : shortBio}
            </p>
            <button 
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700 mt-2 transition-colors"
            >
                {expanded ? "Show less" : "Read more ▾"}
            </button>
        </div>
    );
}
