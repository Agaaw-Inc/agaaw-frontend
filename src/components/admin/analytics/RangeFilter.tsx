"use client";

import type { StatsRange } from "@/lib/adminApi";

const OPTIONS: { value: StatsRange; label: string; short: string }[] = [
    { value: "7d", label: "Last 7 days", short: "7D" },
    { value: "30d", label: "Last 30 days", short: "30D" },
    { value: "12m", label: "Last 12 months", short: "12M" },
    { value: "all", label: "All time", short: "All" },
];

export function rangeLabel(range: StatsRange): string {
    return OPTIONS.find((o) => o.value === range)!.label;
}

/** One filter for the whole dashboard — every chart re-renders against the same window. */
export default function RangeFilter({ value, onChange }: { value: StatsRange; onChange: (r: StatsRange) => void }) {
    return (
        <div role="radiogroup" aria-label="Time range" className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {OPTIONS.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        role="radio"
                        aria-checked={active}
                        aria-label={o.label}
                        onClick={() => onChange(o.value)}
                        className={`px-3 sm:px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            active ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <span className="sm:hidden">{o.short}</span>
                        <span className="hidden sm:inline">{o.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
