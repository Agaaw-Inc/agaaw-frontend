"use client";

import React from "react";
import { Wallet } from "lucide-react";

interface FinancialDetailsCardProps {
    onEdit: () => void;
}

export default function FinancialDetailsCard({ onEdit }: FinancialDetailsCardProps) {
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
                            <td className="py-3 px-4 text-teal-600 font-bold w-1/4">BDT 4,60,000</td>
                            <td className="py-3 px-4 text-gray-500 font-semibold w-1/4">Guardian Name</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold w-1/4 text-right">Md. Abdul Karim</td>
                        </tr>
                        <tr className="border-b border-gray-100/50">
                            <td className="py-3 px-4 text-gray-500 font-semibold">Income Source</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">Service (Government)</td>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Relation to</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold text-right">Father</td>
                        </tr>
                        <tr>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Occupation</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold">Government Officer</td>
                            <td className="py-3 px-4 text-gray-500 font-semibold">Guardian Phone</td>
                            <td className="py-3 px-4 text-gray-900 font-semibold text-right">+880 1611-224567</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
