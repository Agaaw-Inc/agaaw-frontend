"use client";
import Link from "next/link";
import { GraduationCap, MapPin, Target, Award } from "lucide-react";
import type { StudentProfile } from "@/data/profileTypes";
interface StudentCardProps {
    student: StudentProfile;
    isMatch?: boolean;
    matchingCountry?: string;
}
export default function StudentCard({ student, isMatch, matchingCountry }: StudentCardProps) {
    const {
        name,
        username,
        image,
        university,
        country,
        countryFlag,
        bio,
        testScores,
        goals,
        interests,
    } = student;
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
                    <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                        {name}
                    </h3>

                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                        Student
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
                        <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{university}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">
                            From {country} {countryFlag}
                        </span>
                    </div>
                </div>
            </div>
            {/* Bio & Academic Goals */}
            <div className="p-6 flex flex-col flex-1">
                {/* Bio Excerpt */}
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    &ldquo;{bio}&rdquo;
                </p>
                {/* Academic Targets & Goals */}
                <div className="space-y-2 mb-4 text-xs">
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
                {/* Test Scores */}
                {testScores && testScores.length > 0 && (
                    <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                            Test Scores
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {testScores.map((score) => (
                                <span
                                    key={score.name}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-100/40 rounded-md px-2 py-0.5"
                                >
                                    <Award className="w-3 h-3 text-teal-600" />
                                    {score.name}: {score.score}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {/* Interests Tags */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                        Interests
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 3).map((interest) => (
                            <span
                                key={interest}
                                className="text-[10px] font-medium text-slate-600 bg-slate-550 border border-slate-150 rounded-md px-2 py-0.5"
                            >
                                {interest}
                            </span>
                        ))}
                        {interests.length > 3 && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-md px-1.5 py-0.5">
                                +{interests.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
                {/* Action Button */}
                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Applications
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                            {student.stats?.applicationsSubmitted || 0} submitted
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
    );
}