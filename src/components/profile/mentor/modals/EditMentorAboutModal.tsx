"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";

interface EditMentorAboutModalProps {
    onClose: () => void;
    onSave?: (data: any) => void;
}

export default function EditMentorAboutModal({ onClose, onSave }: EditMentorAboutModalProps) {
    const [bio, setBio] = useState(
        "Scholarship consultant and study abroad expert with 8+ years of experience helping students achieve their academic dreams. I've personally guided over 300 students through successful applications to top universities in the UK, US, and Europe. My approach combines strategic planning with personalized application review to ensure every student presents their best self to admissions committees."
    );

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) {
            onSave({ bio });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit About</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col">
                    {/* Body */}
                    <div className="p-6 space-y-6 flex-1">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">About Me / Bio</label>
                            <textarea 
                                rows={8}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none" 
                                placeholder="Tell prospective students about yourself, your experience, and your coaching approach..."
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
