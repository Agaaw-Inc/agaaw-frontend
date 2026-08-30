"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Clock, CreditCard, Wallet, Loader2 } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";
import { getMentorEarningsOverview, type MentorEarningsOverview } from "@/lib/api";

const formatMoney = (amount: number, curr = "$") => {
    const formatted = Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${curr}${formatted}`;
};

export default function EarningsOverview() {
    const [earnings, setEarnings] = useState<MentorEarningsOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchEarnings = async () => {
            try {
                const data = await getMentorEarningsOverview();
                if (isMounted) {
                    setEarnings(data);
                }
            } catch (err) {
                console.error("Failed to load mentor earnings overview:", err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchEarnings();

        return () => {
            isMounted = false;
        };
    }, []);

    const currency = earnings?.currency || "$";

    const metrics = [
        {
            icon: DollarSign,
            label: "Total Earnings",
            value: earnings ? formatMoney(earnings.totalEarnings, currency) : "$0.00",
            iconClass: "bg-teal-100 text-teal-600",
        },
        {
            icon: Calendar,
            label: "This Month",
            value: earnings ? formatMoney(earnings.thisMonthEarnings, currency) : "$0.00",
            trend: earnings?.trendPercentage || null,
            trendDirection: earnings?.trendDirection || "neutral",
            iconClass: "bg-blue-100 text-blue-600",
        },
        {
            icon: Clock,
            label: "Pending Payments",
            value: earnings ? formatMoney(earnings.pendingPayments, currency) : "$0.00",
            iconClass: "bg-amber-100 text-amber-600",
        },
        {
            icon: CreditCard,
            label: "Completed Sessions",
            value: earnings ? String(earnings.completedSessions) : "0",
            iconClass: "bg-violet-100 text-violet-600",
        },
    ];

    const monthlyBreakdown = earnings?.monthlyBreakdown || [];
    const hasAnyEarnings = (earnings?.totalEarnings || 0) > 0;

    return (
        <SectionCard
            title="Earnings Overview"
            icon={Wallet}
            actions={
                <button
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!hasAnyEarnings}
                >
                    Withdraw Funds
                </button>
            }
        >
            {isLoading ? (
                <div className="space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 h-24 flex flex-col justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6 h-48 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {metrics.map(({ icon: Icon, label, value, trend, trendDirection, iconClass }) => (
                            <div key={label} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass}`}>
                                        <Icon size={16} />
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                                    {trend && (
                                        <span
                                            className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${
                                                trendDirection === "down"
                                                    ? "text-red-600 bg-red-50"
                                                    : trendDirection === "up"
                                                    ? "text-green-600 bg-green-50"
                                                    : "text-gray-600 bg-gray-100"
                                            }`}
                                        >
                                            {trendDirection === "down" ? (
                                                <TrendingDown size={12} className="mr-1" />
                                            ) : (
                                                <TrendingUp size={12} className="mr-1" />
                                            )}
                                            {trend}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revenue chart */}
                    <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6 h-52 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-teal-500" />
                                <p className="text-sm font-semibold text-gray-700">Revenue Growth Over Time</p>
                            </div>
                            <p className="text-xs text-gray-400">Last 6 months</p>
                        </div>

                        <div className="flex items-end gap-3 h-full pt-6 pb-2">
                            {monthlyBreakdown.map((item, i) => {
                                const heightPercent = item.barHeightPercent;
                                const isZero = item.amount === 0;

                                return (
                                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                                        {/* Hover Tooltip */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 bg-gray-900 text-white text-[10px] font-semibold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-sm">
                                            {item.fullMonth}: {formatMoney(item.amount, currency)}
                                        </div>

                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className={`w-full max-w-[48px] rounded-t-md transition-all duration-500 ${
                                                    isZero
                                                        ? "h-1.5 bg-gray-200"
                                                        : "bg-gradient-to-t from-teal-600 to-emerald-400"
                                                }`}
                                                style={{ height: isZero ? "6px" : `${heightPercent}%` }}
                                            ></div>
                                        </div>

                                        <span className="text-[10px] font-semibold text-gray-400 mt-2 uppercase tracking-wide">
                                            {item.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 px-2 text-xs font-semibold text-gray-500">
                        <p>Last Month: {formatMoney(earnings?.lastMonthEarnings || 0, currency)}</p>
                        <p>Projected Next Month: ~{formatMoney(earnings?.projectedNextMonth || 0, currency)}</p>
                    </div>
                </>
            )}
        </SectionCard>
    );
}

