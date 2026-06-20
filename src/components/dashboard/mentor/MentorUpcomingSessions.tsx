"use client";

import React from "react";
import { Video, Calendar as CalendarIcon, Clock, MoreHorizontal } from "lucide-react";

export default function MentorUpcomingSessions() {
    const sessions = [
        {
            id: "1",
            studentName: "Fahim Rahman",
            date: "Oct 12",
            time: "10:00 AM - 11:00 AM",
            topic: "SOP Review & Feedback",
            isToday: true
        },
        {
            id: "2",
            studentName: "Sadia Islam",
            date: "Oct 15",
            time: "3:00 PM - 4:00 PM",
            topic: "University Shortlisting",
            isToday: false
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {sessions.map(session => (
                    <div key={session.id} className={`flex gap-4 p-4 rounded-xl border ${session.isToday ? 'border-teal-200 bg-teal-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
                        {/* Calendar Icon Date */}
                        <div className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg ${session.isToday ? 'bg-teal-100 text-teal-700' : 'bg-white border border-gray-200 text-gray-700'} shrink-0`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{session.date.split(' ')[0]}</span>
                            <span className="text-xl font-black leading-none mt-0.5">{session.date.split(' ')[1]}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-base truncate">{session.studentName}</h4>
                            <p className="text-xs text-gray-500 font-semibold truncate mb-2">{session.topic}</p>
                            
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                <Clock size={12} />
                                <span>{session.time}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${session.isToday ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-800 hover:bg-gray-900 text-white'}`}>
                                    <Video size={14} /> Join Meeting
                                </button>
                                <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                                    <CalendarIcon size={14} /> Reschedule
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <button className="text-sm font-semibold text-gray-500 hover:text-teal-600">
                    View full calendar
                </button>
            </div>
        </div>
    );
}