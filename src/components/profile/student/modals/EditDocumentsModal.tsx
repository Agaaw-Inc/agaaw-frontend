"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, FileText, Loader2 } from "lucide-react";

const MAX_DOCUMENT_SIZE = 1.5 * 1024 * 1024; // 1.5 MB

interface EditDocumentsModalProps {
    docInfo: { type: string; title: string; subtitle: string };
    onClose: () => void;
    onUpload: (type: string, file: File) => Promise<void>;
}

export default function EditDocumentsModal({ docInfo, onClose, onUpload }: EditDocumentsModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setFileError("Only PDF files are allowed.");
            e.target.value = "";
            return;
        }
        if (selected.size > MAX_DOCUMENT_SIZE) {
            setFileError("File must be smaller than 1.5MB.");
            e.target.value = "";
            return;
        }

        setFile(selected);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            await onUpload(docInfo.type, file);
            onClose();
        } catch (err: any) {
            console.error("Failed to upload document:", err);
            setFileError(err.message || "Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
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
                            <p className="text-sm font-bold text-teal-900">{docInfo.title}</p>
                            <p className="text-xs text-teal-700">{docInfo.subtitle}</p>
                        </div>
                    </div>

                    <div 
                        onClick={handleUploadClick}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-teal-300 transition-colors cursor-pointer group"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            disabled={isUploading}
                            className="hidden" 
                            accept="application/pdf"
                        />
                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        {file ? (
                            <div>
                                <h3 className="text-xs font-bold text-teal-700 mb-1 uppercase tracking-wider">Selected File</h3>
                                <p className="text-sm font-bold text-gray-950 truncate max-w-[280px]">{file.name}</p>
                                <p className="text-[10px] font-semibold text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Click to select file</h3>
                                <p className="text-xs text-gray-500">PDF only (max. 1.5MB)</p>
                            </>
                        )}
                    </div>
                    {fileError && <p className="text-xs text-red-500 -mt-2">{fileError}</p>}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex flex-col gap-3">
                    <button 
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Uploading...
                            </>
                        ) : (
                            "Upload File"
                        )}
                    </button>
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
