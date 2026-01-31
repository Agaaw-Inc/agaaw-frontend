"use client";

import Link from "next/link";
import { Calendar, Building2 } from "lucide-react";

// Mock Data
const SCHOLARSHIPS = [
    {
        id: 1,
        title: "Global Excellence Scholarship",
        provider: "University of Oxford",
        deadline: "Dec 31, 2025",
        slug: "global-excellence-oxford",
    },
    {
        id: 2,
        title: "DAAD Master Studies for All",
        provider: "DAAD Germany",
        deadline: "Jan 15, 2026",
        slug: "daad-master-studies",
    },
    {
        id: 3,
        title: "Chevening Scholarship 2026",
        provider: "UK Government",
        deadline: "Nov 02, 2025",
        slug: "chevening-2026",
    },
];

export default function ScholarshipsPreviewSection() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Trending <span className="text-teal-600">Scholarships</span>
                </h2>
                <Link
                    href="/scholarships"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SCHOLARSHIPS.map((sch) => (
                    <div
                        key={sch.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50/50"
                    >
                        <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem]">
                            {sch.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{sch.provider}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-sm text-red-500 font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {sch.deadline}</span>
                        </div>

                        <Link
                            href={`/scholarships/${sch.slug}`}
                            className="mt-4 block w-full py-2 text-center text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
