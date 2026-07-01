"use client";

import React from "react";
import { GraduationCap, MapPin, Briefcase, DollarSign, Languages, CheckCircle2, Edit3, Award, Bookmark, Calendar, Phone } from "lucide-react";

interface MentorDetailsCardProps {
    profile: any;
    onEdit: () => void;
}

export default function MentorDetailsCard({ profile, onEdit }: MentorDetailsCardProps) {
    const formatLanguages = (langs: string[]) => {
        if (!langs || langs.length === 0) return "Not Specified";
        return langs.join(", ");
    };

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
                    value={profile?.currentUniversity || "Not Specified"}
                />
                <DetailRow
                    icon={<MapPin size={18} className="text-teal-600" />}
                    label="Country Location"
                    value={profile?.countryName || "Not Specified"}
                />
                <DetailRow
                    icon={<Briefcase size={18} className="text-teal-600" />}
                    label="Experience"
                    value={profile?.experienceYears ? `${profile.experienceYears} years` : "Not Specified"}
                />
                <DetailRow
                    icon={<DollarSign size={18} className="text-teal-600" />}
                    label="Hourly Rate"
                    value={profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : "Not Specified"}
                />
                <DetailRow
                    icon={<Languages size={18} className="text-teal-600" />}
                    label="Languages"
                    value={formatLanguages(profile?.languages)}
                />
                <DetailRow
                    icon={<Award size={18} className="text-teal-600" />}
                    label="Degree"
                    value={profile?.degree || "Not Specified"}
                />
                <DetailRow
                    icon={<Bookmark size={18} className="text-teal-600" />}
                    label="Subject / Specialization"
                    value={profile?.subject || "Not Specified"}
                />
                <DetailRow
                    icon={<Calendar size={18} className="text-teal-600" />}
                    label="Current Semester"
                    value={profile?.semester || "Not Specified"}
                />
                <DetailRow
                    icon={<CheckCircle2 size={18} className="text-teal-600" />}
                    label="Visa Status"
                    value={profile?.visaStatus || "Not Specified"}
                />
                <DetailRow
                    icon={<Phone size={18} className="text-teal-600" />}
                    label="Phone Number"
                    value={profile?.phone || "Not Specified"}
                />
                <DetailRow
                    icon={<MapPin size={18} className="text-teal-600" />}
                    label="City Name"
                    value={profile?.cityName || "Not Specified"}
                />
                <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Availability</p>
                        <p className={`text-sm font-semibold flex items-center gap-1.5 ${profile?.isAvailable ? 'text-emerald-600' : 'text-amber-600'}`}>
                            <span className={`w-2 h-2 rounded-full inline-block ${profile?.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {profile?.isAvailable ? "Available" : "Busy / Fully Booked"}
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
