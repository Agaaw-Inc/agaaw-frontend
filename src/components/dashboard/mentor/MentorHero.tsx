"use client";

import React from "react";
import { CheckCircle2, GraduationCap, MapPin, BookOpen, Clock, Briefcase, AlertCircle } from "lucide-react";

interface MentorHeroProps {
    profile: any;
}

export default function MentorHero({ profile }: MentorHeroProps) {
    const firstName = profile?.user?.firstName || "Mentor";
    const lastName = profile?.user?.lastName || "";
    const mentorName = `${firstName} ${lastName}`.trim();

    const university = profile?.currentUniversity || "University not specified";
    const country = profile?.countryName || "Country not specified";
    const subject = profile?.subject || "Subject not specified";
    const semester = profile?.semester ? `${profile.semester}` : "Semester not specified";
    const experience = profile?.experienceYears !== null && profile?.experienceYears !== undefined
        ? `${profile.experienceYears} Years Exp.` 
        : "Experience not specified";

    const isApproved = !!profile?.isApproved;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            
            <div className="space-y-4 flex-1">
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Welcome Back, {firstName} <span className="text-2xl">👋</span>
                        </h1>
                        {isApproved ? (
                            <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">
                                <CheckCircle2 size={14} />
                                Verified Mentor
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100">
                                <AlertCircle size={14} />
                                Pending Verification
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">Helping students achieve their study abroad dreams.</p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap size={16} className="text-gray-400" />
                        <span className="font-medium">{university}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="font-medium">{country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen size={16} className="text-gray-400" />
                        <span className="font-medium">{subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span className="font-medium">{semester}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase size={16} className="text-gray-400" />
                        <span className="font-medium">{experience}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full md:w-auto md:min-w-[300px]">
                {/* Profile Completion */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-900">Profile Completion</span>
                        <span className="text-sm font-bold text-teal-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                </div>

                {/* Verification Center */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Verification Center</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className={isApproved ? "text-teal-500" : "text-gray-300"} />
                            <span className="text-xs font-semibold text-gray-700">University ID</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className={isApproved ? "text-teal-500" : "text-gray-300"} />
                            <span className="text-xs font-semibold text-gray-700">Enrollment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className={isApproved ? "text-teal-500" : "text-gray-300"} />
                            <span className="text-xs font-semibold text-gray-700">Identity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-teal-500" />
                            <span className="text-xs font-semibold text-gray-700">Email</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
