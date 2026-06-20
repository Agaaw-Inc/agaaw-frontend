"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Edit3, GraduationCap } from "lucide-react";

interface StudentProfileHeaderProps {
    onEdit: () => void;
}

export default function StudentProfileHeader({ onEdit }: StudentProfileHeaderProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image 
                        src="https://i.pravatar.cc/250?img=11" 
                        alt="Profile Picture" 
                        fill 
                        className="object-cover"
                    />
                </div>

                {/* Info Details */}
                <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Md. Omar Faruk Maruf</h1>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex w-fit">
                            Student
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            Dhaka, Bangladesh
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GraduationCap size={16} />
                            Targeting Masters in Germany
                        </div>
                    </div>

                    <div className="pt-1">
                        <p className="text-sm font-semibold text-gray-700">About me:</p>
                        <p className="text-sm text-gray-600 mt-0.5 max-w-3xl leading-relaxed">
                            Aspiring computer science student with a passion for AI and sustainable technology, seeking scholarship opportunities in Germany.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-start md:self-center mt-4 md:mt-0">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-colors">
                        Find a mentor
                    </button>
                    <button 
                        onClick={onEdit}
                        className="p-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Edit Profile"
                    >
                        <Edit3 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
