
/* ─── Recent Messages ────────────────────────────────────────────── */
const MESSAGES = [
    { name: "Sarah Johnson", message: "Inquiry about UK universities", time: "2h ago", isNew: true },
    { name: "Ahmed Hassan", message: "Scholarship guidance needed", time: "5h ago", isNew: false },
    { name: "Maria Garcia", message: "CV review request", time: "1d ago", isNew: true },
];

export default function MentorRecentMessages() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {MESSAGES.filter(m => m.isNew).length} new
                </span>
            </div>
            <div className="space-y-3">
                {MESSAGES.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {m.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                                <span className="text-xs text-gray-400 shrink-0">{m.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{m.message}</p>
                        </div>
                        {m.isNew && <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-1.5" />}
                    </div>
                ))}
            </div>
        </div>
    );
}