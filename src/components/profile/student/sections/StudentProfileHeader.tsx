"use client";

import React from "react";
import { Camera, MapPin, Edit3, GraduationCap, MessageSquare, CalendarClock, Ban } from "lucide-react";
import { resolveFileUrl, type SessionListItem } from "@/lib/api";
import { formatSessionWhen } from "@/lib/sessionFormat";
import Avatar from "@/components/ui/Avatar";

interface StudentProfileHeaderProps {
    profile: any;
    onEdit?: () => void;
    showConnectedActions?: boolean;
    onMessage?: () => void;
    onScheduleMeeting?: () => void;
    upcomingSession?: SessionListItem | null;
    onRescheduleMeeting?: () => void;
    onCancelMeeting?: () => void;
}

export default function StudentProfileHeader({
    profile,
    onEdit,
    showConnectedActions,
    onMessage,
    onScheduleMeeting,
    upcomingSession,
    onRescheduleMeeting,
    onCancelMeeting,
}: StudentProfileHeaderProps) {
    const user = profile?.user;
    const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

    const avatar = (
        <Avatar
            src={resolveFileUrl(user?.profileImage)}
            name={initials}
            alt="Profile Picture"
            fallbackClassName="text-2xl font-bold text-teal-600"
        />
    );

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
                {/* Profile Picture */}
                {onEdit ? (
                    <button
                        type="button"
                        onClick={onEdit}
                        title="Change profile picture"
                        className="group relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center"
                    >
                        {avatar}
                        <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </span>
                    </button>
                ) : (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                        {avatar}
                    </div>
                )}

                {/* Info Details */}
                <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {user ? `${user.firstName} ${user.lastName}` : "Student Profile"}
                        </h1>
                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex w-fit">
                            Student
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            {profile?.nationality || "Add nationality / location"}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <GraduationCap size={16} />
                            {profile?.studyLevel ? (
                                <span className="capitalize">
                                    Targeting {profile.studyLevel} {profile.fieldOfInterest ? `in ${profile.fieldOfInterest}` : ""}
                                </span>
                            ) : (
                                "Add targeting education goals"
                            )}
                        </div>
                    </div>

                    <div className="pt-1">
                        <p className="text-sm font-semibold text-gray-700">About me:</p>
                        <p className="text-sm text-gray-600 mt-0.5 max-w-3xl leading-relaxed">
                            {profile?.bio || "Add a short bio about yourself to attract mentors..."}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                {onEdit && (
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
                )}

                {/* Actions for a connected mentor viewing this student */}
                {!onEdit && showConnectedActions && (
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0 self-start md:self-center mt-4 md:mt-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onMessage}
                                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-teal-600/10"
                            >
                                <MessageSquare size={16} /> Message
                            </button>
                            {upcomingSession ? (
                                <>
                                    <button
                                        onClick={onRescheduleMeeting}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <CalendarClock size={16} /> Reschedule
                                    </button>
                                    <button
                                        onClick={onCancelMeeting}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <Ban size={16} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onScheduleMeeting}
                                    className="flex items-center gap-2 px-5 py-2.5 border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <CalendarClock size={16} /> Schedule a Meeting
                                </button>
                            )}
                        </div>
                        {upcomingSession && (
                            <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-2.5 py-1 font-semibold">
                                Next session: {formatSessionWhen(upcomingSession.scheduledAt)} &middot; {upcomingSession.title}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
