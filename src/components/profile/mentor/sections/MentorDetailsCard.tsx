"use client";

import React from "react";
import { GraduationCap, MapPin, Briefcase, DollarSign, Languages, CheckCircle2, Eye, Edit3, Award, Bookmark, Calendar } from "lucide-react";

interface MentorDetailsCardProps {
    onEdit: () => void;
}

export default function MentorDetailsCard({ onEdit }: MentorDetailsCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Mentor Details</h2>
                <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                    <Edit3 size={14} /> Edit
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <DetailRow
                    icon={<GraduationCap size={18} className="text-teal-600" />}
                    label="University"
                    value="University of Oxford"
                />
                <DetailRow
                    icon={<MapPin size={18} className="text-teal-600" />}
                    label="Country"
                    value="🇬🇧 United Kingdom"
                />
                <DetailRow
                    icon={<Briefcase size={18} className="text-teal-600" />}
                    label="Experience"
                    value="8 years"
                />
                <DetailRow
                    icon={<DollarSign size={18} className="text-teal-600" />}
                    label="Hourly Rate"
                    value="$60/hr"
                />
                <DetailRow
                    icon={<Languages size={18} className="text-teal-600" />}
                    label="Languages"
                    value="English, Bengali, Arabic"
                />
                <DetailRow
                    icon={<Award size={18} className="text-teal-600" />}
                    label="Degree"
                    value="M.Sc. in Computer Science"
                />
                <DetailRow
                    icon={<Bookmark size={18} className="text-teal-600" />}
                    label="Subject / Specialization"
                    value="Artificial Intelligence"
                />
                <DetailRow
                    icon={<Calendar size={18} className="text-teal-600" />}
                    label="Current Semester"
                    value="Graduated / Alumnus"
                />
                <DetailRow
                    icon={<CheckCircle2 size={18} className="text-teal-600" />}
                    label="Visa Status"
                    value="Tier 4 (General) Student Visa"
                />
                <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Availability</p>
                        <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                            Available
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
