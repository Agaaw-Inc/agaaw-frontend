import { CheckCircle2, Circle } from "lucide-react";

const CHECKLIST = [
    { label: "Profile Photo", done: true },
    { label: "Bio & Expertise", done: false },
    { label: "Education & Credentials", done: false },
    { label: "Service Offerings", done: true },
    { label: "Availability Schedule", done: true },
];
const progress = Math.round((CHECKLIST.filter(c => c.done).length / CHECKLIST.length) * 100);

export default function MentorProfileCompletion() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">Profile Completion</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Complete your profile to attract more students</p>
                </div>
                <span className="text-2xl font-bold text-teal-700">{progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div
                    className="h-full bg-linear-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-3">
                {CHECKLIST.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        {item.done ? (
                            <CheckCircle2 size={18} className="text-teal-600 shrink-0" />
                        ) : (
                            <Circle size={18} className="text-gray-300 shrink-0" />
                        )}
                        <span className={`text-sm ${item.done ? "text-gray-700" : "text-gray-400"}`}>
                            {item.label}
                        </span>
                        {!item.done && (
                            <span className="ml-auto text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full">
                                Complete
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
