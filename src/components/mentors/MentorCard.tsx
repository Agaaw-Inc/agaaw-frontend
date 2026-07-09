"use client";
import Link from "next/link";
import { MapPin, GraduationCap, CheckCircle2, Briefcase, Languages } from "lucide-react";

export interface MentorListItem {
    id: string;
    name: string;
    image: string | null;
    isVerified: boolean;
    bio: string | null;
    university: string;
    country: string;
    experienceYears: number | null;
    hourlyRate: number | null;
    languages: string[];
    isAvailable: boolean;
    isApproved: boolean;
    expertise: string[];
}

interface MentorCardProps {
    mentor: MentorListItem;
    isMatch?: boolean;
}
export default function MentorCard({ mentor, isMatch }: MentorCardProps) {
    const {
        id,
        name,
        image,
        university,
        country,
        bio,
        expertise,
        hourlyRate,
        experienceYears,
        languages,
        isVerified,
        isAvailable,
    } = mentor;
    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 bg-white flex flex-col h-full group relative">

            {/* Top Banner & Match Indicator */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {isMatch && (
                    <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[15px] font-bold text-emerald-600 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                        Matches Interests
                    </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[15px] font-bold text-slate-700 uppercase tracking-wider border border-slate-100 shadow-sm backdrop-blur-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {isAvailable ? "Available" : "Busy"}
                </span>
            </div>
            {/* Mentor Info Header */}
            <div className="relative pt-14 px-6 pb-4 border-b border-slate-50 flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 group-hover:border-teal-500/40 transition-colors">
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
                        <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                            {name}
                        </h3>
                        {isVerified && (
                            <CheckCircle2 className="w-6 h-6 text-teal-600 fill-teal-50 flex-shrink-0" />
                        )}
                    </div>

                    <p className="text-md font-semibold text-teal-600 uppercase tracking-wide mt-0.5">
                        Mentor
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-md mt-1.5">
                        <GraduationCap className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{university}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-md mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{country}</span>
                    </div>
                </div>
            </div>
            {/* Bio & Details */}
            <div className="p-6 flex flex-col flex-1">
                {bio && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{bio}</p>
                )}

                {expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {expertise.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[12px] font-medium text-slate-600 bg-slate-100 border border-slate-150 rounded-md px-2 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                        {expertise.length > 3 && (
                            <span className="text-[12px] font-semibold text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-md px-1.5 py-0.5">
                                +{expertise.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Divider & Stats Grid */}
                <div className="mt-auto border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-2 gap-2 pb-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-md font-semibold truncate">
                                {experienceYears ? `${experienceYears} yrs exp.` : "Experience N/A"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <Languages className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-md font-semibold truncate">
                                {languages.length > 0 ? languages.join(", ") : "N/A"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div>
                            <span className="text-[15px] text-slate-400 block font-medium uppercase tracking-wider">
                                Session Fee
                            </span>
                            <span className="text-base font-extrabold text-slate-800">
                                {hourlyRate ? `$${hourlyRate}` : "Not set"}
                                {hourlyRate ? <span className="text-md font-normal text-slate-500">/hr</span> : null}
                            </span>
                        </div>
                        <Link
                            href={`/profile/mentor/${id}`}
                            className="inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-md px-6 py-3 transition-colors shadow-sm shadow-teal-600/10 group-hover:scale-[1.02] active:scale-[0.98] duration-150"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
