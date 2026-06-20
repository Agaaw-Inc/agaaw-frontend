"use client";

import React from "react";
import { BookOpen } from "lucide-react";

interface AcademicInfoCardProps {
    onEdit: () => void;
}

export default function AcademicInfoCard({ onEdit }: AcademicInfoCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Academic Information</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                    Edit Info
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Institution</p>
                    <p className="text-sm font-semibold text-gray-900">University of Dhaka</p>
                </div>
                <div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Degree Level</p>
                    <p className="text-sm font-semibold text-gray-900">Bachelor of Science</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm font-semibold text-gray-900">Computer Science & Engineering</p>
                </div>
                
                {/* Second Row */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Student ID</p>
                    <p className="text-sm font-semibold text-gray-900">CSE-2021-0307</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Current Semester</p>
                    <p className="text-sm font-semibold text-gray-900">6th Semester — 3rd Year</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Expected Graduation</p>
                    <p className="text-sm font-semibold text-gray-900">December 2025</p>
                </div>

                {/* Third Row */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">CGPA</p>
                    <p className="text-sm font-semibold text-gray-900">3.85 / 4.00</p>
                </div>
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                    <p className="text-[11px] text-teal-600 font-bold uppercase tracking-wider mb-1">Department Ranking</p>
                    <p className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
                        <span className="text-teal-500">↗</span> Top 5% of Department
                    </p>
                </div>
            </div>
        </div>
    );
}
