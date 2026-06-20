import { MapPin, PenSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function MentorHeroBanner() {
    return (
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-teal-700 via-teal-600 to-emerald-500 p-8 text-white shadow-xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        AR
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                        <Sparkles size={10} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">Arif Rahman</h1>
                        <span className="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-medium">Verified</span>
                    </div>
                    <p className="text-teal-100 font-medium mb-1">Scholarship Consultant · Study Abroad Expert</p>
                    <div className="flex items-center gap-1.5 text-teal-200 text-sm">
                        <MapPin size={13} />
                        <span>Dhaka, Bangladesh</span>
                    </div>

                    {/* Inline stats */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {[
                            { label: "Students", value: "47" },
                            { label: "Rating", value: "4.9 ★" },
                            { label: "Sessions", value: "128" },
                            { label: "Blogs", value: "3" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-lg font-bold">{s.value}</p>
                                <p className="text-xs text-teal-200">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2 shrink-0">
                    <Link
                        href="/dashboard/mentor/blogs/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm"
                    >
                        <PenSquare size={15} />
                        Write Blog
                    </Link>
                    <Link
                        href="/dashboard/mentor/profile"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}