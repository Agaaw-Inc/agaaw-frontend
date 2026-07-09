"use client";

import React from "react";
import { DollarSign, TrendingUp, Calendar, Clock, CreditCard, Wallet } from "lucide-react";
import SectionCard from "@/components/dashboard/common/SectionCard";

const METRICS = [
    { icon: DollarSign, label: "Total Earnings", value: "$4,850.00", iconClass: "bg-teal-100 text-teal-600" },
    { icon: Calendar, label: "This Month", value: "$1,250", trend: "+27%", iconClass: "bg-blue-100 text-blue-600" },
    { icon: Clock, label: "Pending Payments", value: "$320.00", iconClass: "bg-amber-100 text-amber-600" },
    { icon: CreditCard, label: "Completed Sessions", value: "45", iconClass: "bg-violet-100 text-violet-600" },
];

const CHART_BARS = [30, 50, 40, 70, 60, 90];

export default function EarningsOverview() {
    return (
        <SectionCard
            title="Earnings Overview"
            icon={Wallet}
            actions={
                <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-lg transition-colors">
                    Withdraw Funds
                </button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {METRICS.map(({ icon: Icon, label, value, trend, iconClass }) => (
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
                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">
                                    <TrendingUp size={12} className="mr-1" />
                                    {trend}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue chart */}
            <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-6 h-48 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-teal-500" />
                        <p className="text-sm font-semibold text-gray-700">Revenue Growth Over Time</p>
                    </div>
                    <p className="text-xs text-gray-400">Last 6 months</p>
                </div>

                <div className="flex items-end gap-3 h-full pt-6">
                    {CHART_BARS.map((h, i) => (
                        <div key={i} className="flex-1 h-full flex items-end">
                            <div
                                className="w-full bg-gradient-to-t from-teal-600 to-emerald-400 rounded-t-md transition-all"
                                style={{ height: `${h}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 px-2 text-xs font-semibold text-gray-500">
                <p>Last Month: $980.00</p>
                <p>Projected Next Month: ~$1,500</p>
            </div>
        </SectionCard>
    );
}
