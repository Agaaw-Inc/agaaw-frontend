"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OrderAnalytics } from "@/lib/adminApi";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import { CHROME, SERIES, bucketLabel, bucketLabelLong, count, taka } from "./chartTheme";

interface Props {
    data: OrderAnalytics | null;
    loading: boolean;
    refreshing: boolean;
    rangeText: string;
}

// Fixed identity → color, so a series keeps its color whatever the range.
const BARS = [
    { key: "orders", label: "Orders placed", color: SERIES.blue },
    { key: "delivered", label: "Delivered", color: SERIES.aqua },
    { key: "refunded", label: "Refunded", color: SERIES.orange },
] as const;

/** Three counts in the same unit on one axis — grouped bars per day/month. */
export default function OrdersActivityChart({ data, loading, refreshing, rangeText }: Props) {
    const unit = data?.unit ?? "day";
    const rows = data?.series ?? [];
    const empty = !loading && rows.every((r) => !r.orders && !r.delivered && !r.refunded);

    return (
        <ChartCard
            title="Orders, deliveries & refunds"
            subtitle={`Counted on the day each happened · ${rangeText}`}
            legend={BARS.map((b) => ({ label: b.label, color: b.color }))}
            rows={rows}
            columns={[
                { header: unit === "day" ? "Day" : "Month", cell: (r) => bucketLabelLong(r.bucket, unit) },
                { header: "Orders", cell: (r) => count(r.orders), align: "right" },
                { header: "Delivered", cell: (r) => count(r.delivered), align: "right" },
                { header: "Refunded", cell: (r) => count(r.refunded), align: "right" },
                { header: "Refund amount", cell: (r) => taka(r.refundedAmount), align: "right" },
            ]}
            loading={loading}
            refreshing={refreshing}
            empty={empty}
            emptyText="No orders in this period yet."
        >
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap="20%">
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
                        cursor={{ fill: "rgba(107,114,128,0.08)" }}
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
                    {BARS.map((b) => (
                        <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={[4, 4, 0, 0]} maxBarSize={14} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}
