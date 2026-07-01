"use client";

import React from "react";
import { Edit3 } from "lucide-react";

interface MentorExpertiseCardProps {
    profile: any;
    onEdit: () => void;
}

export default function MentorExpertiseCard({ profile, onEdit }: MentorExpertiseCardProps) {
    const expertise = profile?.expertiseTags?.map((et: any) => et.tag) || [];

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
                {expertise.map((tag: string, index: number) => (
                    <span 
                        key={index} 
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-default"
                    >
                        {tag}
                    </span>
                ))}
                {expertise.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No expertise tags added yet. Click edit to add your specialties!</p>
                )}
            </div>
        </div>
    );
}
