"use client";

import React from "react";
import { User, Book, Globe, Target, Briefcase } from "lucide-react";

export default function StudentProfileDetails() {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                    <User size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">Fahim Rahman</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900">fahim.rahman@example.com</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-sm font-medium text-gray-900">+880 1711 223344</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-900">14 August, 2000</p>
                    </div>
                </div>
            </div>

            {/* Academic Background */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                    <Book size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Academic Background</h2>
                </div>
                <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-teal-100">
                        <span className="absolute -left-[9px] top-0.5 w-4 h-4 bg-teal-500 rounded-full border-4 border-white"></span>
                        <h3 className="text-sm font-bold text-gray-900">BSc in Computer Science and Engineering</h3>
                        <p className="text-xs text-gray-500 font-semibold mt-1">BRAC University • 2019 - 2023</p>
                        <p className="text-sm text-gray-700 mt-2">CGPA: 3.84 / 4.00</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-gray-100">
                        <span className="absolute -left-[9px] top-0.5 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></span>
                        <h3 className="text-sm font-bold text-gray-900">Higher Secondary Certificate (HSC)</h3>
                        <p className="text-xs text-gray-500 font-semibold mt-1">Dhaka City College • 2017 - 2019</p>
                        <p className="text-sm text-gray-700 mt-2">GPA: 5.00 / 5.00</p>
                    </div>
                </div>
            </div>

            {/* Study Abroad Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                        <Target size={20} className="text-teal-600" />
                        <h2 className="text-lg font-bold text-gray-900">Study Goals</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Degree</p>
                            <span className="inline-block bg-teal-50 text-teal-700 font-semibold text-xs px-3 py-1 rounded-md">Masters (MSc)</span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Preferred Intake</p>
                            <p className="text-sm font-medium text-gray-900">Winter 2026</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Target Countries</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="bg-gray-100 text-gray-700 font-semibold text-xs px-2.5 py-1 rounded-md">Germany</span>
                                <span className="bg-gray-100 text-gray-700 font-semibold text-xs px-2.5 py-1 rounded-md">USA</span>
                                <span className="bg-gray-100 text-gray-700 font-semibold text-xs px-2.5 py-1 rounded-md">Canada</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
                        <Globe size={20} className="text-teal-600" />
                        <h2 className="text-lg font-bold text-gray-900">Language & Tests</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">IELTS Score</p>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <span className="text-sm font-bold text-gray-900">Overall: 7.5</span>
                                <span className="text-xs font-semibold text-teal-600">L: 8.0, R: 7.5, W: 6.5, S: 7.0</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">German Proficiency</p>
                            <p className="text-sm font-medium text-gray-900">A1 (Goethe-Zertifikat)</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">GRE/GMAT</p>
                            <p className="text-sm font-medium text-gray-500 italic">Not taken yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
