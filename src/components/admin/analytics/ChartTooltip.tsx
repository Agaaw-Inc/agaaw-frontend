interface TooltipEntry {
    dataKey?: string | number;
    name?: string | number;
    value?: number | string;
    color?: string;
}

interface ChartTooltipProps {
    active?: boolean;
    label?: string | number;
    payload?: readonly TooltipEntry[];
    /** Formats the x value (the bucket) into the tooltip heading. */
    formatLabel: (label: string) => string;
    formatValue: (value: number, dataKey: string) => string;
}

/**
 * The hover card for every dashboard chart. Values are in text ink; the small
 * swatch beside each one carries the series identity.
 */
export default function ChartTooltip({ active, label, payload, formatLabel, formatValue }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-100 text-xs min-w-[140px]">
            <p className="font-semibold text-gray-900 mb-1">{formatLabel(String(label))}</p>
            <ul className="space-y-0.5">
                {payload.map((entry) => (
                    <li key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-sm" style={{ background: entry.color }} aria-hidden />
                            {entry.name}
                        </span>
                        <span className="font-semibold text-gray-900 tabular-nums">
                            {formatValue(Number(entry.value) || 0, String(entry.dataKey))}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
