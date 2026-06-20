"use client";

import React from "react";
import Image from "next/image";
import { MessageSquare, Calendar, Activity, MapPin, ChevronRight } from "lucide-react";

export default function ActiveStudents() {
    const students = [
        {
            id: "1",
            name: "Fahim Rahman",
            image: "https://i.pravatar.cc/150?img=33",
            countryGoal: "Germany",
            progress: 80,
            nextMeeting: "Oct 12, 10:00 AM"
        },
        {
            id: "2",
            name: "Sadia Islam",
            image: "https://i.pravatar.cc/150?img=5",
            countryGoal: "Germany",
            progress: 45,
            nextMeeting: "Oct 15, 3:00 PM"
        },
        {
            id: "3",
            name: "Rifat Hossain",
            image: "https://i.pravatar.cc/150?img=11",
            countryGoal: "Germany",
            progress: 15,
            nextMeeting: "Not scheduled"
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Students</h2>
                <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    View All <ChevronRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                    <div key={student.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                                <Image src={student.image} alt={student.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{student.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                    <MapPin size={12} className="text-gray-400" /> Goal: {student.countryGoal}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-semibold text-gray-600">Application Progress</span>
                                <span className="text-xs font-bold text-teal-600">{student.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="mb-5 flex-1 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Calendar size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Next Meeting</p>
                                <p className="text-xs font-semibold text-gray-800">{student.nextMeeting}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-auto">
                            <button className="flex flex-col items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors group">
                                <MessageSquare size={16} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="text-[10px] font-semibold">Chat</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors group">
                                <Activity size={16} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="text-[10px] font-semibold">Progress</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors group">
                                <Calendar size={16} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="text-[10px] font-semibold">Schedule</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
