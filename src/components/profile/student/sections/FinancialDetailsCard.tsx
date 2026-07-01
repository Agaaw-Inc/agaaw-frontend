"use client";

import React from "react";
import { Wallet } from "lucide-react";

interface FinancialDetailsCardProps {
    profile: any;
    onEdit: () => void;
}

export default function FinancialDetailsCard({ profile, onEdit }: FinancialDetailsCardProps) {
    const fin = profile?.financialDetails || {};

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Wallet size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Financial & Guardian Details</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"
                >
                    Update Details
                </button>
            </div>

            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-1">
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b border-gray-100/50">
                            <td className="py-3 px-4 text-gray-500 font-semibold w-1/4">Annual Family Income</td>
                            <td className="py-3 px-4 text-teal-600 font-bold w-1/4">
                                {fin.annualIncome ? `BDT ${fin.annualIncome}` : "Add details..."}
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-semibold w-1/4">Guardian Name</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold w-1/4 text-right">
                                {fin.guardianName || "Add details..."}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-100/50">
                            <td className="py-3 px-4 text-gray-500 font-semibold">Income Source</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">
                                {fin.incomeSource || "Add details..."}
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Relation to</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold text-right">
                                {fin.relation || "Add details..."}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Occupation</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">
                                {fin.occupation || "Add details..."}
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Guardian Phone</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold text-right">
                                {fin.phone || "Add details..."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
