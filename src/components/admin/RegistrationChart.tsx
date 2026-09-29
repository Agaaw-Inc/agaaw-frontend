"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RegistrationBucket } from "@/lib/adminApi";
import ChartCard from "./analytics/ChartCard";
import ChartTooltip from "./analytics/ChartTooltip";
import { CHROME, SERIES, bucketLabel, bucketLabelLong, count } from "./analytics/chartTheme";

interface Props {
    data: RegistrationBucket[];
    unit: "day" | "month";
    loading: boolean;
    refreshing: boolean;
    rangeText: string;
}

const LINES = [
    { key: "students", label: "Students", color: SERIES.blue },
    { key: "mentors", label: "Mentors", color: SERIES.orange },
] as const;

/** New sign-ups per day/month, students and mentors as separate lines. */
export default function RegistrationChart({ data, unit, loading, refreshing, rangeText }: Props) {
    const empty = !loading && data.every((r) => !r.students && !r.mentors);

    return (
        <ChartCard
            title="New sign-ups"
            subtitle={`Students and mentors who registered · ${rangeText}`}
            legend={LINES.map((l) => ({ label: l.label, color: l.color }))}
            rows={data}
            columns={[
                { header: unit === "day" ? "Day" : "Month", cell: (r) => bucketLabelLong(r.bucket, unit) },
                { header: "Students", cell: (r) => count(r.students), align: "right" },
                { header: "Mentors", cell: (r) => count(r.mentors), align: "right" },
            ]}
            loading={loading}
            refreshing={refreshing}
            empty={empty}
            emptyText="No new sign-ups in this period."
        >
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} stroke={CHROME.grid} />
                    <XAxis
                        dataKey="bucket"
                        tickFormatter={(b) => bucketLabel(b, unit)}
                        tick={{ fill: CHROME.axisText, fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: CHROME.grid }}
                        minTickGap={24}
                    />
                    <YAxis
                        tick={{ fill: CHROME.axisText, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ stroke: CHROME.axisText, strokeWidth: 1 }}
                        content={(p) => (
                            <ChartTooltip
                                active={p.active}
                                label={p.label}
                                payload={p.payload}
                                formatLabel={(b) => bucketLabelLong(b, unit)}
                                formatValue={(v) => count(v)}
                            />
                        )}
                    />
                    {LINES.map((l) => (
                        <Line
                            key={l.key}
                            type="monotone"
                            dataKey={l.key}
                            name={l.label}
                            stroke={l.color}
                            strokeWidth={2}
                            dot={data.length <= 12 ? { r: 4, fill: l.color, stroke: "#fff", strokeWidth: 2 } : false}
                            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
