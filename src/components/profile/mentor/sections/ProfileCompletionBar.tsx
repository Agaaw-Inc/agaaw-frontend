"use client";

import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface ProfileCompletionBarProps {
    percentage?: number;
    missingItems?: string[];
}

export default function ProfileCompletionBar({ 
    percentage = 0, 
    missingItems = []
}: ProfileCompletionBarProps) {
    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-teal-50 border border-teal-100 rounded-xl px-6 py-4 text-center">
                <p className="text-base font-bold text-teal-800 mb-2">{percentage}% Profile Completion</p>
                <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden max-w-md mx-auto">
                    <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-xs text-teal-600 font-medium mt-2">Complete your profile to 100% to get verified by an admin.</p>
            </div>

            {/* Celebration or Missing Requirements */}
            {percentage === 100 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-4 flex items-center gap-3 text-emerald-800 shadow-sm animate-in fade-in">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-lg">
                        🎉
                    </div>
                    <div>
                        <h3 className="text-sm font-bold">Profile 100% Completed!</h3>
                        <p className="text-xs text-emerald-600 mt-0.5">Your profile meets all requirements and is ready for admin review and student sessions.</p>
                    </div>
                </div>
            ) : missingItems && missingItems.length > 0 ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-6 py-4 animate-in fade-in">
                    <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
                        <AlertTriangle size={16} />
                        Missing Requirements ({missingItems.length})
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {missingItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 font-medium">
                                <ChevronRight size={14} className="mt-0.5 shrink-0 text-amber-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
