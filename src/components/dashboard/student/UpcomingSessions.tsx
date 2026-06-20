"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Video, Calendar } from "lucide-react";

export default function UpcomingSessions() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming sessions</h2>

            <div className="space-y-4">
                {/* Session 1 */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                            <Image
                                src="https://i.pravatar.cc/150?img=5"
                                alt="Nadia Islam"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Nadia Islam</p>
                            <p className="text-xs text-gray-500 font-medium">Today, 4:00 PM</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Video size={18} />
                    </div>
                </div>

                {/* Session 2 */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                            <Image
                                src="https://i.pravatar.cc/150?img=11"
                                alt="Arif Rahman"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Arif Rahman</p>
                            <p className="text-xs text-gray-500 font-medium">Tomorrow, 10:00 AM</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                        <Calendar size={18} />
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link href="/dashboard/student/sessions" className="text-sm font-semibold text-gray-500 hover:text-teal-600">
                    View all sessions
                </Link>
            </div>
        </div>
    );
}
