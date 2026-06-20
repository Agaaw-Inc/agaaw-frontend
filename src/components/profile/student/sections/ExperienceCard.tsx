"use client";

import React from "react";
import { Briefcase, Plus } from "lucide-react";

interface ExperienceCardProps {
    onEdit: () => void;
}

export default function ExperienceCard({ onEdit }: ExperienceCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Experience</h2>
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
                    <div className="w-12 h-12 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-xl">
                        P
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Software Engineer Intern</h3>
                                <p className="text-[13px] text-gray-600 font-medium">Pathao Ltd. • Dhaka, Bangladesh</p>
                            </div>
                            <span className="text-[13px] text-gray-500 font-medium shrink-0">
                                Jan 2024 — Aug 2024
                            </span>
                        </div>
                        
                        <ul className="mt-3 space-y-1.5">
                            <li className="text-[13px] text-gray-600 flex items-start gap-2">
                                <span className="text-gray-300 mt-0.5">•</span>
                                <span>Assisted in developing RESTful APIs using Node.js and Express for the core logistics platform.</span>
                            </li>
                            <li className="text-[13px] text-gray-600 flex items-start gap-2">
                                <span className="text-gray-300 mt-0.5">•</span>
                                <span>Collaborated with the frontend team to integrate backend components with external services.</span>
                            </li>
                            <li className="text-[13px] text-gray-600 flex items-start gap-2">
                                <span className="text-gray-300 mt-0.5">•</span>
                                <span>Participated in daily stand-ups and code reviews following Agile methodologies.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
