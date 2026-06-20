"use client";

import React from "react";
import { HeartHandshake, Plus } from "lucide-react";

interface VolunteerCardProps {
    onEdit: () => void;
}

export default function VolunteerCard({ onEdit }: VolunteerCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <HeartHandshake size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Volunteer Experience</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex gap-4">
                    {/* Icon/Logo placeholder */}
                    <div className="w-12 h-12 bg-teal-50 rounded-lg shrink-0 flex items-center justify-center text-teal-600 font-bold text-xl">
                        V
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Volunteer Teacher</h3>
                                <p className="text-[13px] text-gray-600 font-medium">Shobujer Ovijan (NGO) • Dhaka</p>
                            </div>
                            <span className="text-[13px] text-gray-500 font-medium shrink-0">
                                Jan 2022 — Present
                            </span>
                        </div>
                        
                        <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                            Providing free math classes and basic computer literacy lessons to underprivileged children in the local community weekly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
