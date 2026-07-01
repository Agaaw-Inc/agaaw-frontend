"use client";

import React from "react";
import { Zap, Plus } from "lucide-react";

interface SkillsCardProps {
    profile: any;
    onEdit: () => void;
}

export default function SkillsCard({ profile, onEdit }: SkillsCardProps) {
    const skills = profile?.skills || [];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Zap size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Top Skills</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {skills.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No skills added yet. Click plus icon to add your skills.</p>
            ) : (
                <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill: string, index: number) => (
                        <span 
                            key={index} 
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-default"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
