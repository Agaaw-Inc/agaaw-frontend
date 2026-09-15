"use client";

import React from "react";
import { Wallet } from "lucide-react";

interface FinancialDetailsCardProps {
    profile: any;
    onEdit?: () => void;
}

export default function FinancialDetailsCard({ profile, onEdit }: FinancialDetailsCardProps) {
    const fin = profile?.financialDetails || {};
    // "Add details..." placeholders belong to the student's own editable profile.
    // Viewers only see the details the student actually filled in.
    const isEditable = !!onEdit;

    const details = [
        { label: "Annual Family Income", value: fin.annualIncome ? `BDT ${fin.annualIncome}` : "", highlight: true },
        { label: "Guardian Name", value: fin.guardianName },
        { label: "Income Source", value: fin.incomeSource },
        { label: "Relation to", value: fin.relation },
        { label: "Occupation", value: fin.occupation },
        { label: "Guardian Phone", value: fin.phone },
    ].filter((detail) => isEditable || detail.value);

    if (!isEditable && details.length === 0) return null;

    // Two label/value pairs per table row, same order as before.
    const rows: (typeof details)[] = [];
    for (let i = 0; i < details.length; i += 2) {
        rows.push(details.slice(i, i + 2));
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Wallet size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Financial & Guardian Details</h2>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"
                    >
                        Update Details
                    </button>
                )}
            </div>

            <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-1">
                <table className="w-full text-sm">
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={row[0].label}
                                className={rowIndex < rows.length - 1 ? "border-b border-gray-100/50" : undefined}
                            >
                                {row.map((detail, colIndex) => (
                                    <React.Fragment key={detail.label}>
                                        <td className="py-3 px-4 text-gray-500 font-semibold w-1/4">{detail.label}</td>
                                        <td
                                            className={`py-3 px-4 w-1/4 ${detail.highlight ? "text-teal-600 font-bold" : "text-gray-900 font-semibold"} ${colIndex === 1 ? "text-right" : ""}`}
                                        >
                                            {detail.value || "Add details..."}
                                        </td>
                                    </React.Fragment>
                                ))}
                                {row.length === 1 && <td colSpan={2} />}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
