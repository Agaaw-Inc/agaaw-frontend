const PERFORMANCE = [
    { label: "Response Rate", value: 95, color: "from-teal-500 to-emerald-500" },
    { label: "Satisfaction", value: 98, color: "from-violet-500 to-purple-500" },
    { label: "Booking Rate", value: 88, color: "from-blue-500 to-indigo-500" },
];

export default function MentorPerformance() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-4">
                {PERFORMANCE.map((m) => (
                    <div key={m.label}>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm text-gray-600">{m.label}</span>
                            <span className="text-sm font-bold text-gray-900">{m.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-linear-to-r ${m.color}`}
                                style={{ width: `${m.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}