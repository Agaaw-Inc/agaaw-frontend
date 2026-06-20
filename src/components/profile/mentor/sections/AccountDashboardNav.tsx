"use client";

import React from "react";
import Link from "next/link";
import { User, BookOpen, FileText, MessageSquare, Trophy, LogOut } from "lucide-react";

export default function AccountDashboardNav() {
    const navItems = [
        { icon: User, label: "Personal Info", href: "/dashboard/mentor/profile", active: true },
        { icon: BookOpen, label: "Academic Info", href: "/dashboard/mentor/profile#academic", active: false },
        { icon: FileText, label: "Documents", href: "/dashboard/mentor/profile#documents", active: false },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/mentor/profile#messages", active: false, badge: 3 },
        { icon: Trophy, label: "Achievements", href: "/dashboard/mentor/profile#achievements", active: false },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Account Dashboard</h3>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                            item.active 
                                ? "bg-teal-50 text-teal-700 border-l-[3px] border-teal-500" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            {item.label}
                        </div>
                        {item.badge && (
                            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}

                {/* Sign Out */}
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors mt-2">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </nav>
        </div>
    );
}
