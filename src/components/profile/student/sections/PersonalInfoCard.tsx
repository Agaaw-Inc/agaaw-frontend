"use client";

import React from "react";
import { User, CheckCircle2, Edit3 } from "lucide-react";

interface PersonalInfoCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function PersonalInfoCard({ profile, onEdit }: PersonalInfoCardProps) {
    const user = profile?.user;
    
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const ieltsScoreObj = profile?.testScores?.find((ts: any) => ts.testType === "ielts");
    let ieltsData = { overall: "—", listening: "—", reading: "—", writing: "—", speaking: "—" };
    if (ieltsScoreObj?.score) {
        try {
            ieltsData = JSON.parse(ieltsScoreObj.score);
        } catch {
            ieltsData = { overall: ieltsScoreObj.score, listening: "—", reading: "—", writing: "—", speaking: "—" };
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side: Personal Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex-[2]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <User size={20} className="text-teal-600" />
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
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
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {user ? `${user.firstName} ${user.lastName}` : "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(profile?.dateOfBirth)}</p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.gender || "—"}</p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Nationality</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.nationality || "—"}</p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900">{profile?.phone || "—"}</p>
                    </div>
                    <div className="md:col-span-1">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Verified Email Address</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-semibold text-gray-900">{user?.email || "—"}</p>
                            {(user?.isVerified) && (
                                <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={12} /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: IELTS Score */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex-1 flex flex-col items-center justify-center text-center relative group">
                {onEdit && (
                    <button 
                        onClick={onEdit}
                        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Edit Language Test Score"
                    >
                        <Edit3 size={16} />
                    </button>
                )}
                <p className="text-sm font-semibold text-gray-600 mb-2">IELTS Score</p>
                <h3 className="text-5xl font-extrabold text-teal-600">{ieltsData.overall || "—"}</h3>
                <p className="text-xs font-semibold text-gray-500 mt-2">Overall Band Score</p>
                <div className="flex justify-center gap-3 mt-4 text-xs font-bold text-gray-700">
                    <span>L: {ieltsData.listening || "—"}</span>
                    <span>R: {ieltsData.reading || "—"}</span>
                    <span>W: {ieltsData.writing || "—"}</span>
                    <span>S: {ieltsData.speaking || "—"}</span>
                </div>
            </div>
        </div>
    );
}
