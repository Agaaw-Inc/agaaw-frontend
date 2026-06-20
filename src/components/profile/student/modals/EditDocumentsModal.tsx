"use client";

import React from "react";
import { X, UploadCloud, FileText } from "lucide-react";

interface EditDocumentsModalProps {
    onClose: () => void;
    // documentTitle: string; // To specify which document is being uploaded
}

export default function EditDocumentsModal({ onClose }: EditDocumentsModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                        <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-teal-900">Recommendation Letter</p>
                            <p className="text-xs text-teal-700">From Department Head</p>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-teal-300 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Click to upload or drag and drop</h3>
                        <p className="text-xs text-gray-500">PDF, JPG, or PNG (max. 10MB)</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
                    <button className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                        Upload File
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
