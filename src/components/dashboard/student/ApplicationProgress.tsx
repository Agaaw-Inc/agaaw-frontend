"use client";

import React from "react";
import Link from "next/link";

export default function ApplicationProgress() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your application progress</h2>
                <Link href="/dashboard/student/applications" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                    Update status
                </Link>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-center">
                {/* Personal Statement */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-800">Personal statement</span>
                        <span className="text-sm font-semibold text-gray-600">80%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                </div>

                {/* Recommendation letters */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-800">Recommendation letters</span>
                        <span className="text-sm font-semibold text-gray-600">55%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: "55%" }}></div>
                    </div>
                </div>

                {/* University shortlist */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-800">University shortlist</span>
                        <span className="text-sm font-semibold text-gray-600">30%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
