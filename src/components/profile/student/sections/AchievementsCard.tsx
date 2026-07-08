"use client";

import React from "react";
import { Trophy, Plus } from "lucide-react";

interface AchievementsCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function AchievementsCard({ profile, onEdit }: AchievementsCardProps) {
    const achievements = (profile?.achievements as any[]) || [];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Achievements & Awards</h2>
                </div>
                {onEdit && (
                    <button 
                        onClick={onEdit}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {achievements.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No achievements or awards added yet. Click plus icon to add achievements.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4">
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
            )}
        </div>
    );
}
