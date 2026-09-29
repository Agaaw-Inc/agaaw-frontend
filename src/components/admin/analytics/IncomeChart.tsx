"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OrderAnalytics } from "@/lib/adminApi";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import { CHROME, SERIES, bucketLabel, bucketLabelLong, taka, takaShort } from "./chartTheme";

interface Props {
    data: OrderAnalytics | null;
    loading: boolean;
    refreshing: boolean;
    rangeText: string;
}

/**
 * Agaaw's income over time — one series, so no legend: the title names it.
 * "Received" (money in) is deliberately NOT drawn on the same axis: it's ~10×
 * larger and would flatten the income line. It lives in the stat tiles and
 * the table view instead.
 */
export default function IncomeChart({ data, loading, refreshing, rangeText }: Props) {
    const unit = data?.unit ?? "day";
    const rows = (data?.series ?? []).map((r) => ({
        bucket: r.bucket,
        income: Number(r.income),
        received: Number(r.received),
    }));
    const empty = !loading && rows.every((r) => r.income === 0 && r.received === 0);

    return (
        <ChartCard
            title="Agaaw income"
            subtitle={`Platform fee earned on completed orders · ${rangeText}`}
            rows={rows}
            columns={[
                { header: unit === "day" ? "Day" : "Month", cell: (r) => bucketLabelLong(r.bucket, unit) },
                { header: "Agaaw income", cell: (r) => taka(r.income), align: "right" },
                { header: "Payments received", cell: (r) => taka(r.received), align: "right" },
            ]}
            loading={loading}
            refreshing={refreshing}
            empty={empty}
            emptyText="No payments or completed orders in this period yet."
        >
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={SERIES.blue} stopOpacity={0.18} />
                            <stop offset="100%" stopColor={SERIES.blue} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
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
                        tickFormatter={takaShort}
                        tick={{ fill: CHROME.axisText, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={52}
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
                                formatValue={(v) => taka(v)}
                            />
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="income"
                        name="Agaaw income"
                        stroke={SERIES.blue}
                        strokeWidth={2}
                        fill="url(#incomeFill)"
                        // Mark only the buckets that earned something, so a
                        // lone day of income isn't lost against the axis.
                        dot={(props: { cx?: number; cy?: number; payload?: { income: number }; index?: number }) =>
                            props.payload?.income ? (
                                <circle key={props.index} cx={props.cx} cy={props.cy} r={4} fill={SERIES.blue} stroke="#fff" strokeWidth={2} />
                            ) : (
                                <g key={props.index} />
                            )
                        }
                        activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
