"use client";

import React from "react";
import { Microscope, Plus } from "lucide-react";

interface ResearchCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function ResearchCard({ profile, onEdit }: ResearchCardProps) {
    const researchList = (profile?.research as any[]) || [];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Microscope size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Research & Publication</h2>
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

            {researchList.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No publications or research added yet. Click plus icon to add research.</p>
            ) : (
                <div className="space-y-4">
                    {researchList.map((item, idx) => (
                        <div key={item.id || idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                <span className="text-[13px] text-gray-500 font-medium shrink-0">{item.publicationDate}</span>
                            </div>
                            <p className="text-[13px] text-teal-700 font-semibold mb-2">Published in: {item.publishedIn}</p>
                            {item.abstract && (
                                <p className="text-[13px] text-gray-600 leading-relaxed">
                                    <span className="font-semibold text-gray-800">Abstract:</span> {item.abstract}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
