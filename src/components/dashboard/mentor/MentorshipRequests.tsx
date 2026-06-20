"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, User, MessageSquare, MapPin, GraduationCap, Clock } from "lucide-react";

export default function MentorshipRequests() {
    const requests = [
        {
            id: "1",
            studentName: "Ayesha Rahman",
            image: "https://i.pravatar.cc/150?img=1",
            targetCountry: "Germany",
            targetUniversity: "TU Munich",
            degreeLevel: "Masters",
            messagePreview: "Hi Omar, I need help reviewing my SOP for the upcoming winter semester intake. I have a draft ready.",
            status: "Pending"
        },
        {
            id: "2",
            studentName: "John Smith",
            image: "https://i.pravatar.cc/150?img=12",
            targetCountry: "USA",
            targetUniversity: "Stanford University",
            degreeLevel: "Undergraduate",
            messagePreview: "I would like to schedule a 30-min consultation to discuss the application process and scholarship options.",
            status: "Pending"
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mentorship Requests</h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {requests.length} New
                </span>
            </div>

            <div className="space-y-4">
                {requests.map(request => (
                    <div key={request.id} className="border border-gray-100 rounded-xl p-5 hover:border-teal-200 transition-colors group">
                        <div className="flex flex-col md:flex-row gap-5 items-start">
                            {/* Avatar & Info */}
                            <div className="flex items-center gap-4 min-w-[250px]">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100">
                                    <Image src={request.image} alt={request.studentName} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{request.studentName}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Clock size={10} /> {request.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 w-full flex flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                        <span className="font-semibold text-gray-800 line-clamp-1">{request.targetCountry}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <GraduationCap size={14} className="text-gray-400 shrink-0" />
                                        <span className="font-semibold text-gray-800 line-clamp-1">{request.targetUniversity}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-100 whitespace-nowrap">
                                            {request.degreeLevel}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">
                                        "{request.messagePreview}"
                                    </p>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:justify-start">
                                <button className="flex-1 flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    <CheckCircle2 size={16} /> Accept
                                </button>
                                <div className="flex gap-2 w-full">
                                    <button className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                        <User size={16} /> Profile
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
                                        <MessageSquare size={16} /> Msg
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 text-center">
                <button className="text-sm font-semibold text-gray-500 hover:text-teal-600">
                    View all requests
                </button>
            </div>
        </div>
    );
}
