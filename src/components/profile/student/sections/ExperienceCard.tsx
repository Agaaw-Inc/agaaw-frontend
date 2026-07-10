"use client";
 
import React from "react";
import { Briefcase, Plus } from "lucide-react";
 
interface ExperienceCardProps {
    profile: any;
    onEdit?: () => void;
}
 
export default function ExperienceCard({ profile, onEdit }: ExperienceCardProps) {
    const experiences = (profile?.experience as any[]) || [];

    const getInitial = (company: string) => {
        return company ? company[0].toUpperCase() : "E";
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Experience</h2>
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
 
            {experiences.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No work experience added yet. Click plus icon to add your experience.</p>
            ) : (
                <div className="space-y-6">
                    {experiences.map((exp, idx) => (
                        <div key={exp.id || idx} className="flex gap-4">
                            {/* Icon/Logo placeholder */}
                            <div className="w-12 h-12 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xl">
                                {getInitial(exp.company)}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{exp.title}</h3>
                                        <p className="text-[13px] text-gray-600 font-medium">{exp.company} • {exp.location}</p>
                                    </div>
                                    <span className="text-[13px] text-gray-500 font-medium shrink-0">
                                        {exp.startDate} — {exp.endDate || "Present"}
                                    </span>
                                </div>
                                
                                {exp.description && (
                                    <ul className="mt-3 space-y-1.5">
                                        {exp.description.split("\n").map((bullet: string, bIdx: number) => {
                                            const cleaned = bullet.replace(/^-\s*/, ""); // remove leading hyphen if any
                                            if (!cleaned.trim()) return null;
                                            return (
                                                <li key={bIdx} className="text-[13px] text-gray-600 flex items-start gap-2">
                                                    <span className="text-gray-300 mt-0.5">•</span>
                                                    <span>{cleaned}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
