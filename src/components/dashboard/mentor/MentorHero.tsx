"use client";

import React from "react";
import { CheckCircle2, GraduationCap, MapPin, BookOpen, Clock, Briefcase, AlertCircle, Sparkles } from "lucide-react";
import { calculateMentorProfileCompletion } from "@/lib/mentorProfileUtils";
import { resolveFileUrl } from "@/lib/api";

interface MentorHeroProps {
    profile: any;
    isLoading?: boolean;
}

export default function MentorHero({ profile, isLoading }: MentorHeroProps) {
    const firstName = profile?.user?.firstName || "Mentor";
    const lastName = profile?.user?.lastName || "";
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "M";
    const profileImage = profile?.user?.profileImage;

    const university = profile?.currentUniversity || "University not specified";
    const country = profile?.countryName || "Country not specified";
    const subject = profile?.subject || "Subject not specified";
    const semester = profile?.semester ? `${profile.semester}` : "Semester not specified";
    const experience = profile?.experienceYears !== null && profile?.experienceYears !== undefined
        ? `${profile.experienceYears} Years Exp.`
        : "Experience not specified";

    const isApproved = !!profile?.isApproved;
    const { percentage } = calculateMentorProfileCompletion(profile);

    const metaItems = [
        { icon: GraduationCap, value: university },
        { icon: MapPin, value: country },
        { icon: BookOpen, value: subject },
        { icon: Clock, value: semester },
        { icon: Briefcase, value: experience },
    ];

    return (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 ambient-shadow">
            {/* Decorative accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="space-y-4 flex-1 min-w-0">
                    <div>
                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                            <div className="relative w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl font-bold text-white shrink-0 overflow-hidden">
                                {profileImage ? (
                                    <img src={resolveFileUrl(profileImage)} alt={firstName} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                    Welcome back, {isLoading ? "…" : firstName}
                                </h1>
                                <p className="text-teal-50/90 text-sm md:text-base">
                                    Helping students achieve their study abroad dreams.
                                </p>
                            </div>
                            {isApproved ? (
                                <span className="flex items-center gap-1 bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                    <CheckCircle2 size={14} />
                                    Verified Mentor
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 bg-amber-400/90 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">
                                    <AlertCircle size={14} />
                                    Pending Verification
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {metaItems.map(({ icon: Icon, value }, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-teal-50/90">
                                <Icon size={16} className="text-teal-100" />
                                <span className="font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[300px]">
                    {/* Profile Completion */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-300" />
                                Profile Completion
                            </span>
                            <span className="text-sm font-extrabold text-white">{percentage}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2.5">
                            <div
                                className="bg-white h-2.5 rounded-full transition-all duration-700"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Verification Center */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Verification Center</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "University ID", done: isApproved },
                                { label: "Enrollment", done: isApproved },
                                { label: "Identity", done: isApproved },
                                { label: "Email", done: true },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className={item.done ? "text-teal-500" : "text-gray-300"} />
                                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
