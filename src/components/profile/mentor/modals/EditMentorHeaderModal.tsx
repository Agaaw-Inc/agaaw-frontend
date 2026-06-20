"use client";

import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";

interface EditMentorHeaderModalProps {
    onClose: () => void;
    onSave?: (data: any) => void;
}

export default function EditMentorHeaderModal({ onClose, onSave }: EditMentorHeaderModalProps) {
    const [firstName, setFirstName] = useState("Arif");
    const [lastName, setLastName] = useState("Rahman");
    const [university, setUniversity] = useState("University of Oxford");
    const [country, setCountry] = useState("United Kingdom");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) {
            onSave({ firstName, lastName, university, country });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile Header</h2>
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
                        {/* Profile Image upload simulator */}
                        <div className="flex items-center gap-5">
                            <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                <img 
                                    src="https://i.pravatar.cc/250?img=32" 
                                    alt="Arif Rahman" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors">
                                    <Upload size={16} /> Upload New Photo
                                </button>
                                <p className="text-xs text-gray-500 mt-1.5">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">University</label>
                                    <input 
                                        type="text" 
                                        value={university} 
                                        onChange={(e) => setUniversity(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country</label>
                                    <input 
                                        type="text" 
                                        value={country} 
                                        onChange={(e) => setCountry(e.target.value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                    />
                                </div>
                            </div>
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
