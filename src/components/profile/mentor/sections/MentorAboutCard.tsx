"use client";

import React, { useState } from "react";
import { Edit3 } from "lucide-react";

interface MentorAboutCardProps {
    profile: any;
    onEdit: () => void;
}

export default function MentorAboutCard({ profile, onEdit }: MentorAboutCardProps) {
    const [expanded, setExpanded] = useState(false);

    const bio = profile?.bio || "";
    const hasLongBio = bio.length > 220;
    const shortBio = hasLongBio ? bio.slice(0, 220) + "..." : bio;

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

            {bio ? (
                <>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {expanded ? bio : shortBio}
                    </p>
                    {hasLongBio && (
                        <button 
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm font-semibold text-teal-600 hover:text-teal-700 mt-2 transition-colors"
                        >
                            {expanded ? "Show less" : "Read more ▾"}
                        </button>
                    )}
                </>
            ) : (
                <p className="text-sm text-gray-400 italic">No details provided yet. Click edit to tell students about yourself!</p>
            )}
        </div>
    );
}
