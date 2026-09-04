"use client";

import React from "react";
import { FileText, CheckCircle2, AlertCircle, UploadCloud, Trash2, ExternalLink } from "lucide-react";

interface DocumentsCardProps {
    documents: any[];
    onUploadClick?: (type: string, title: string, subtitle: string) => void;
    onDelete?: (id: string) => void;
}

export default function DocumentsCard({ documents, onUploadClick, onDelete }: DocumentsCardProps) {
    const docTypes = [
        { type: "transcript", title: "Academic Transcript", subtitle: "Official university transcript", required: true },
        { type: "certificate", title: "Student ID Card", subtitle: "Front & back scan of ID card", required: true },
        { type: "lor", title: "Recommendation Letter", subtitle: "Academic or professional LOR", required: true },
        { type: "test_score", title: "English Proficiency Certificate", subtitle: "IELTS / Duolingo / TOEFL score card", required: true },
        { type: "cv", title: "CV / Resume", subtitle: "Professional/Academic CV", required: false },
        { type: "sop", title: "Statement of Purpose (SOP)", subtitle: "Draft or final version", required: false },
    ];

    const getFileUrl = (url: string) => {
        if (!url) return "#";
        // R2 URLs (and all other absolute URLs) are returned as-is
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        // Legacy relative path fallback (dev only)
        return `http://localhost:3001${url}`;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <FileText size={20} className="text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Documents Checklist</h2>
            </div>

            <div className="space-y-4">
                {docTypes.map((docType) => {
                    const dbDoc = documents?.find((d) => d.type === docType.type);
                    const isUploaded = !!dbDoc;

                    return (
                        <div key={docType.type} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${isUploaded ? 'text-teal-600' : 'text-gray-400'}`}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {docType.title} {docType.required && <span className="text-red-500 text-[10px] font-bold uppercase ml-1">(Required)</span>}
                                    </h3>
                                    {isUploaded ? (
                                        <div className="mt-1 space-y-0.5">
                                            <p className="text-xs font-semibold text-gray-700 truncate max-w-[250px] sm:max-w-[350px]">
                                                📄 {dbDoc.fileName}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                Uploaded on {new Date(dbDoc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">{docType.subtitle}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:ml-auto">
                                {isUploaded ? (
                                    <>
                                        <div className="flex items-center gap-1.5 text-teal-600 mr-2">
                                            <CheckCircle2 size={16} />
                                            <span className="text-xs font-bold">Uploaded</span>
                                        </div>
                                        <a 
                                            href={getFileUrl(dbDoc.fileUrl)} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"
                                            title="View Uploaded File"
                                        >
                                            <ExternalLink size={12} /> View
                                        </a>
                                        {onUploadClick && (
                                            <button 
                                                onClick={() => onUploadClick(docType.type, docType.title, docType.subtitle)}
                                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Replace
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button 
                                                onClick={() => onDelete(dbDoc.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors border border-red-100"
                                                title="Delete File"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-1.5 text-red-500 mr-2">
                                            <AlertCircle size={16} />
                                            <span className="text-xs font-bold">Not Uploaded</span>
                                        </div>
                                        {onUploadClick && (
                                            <button 
                                                onClick={() => onUploadClick(docType.type, docType.title, docType.subtitle)}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-500 text-white hover:bg-teal-600 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                            >
                                                <UploadCloud size={14} /> Upload
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
