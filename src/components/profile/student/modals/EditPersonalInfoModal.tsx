"use client";

import React from "react";
import { X, Save } from "lucide-react";

interface EditPersonalInfoModalProps {
    onClose: () => void;
}

export default function EditPersonalInfoModal({ onClose }: EditPersonalInfoModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Personal Information</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date of Birth</label>
                                <input type="date" defaultValue="2001-03-12" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                                    <option value="Male" selected>Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nationality</label>
                            <input type="text" defaultValue="Bangladeshi" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                        </div>
                        
                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Language Test Score (Optional)</h3>
                            <div className="grid grid-cols-5 gap-2">
                                <input type="text" placeholder="Overall" defaultValue="7.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500" title="Overall" />
                                <input type="text" placeholder="L" defaultValue="8.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500" title="Listening" />
                                <input type="text" placeholder="R" defaultValue="7.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500" title="Reading" />
                                <input type="text" placeholder="W" defaultValue="6.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500" title="Writing" />
                                <input type="text" placeholder="S" defaultValue="7.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500" title="Speaking" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
