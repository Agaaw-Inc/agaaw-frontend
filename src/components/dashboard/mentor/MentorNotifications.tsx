"use client";

import React from "react";
import { Bell, Inbox, Star, DollarSign, BookOpen } from "lucide-react";

export default function MentorNotifications() {
    const notifications = [
        {
            id: "1",
            icon: Inbox,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
            title: "New Mentorship Request",
            time: "10 min ago",
            desc: "Ayesha Rahman sent you a new mentorship request for TU Munich."
        },
        {
            id: "2",
            icon: Star,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-100",
            title: "Student Left Review",
            time: "2 hours ago",
            desc: "Sarah M. left a 5-star review on your profile."
        },
        {
            id: "3",
            icon: DollarSign,
            iconColor: "text-green-600",
            iconBg: "bg-green-100",
            title: "Payment Received",
            time: "1 day ago",
            desc: "You received a payment of $120.00 for your recent session."
        },
        {
            id: "4",
            icon: BookOpen,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-100",
            title: "Blog Reached 1,000 Views",
            time: "2 days ago",
            desc: "Congratulations! Your blog 'SOP Tips for Germany' reached 1K views."
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Bell size={20} className="text-gray-800" />
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                </div>
                <button className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {notifications.map(notif => (
                    <div key={notif.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg} ${notif.iconColor}`}>
                            <notif.icon size={18} />
                        </div>
                        <div>
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                                <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <button className="text-sm font-semibold text-gray-500 hover:text-teal-600">
                    View all notifications
                </button>
            </div>
        </div>
    );
}
