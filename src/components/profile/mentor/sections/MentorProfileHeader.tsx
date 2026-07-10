"use client";

import React from "react";
import { Camera, MapPin, GraduationCap, Star, Users, CalendarCheck, Clock, CheckCircle, Edit3 } from "lucide-react";
import { resolveFileUrl } from "@/lib/api";

interface MentorProfileHeaderProps {
    profile: any;
    onEdit?: () => void;
}

export default function MentorProfileHeader({ profile, onEdit }: MentorProfileHeaderProps) {
    const user = profile?.user;
    const fullName = user ? `${user.firstName} ${user.lastName}` : "Mentor Name";

    const avatar = user?.profileImage ? (
        <img
            src={resolveFileUrl(user.profileImage)}
            alt={fullName}
            className="w-full h-full object-cover"
        />
    ) : (
        user?.firstName?.substring(0, 2) || "M"
    );

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Left: Avatar + Info */}
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    {onEdit ? (
                        <button
                            type="button"
                            onClick={onEdit}
                            title="Change profile picture"
                            className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-2xl uppercase"
                        >
                            {avatar}
                            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={20} className="text-white" />
                            </span>
                        </button>
                    ) : (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-2xl uppercase">
                            {avatar}
                        </div>
                    )}

                    {/* Info */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{fullName}</h1>
                            {profile?.isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100">
                                    <CheckCircle size={12} /> Verified
                                </span>
                            )}
                            <span className="px-2.5 py-0.5 bg-teal-500 text-white rounded-full text-xs font-semibold">
                                Mentor
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5">
                                <GraduationCap size={15} className="text-gray-400" />
                                {profile?.currentUniversity || "No University Specified"}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                <MapPin size={15} className="text-gray-400" />
                                {profile?.countryName || "No Country Specified"}
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-5 pt-1">
                            <StatItem icon={Users} value="0" label="Students" />
                            <StatItem icon={Star} value="0 ★" label="0 reviews" />
                            <StatItem icon={CalendarCheck} value="0" label="Sessions" />
                            <StatItem icon={Clock} value="100%" label="Response" />
                        </div>
                    </div>
                </div>

                {/* Right: Edit Button */}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-5 py-2.5 border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-colors shrink-0 self-start"
                    >
                        <Edit3 size={15} /> Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, value, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; value: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-gray-900">{value}</span>
            <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
    );
}
