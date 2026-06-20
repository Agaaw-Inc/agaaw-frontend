"use client";

import React from "react";
import { Trophy, Plus } from "lucide-react";

interface MentorAchievementsCardProps {
    onEdit: () => void;
}

export default function MentorAchievementsCard({ onEdit }: MentorAchievementsCardProps) {
    const achievements = [
        {
            id: 1,
            title: "Outstanding Graduate Mentor Award",
            issuer: "University of Oxford (2024)",
            icon: "🏆"
        },
        {
            id: 2,
            title: "Global Excellence Scholarship Recipient",
            issuer: "British Council (2018)",
            icon: "🥇"
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Achievements & Awards</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((item) => (
                    <div key={item.id} className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                            <p className="text-xs font-medium text-gray-500 mt-0.5">{item.issuer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
