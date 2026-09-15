"use client";

import React from "react";
import { BookOpen } from "lucide-react";

interface AcademicInfoCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function AcademicInfoCard({ profile, onEdit }: AcademicInfoCardProps) {
    // "Add …" placeholders belong to the student's own editable profile. Viewers
    // (mentors/admins) only see fields the student actually filled in.
    const isEditable = !!onEdit;
    const show = (value: unknown) => isEditable || Boolean(value);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Academic Information</h2>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Edit Info
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {show(profile?.institution) && (
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Institution</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.institution || "Add Institution"}</p>
                    </div>
                )}
                {show(profile?.degreeLevel) && (
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Degree Level</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.degreeLevel || "Add Degree Level"}</p>
                    </div>
                )}
                {show(profile?.department) && (
                    <div className="md:col-span-2">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Department</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.department || "Add Department"}</p>
                    </div>
                )}

                {/* Second Row */}
                {show(profile?.studentId) && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Student ID</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.studentId || "Add Student ID"}</p>
                    </div>
                )}
                {show(profile?.currentSemester) && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Current Semester</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.currentSemester || "Add Current Semester"}</p>
                    </div>
                )}
                {show(profile?.expectedGraduation) && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Expected Graduation</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.expectedGraduation || "Add Expected Graduation"}</p>
                    </div>
                )}

                {/* Third Row */}
                {show(profile?.cgpa) && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">CGPA</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {profile?.cgpa ? `${profile.cgpa} / ${profile.cgpaScale || "4.00"}` : "Add CGPA"}
                        </p>
                    </div>
                )}
                {show(profile?.ranking) && (
                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                        <p className="text-[11px] text-teal-600 font-bold uppercase tracking-wider mb-1">Department Ranking</p>
                        <p className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
                            <span className="text-teal-500">↗</span> {profile?.ranking || "Add Department Ranking"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
