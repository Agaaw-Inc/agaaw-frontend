"use client";
import Link from "next/link";
import { GraduationCap, MapPin, Target, Award } from "lucide-react";
import { resolveFileUrl } from "@/lib/api";

export interface StudentListItem {
    id: string;
    name: string;
    image: string | null;
    university: string;
    country: string;
    goals: {
        targetDegree: string;
        targetCountries: string[];
        timeline: string;
    };
    interests: string[];
}
interface StudentCardProps {
    student: StudentListItem;
    isMatch?: boolean;
    matchingCountry?: string;
}
export default function StudentCard({ student, isMatch, matchingCountry }: StudentCardProps) {
    const {
        id,
        name,
        image,
        university,
        country,
        goals,
        interests,
    } = student;
    const initials = name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 bg-white flex flex-col h-full group relative">

            {/* Top Banner & Match Indicator */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {isMatch && (
                    <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                        Targeting {matchingCountry || "Your Country"}
                    </span>
                )}
            </div>
            {/* Student Info Header */}
            <div className="relative pt-14 px-6 pb-4 border-b border-slate-50 flex items-start gap-4">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-slate-100 flex-shrink-0 group-hover:border-teal-500/40 transition-colors bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xl">
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={resolveFileUrl(image)}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        initials || "?"
                    )}
                </div>
                {/* Name and Title */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                        {name}
                    </h3>

                    <p className="text-md font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                        Student
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-md mt-1.5">
                        <GraduationCap className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{university}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-md mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                        <span className="truncate">
                            From {country}
                        </span>
                    </div>
                </div>
            </div>
            {/* Bio & Academic Goals */}
            <div className="p-6 flex flex-col flex-1">
                {/* Academic Targets & Goals */}
                <div className="space-y-2 mb-4 text-md">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100/50">
                        <Target className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-slate-700">Target:</span>
                        <span className="truncate">{goals.targetDegree} &bull; {goals.timeline}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100/50">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-700">Countries:</span>
                            <span className="text-slate-600 truncate mt-0.5 font-normal">
                                {goals.targetCountries.join(", ")}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Interests Tags */}
                <div className="mb-6">
                    <p className="text-[15px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                        Interests
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 3).map((interest) => (
                            <span
                                key={interest}
                                className="text-[12px] font-medium text-slate-600 bg-slate-550 border border-slate-150 rounded-md px-2 py-0.5"
                            >
                                {interest}
                            </span>
                        ))}
                        {interests.length > 3 && (
                            <span className="text-[15px] font-semibold text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-md px-1.5 py-0.5">
                                +{interests.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
                {/* Action Button */}
                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                    <Link
                        href={`/profile/student/${id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-md px-6 py-3 transition-colors shadow-sm shadow-teal-600/10 group-hover:scale-[1.02] active:scale-[0.98] duration-150"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}