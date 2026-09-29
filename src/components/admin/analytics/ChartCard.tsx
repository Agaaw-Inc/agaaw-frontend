"use client";

import { useState, type ReactNode } from "react";
import { BarChart3, Table2 } from "lucide-react";

export interface LegendItem {
    label: string;
    color: string;
}

export interface TableColumn<Row> {
    header: string;
    cell: (row: Row) => string;
    align?: "left" | "right";
}

interface ChartCardProps<Row> {
    title: string;
    subtitle?: string;
    /** Shown for 2+ series; a single series is named by the title. */
    legend?: LegendItem[];
    rows: Row[];
    columns: TableColumn<Row>[];
    /** First load — no data yet. */
    loading?: boolean;
    /** Refetching after a filter change — keep the old chart, dimmed. */
    refreshing?: boolean;
    empty?: boolean;
    emptyText?: string;
    children: ReactNode;
}

/**
 * Frame for every dashboard chart: title, legend, and a Chart/Table switch.
 * The table shows every value the chart draws, so nothing is readable only
 * by hovering or only by color.
 */
export default function ChartCard<Row>({
    title,
    subtitle,
    legend,
    rows,
    columns,
    loading,
    refreshing,
    empty,
    emptyText = "No activity in this period yet.",
    children,
}: ChartCardProps<Row>) {
    const [view, setView] = useState<"chart" | "table">("chart");

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                <div className="inline-flex bg-gray-100 rounded-lg p-0.5" role="tablist" aria-label={`${title} view`}>
                    {([
                        ["chart", "Chart", BarChart3],
                        ["table", "Table", Table2],
                    ] as const).map(([key, label, Icon]) => (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={view === key}
                            onClick={() => setView(key)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                view === key ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            <Icon size={13} /> {label}
                        </button>
                    ))}
                </div>
            </div>

            {view === "chart" && legend && legend.length > 1 && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                    {legend.map((item) => (
                        <li key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} aria-hidden />
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}

            {loading ? (
                <div className="h-[280px] rounded-xl bg-gray-50 animate-pulse" />
            ) : empty ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-gray-400 text-center px-6">{emptyText}</div>
            ) : view === "chart" ? (
                <div className={`transition-opacity ${refreshing ? "opacity-50" : ""}`}>{children}</div>
            ) : (
                <div className={`max-h-[280px] overflow-auto rounded-lg border border-gray-100 transition-opacity ${refreshing ? "opacity-50" : ""}`}>
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr>
                                {columns.map((c) => (
                                    <th
                                        key={c.header}
                                        scope="col"
                                        className={`px-3 py-2 text-xs font-semibold text-gray-500 whitespace-nowrap ${c.align === "right" ? "text-right" : "text-left"}`}
                                    >
                                        {c.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.map((row, i) => (
                                <tr key={i}>
                                    {columns.map((c) => (
                                        <td
                                            key={c.header}
                                            className={`px-3 py-1.5 whitespace-nowrap tabular-nums ${c.align === "right" ? "text-right text-gray-900" : "text-gray-600"}`}
                                        >
                                            {c.cell(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
