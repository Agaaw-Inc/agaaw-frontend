"use client";

import React from "react";
import { FileText, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";

interface MentorDocumentsCardProps {
    // optional props
}

const docs = [
    { id: 1, title: "Student ID Card", subtitle: "Front & back scan of current student ID", status: "Uploaded", required: true },
    { id: 2, title: "Passport", subtitle: "Information page passport copy", status: "Uploaded", required: true },
    { id: 3, title: "Visa", subtitle: "Valid student visa copy", status: "Not Uploaded", required: true },
];

export default function MentorDocumentsCard({}: MentorDocumentsCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <FileText size={20} className="text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Documents Checklist</h2>
            </div>

            <div className="space-y-4">
                {docs.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-4">
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${doc.status === 'Uploaded' ? 'text-teal-600' : 'text-gray-400'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{doc.title}</h3>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">{doc.subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:ml-auto">
                            {doc.status === 'Uploaded' ? (
                                <div className="flex items-center gap-1.5 text-teal-600">
                                    <CheckCircle2 size={16} />
                                    <span className="text-sm font-semibold">Uploaded</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-red-500">
                                    <AlertCircle size={16} />
                                    <span className="text-sm font-semibold">Not Uploaded</span>
                                </div>
                            )}

                            {doc.status === 'Uploaded' ? (
                                <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                                    Replace
                                </button>
                            ) : (
                                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-500 text-white hover:bg-teal-600 rounded-lg text-xs font-bold transition-colors shadow-sm">
                                    <UploadCloud size={14} /> Upload
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
