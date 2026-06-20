import Link from "next/link"
import { BookOpen, CalendarCheck, PenSquare, Users } from "lucide-react";

export default function MentorQuickActions() {
    const actions = [
        { label: "Write Blog", href: "/dashboard/mentor/blogs/create", icon: PenSquare, color: "bg-teal-600" },
        { label: "My Blogs", href: "/dashboard/mentor/blogs", icon: BookOpen, color: "bg-violet-600" },
        { label: "View Students", href: "#", icon: Users, color: "bg-blue-600" },
        { label: "Schedule", href: "#", icon: CalendarCheck, color: "bg-amber-600" },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((a) => (
                    <Link
                        key={a.label}
                        href={a.href}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-md transition-all hover:-translate-y-0.5 group"
                    >
                        <div className={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center`}>
                            <a.icon size={18} className="text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors text-center">{a.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}