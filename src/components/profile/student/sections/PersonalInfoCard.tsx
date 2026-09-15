"use client";

import React from "react";
import { User, CheckCircle2, Edit3 } from "lucide-react";

interface PersonalInfoCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function PersonalInfoCard({ profile, onEdit }: PersonalInfoCardProps) {
    const user = profile?.user;
    // Placeholders are for the student's own editable profile. Viewers (mentors/admins)
    // only see fields the student actually filled in.
    const isEditable = !!onEdit;
    const show = (value: unknown) => isEditable || Boolean(value);

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
    const ieltsBands = [
        { label: "L", value: ieltsData.listening },
        { label: "R", value: ieltsData.reading },
        { label: "W", value: ieltsData.writing },
        { label: "S", value: ieltsData.speaking },
    ].filter((band) => isEditable || (band.value && band.value !== "—"));

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
                    {show(user) && (
                        <div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {user ? `${user.firstName} ${user.lastName}` : "—"}
                            </p>
                        </div>
                    )}
                    {show(profile?.dateOfBirth) && (
                        <div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(profile?.dateOfBirth)}</p>
                        </div>
                    )}
                    {show(profile?.gender) && (
                        <div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-sm font-semibold text-gray-900">{profile?.gender || "—"}</p>
                        </div>
                    )}
                    {show(profile?.nationality) && (
                        <div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Nationality</p>
                            <p className="text-sm font-semibold text-gray-900">{profile?.nationality || "—"}</p>
                        </div>
                    )}
                    {/* Phone & email are omitted by the API for mentors; only the student and admins receive them. */}
                    {show(profile?.phone) && (
                        <div>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-sm font-semibold text-gray-900">{profile?.phone || "—"}</p>
                        </div>
                    )}
                    {show(user?.email) && (
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
                    )}
                </div>
            </div>

            {/* Right Side: IELTS Score */}
            {show(ieltsScoreObj?.score) && (
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
                    {ieltsBands.length > 0 && (
                        <div className="flex justify-center gap-3 mt-4 text-xs font-bold text-gray-700">
                            {ieltsBands.map((band) => (
                                <span key={band.label}>{band.label}: {band.value || "—"}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
