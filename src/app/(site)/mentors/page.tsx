"use client";

import React from "react";
import Image from "next/image";
import DashboardHeader from "@/components/dashboard/common/DashboardHeader";
import { Search, Filter, MessageSquare } from "lucide-react";

// Extended Mock Data
const ALL_MENTORS = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    name: `Mentor ${i + 1}`,
    role: i % 3 === 0 ? "Software Engineer" : i % 3 === 1 ? "Data Scientist" : "Product Manager",
    company: ["Google", "Microsoft", "Amazon", "Meta", "Netflix"][i % 5],
    university: ["Harvard University", "MIT", "Stanford", "Oxford", "Cambridge"][i % 5],
    image: `https://i.pravatar.cc/150?u=${i + 10}`,
    expertise: ["Career Guidance", "Resume Review", "Mock Interview"],
}));

export default function MentorsPage() {
    return (
        <div className="space-y-8">
            <DashboardHeader
                title="Find Your Mentor"
                subtitle="Connect with experienced professionals to guide your journey."
            />

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, company, or role..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ALL_MENTORS.map((mentor) => (
                    <div
                        key={mentor.id}
                        className="group bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all hover:border-teal-100"
                    >
                        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden ring-4 ring-gray-50 group-hover:ring-teal-50 transition-all">
                            <Image
                                src={mentor.image}
                                alt={mentor.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-teal-600 font-medium text-sm mb-1">{mentor.role}</p>
                        <p className="text-gray-500 text-sm mb-4">at {mentor.company}</p>

                        <div className="w-full border-t border-gray-100 my-4"></div>

                        <div className="text-xs text-gray-500 mb-6 space-y-1">
                            <p>🎓 {mentor.university}</p>
                        </div>

                        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-teal-50 text-teal-700 font-semibold rounded-lg hover:bg-teal-100 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
