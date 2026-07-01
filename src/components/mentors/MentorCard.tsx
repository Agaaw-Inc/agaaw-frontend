"use client";
import Link from "next/link";
import { Star, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import type { MentorProfile } from "@/data/profileTypes";
interface MentorCardProps {
    mentor: MentorProfile;
    isMatch?: boolean;
}
export default function MentorCard({ mentor, isMatch }: MentorCardProps) {
    const {
        name,
        username,
        image,
        university,
        country,
        countryFlag,
        bio,
        expertise,
        stats,
        hourly_rate,
        isVerified,
        availability,
    } = mentor;
    const availabilityColors = {
        Available: "bg-emerald-500",
        Busy: "bg-amber-500",
        Away: "bg-gray-400",
    }[availability] || "bg-emerald-500";
    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 bg-white flex flex-col h-full group relative">

            {/* Top Banner & Match Indicator */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {isMatch && (
                    <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                        Matches Interests
                    </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider border border-slate-100 shadow-sm backdrop-blur-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${availabilityColors}`} />
                    {availability}
                </span>
            </div>
            {/* Mentor Info Header */}
            <div className="relative pt-14 px-6 pb-4 border-b border-slate-50 flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 group-hover:border-teal-500/40 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image || "https://i.pravatar.cc/300?u=placeholder"}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Name and Title */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                            {name}
                        </h3>
                        {isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-50 flex-shrink-0" />
                        )}
                    </div>

                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mt-0.5">
                        Mentor
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
                        <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{university}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">
                            {country} {countryFlag}
                        </span>
                    </div>
                </div>
            </div>
            {/* Bio & Details */}
            <div className="p-6 flex flex-col flex-1">
                {/* Bio Excerpt */}
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    &ldquo;{bio}&rdquo;
                </p>
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {expertise.slice(0, 3).map((exp) => (
                        <span
                            key={exp}
                            className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1"
                        >
                            {exp}
                        </span>
                    ))}
                    {expertise.length > 3 && (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-lg px-2 py-0.5">
                            +{expertise.length - 3} more
                        </span>
                    )}
                </div>
                {/* Divider & Stats Grid */}
                <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-3 gap-2 text-center pb-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                Rating
                            </p>
                            <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-0.5 mt-0.5">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                {stats.rating.toFixed(1)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                Helped
                            </p>
                            <p className="text-sm font-bold text-slate-700 mt-0.5">
                                {stats.studentsHelped}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                Response
                            </p>
                            <p className="text-sm font-bold text-slate-700 mt-0.5">
                                {stats.responseRate}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div>
                            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                                Session Fee
                            </span>
                            <span className="text-base font-extrabold text-slate-800">
                                ${hourly_rate}
                                <span className="text-xs font-normal text-slate-500">/hr</span>
                            </span>
                        </div>
                        <Link
                            href={`/profile/${username}`}
                            className="inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2.5 transition-colors shadow-sm shadow-teal-600/10 group-hover:scale-[1.02] active:scale-[0.98] duration-150"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
