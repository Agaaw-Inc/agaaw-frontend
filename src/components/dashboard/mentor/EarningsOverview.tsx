"use client";

import React from "react";
import { DollarSign, TrendingUp, Calendar, Clock, CreditCard } from "lucide-react";

export default function EarningsOverview() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
                <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                    Withdraw Funds
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Earnings */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                            <DollarSign size={16} />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Earnings</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$4,850.00</p>
                </div>

                {/* Monthly Earnings */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar size={16} />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">This Month</p>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-2xl font-bold text-gray-900">$1,250</p>
                        <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">
                            <TrendingUp size={12} className="mr-1" />
                            +27%
                        </span>
                    </div>
                </div>

                {/* Pending Payments */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock size={16} />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pending Payments</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$320.00</p>
                </div>

                {/* Completed Sessions */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                            <CreditCard size={16} />
                        </div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Completed Sessions</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
            </div>

            {/* Simple Analytics Chart Placeholder */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center h-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="z-10 flex flex-col items-center">
                    <TrendingUp size={32} className="text-teal-500 mb-2" />
                    <p className="text-sm font-semibold text-gray-600">Revenue Growth Over Time</p>
                    <p className="text-xs text-gray-400">Chart visualization goes here</p>
                </div>
                
                {/* Simulated lines for "Stripe-like" feel */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end px-12 gap-4 opacity-30">
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '30%' }}></div>
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '50%' }}></div>
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '40%' }}></div>
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '70%' }}></div>
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '60%' }}></div>
                    <div className="w-full bg-teal-500 rounded-t-md" style={{ height: '90%' }}></div>
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 px-2 text-xs font-semibold text-gray-500">
                <p>Last Month: $980.00</p>
                <p>Projected Next Month: ~$1,500</p>
            </div>
        </div>
    );
}
