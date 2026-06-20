"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";

interface EditStudentProfileModalProps {
    onClose: () => void;
}

export default function EditStudentProfileModal({ onClose }: EditStudentProfileModalProps) {
    const [activeTab, setActiveTab] = useState("personal");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-gray-100 gap-6">
                    <button 
                        onClick={() => setActiveTab("personal")}
                        className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "personal" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Personal Info
                    </button>
                    <button 
                        onClick={() => setActiveTab("academic")}
                        className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "academic" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Academic
                    </button>
                    <button 
                        onClick={() => setActiveTab("preferences")}
                        className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "preferences" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                        Preferences
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === "personal" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                                <input type="text" defaultValue="Fahim" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                                <input type="text" defaultValue="Rahman" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Headline / Bio</label>
                                <input type="text" defaultValue="Aspiring Data Scientist | BSc. Computer Science" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                <input type="email" defaultValue="fahim.rahman@example.com" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                                <input type="text" defaultValue="+880 1711 223344" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                            </div>
                        </div>
                    )}

                    {activeTab === "academic" && (
                        <div className="space-y-5">
                            <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-4">
                                <h3 className="text-sm font-bold text-gray-900">Highest Education</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Institution Name</label>
                                        <input type="text" defaultValue="BRAC University" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Degree</label>
                                        <input type="text" defaultValue="BSc in Computer Science and Engineering" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">CGPA / Grade</label>
                                        <input type="text" defaultValue="3.84" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
                                    </div>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-teal-600 hover:text-teal-700">+ Add another education</button>
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Degree</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500">
                                    <option>Bachelors</option>
                                    <option selected>Masters (MSc/MA)</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Countries (Comma separated)</label>
                                <input type="text" defaultValue="Germany, USA, Canada" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500" />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">IELTS Score</label>
                                <div className="grid grid-cols-5 gap-2">
                                    <input type="text" placeholder="Overall" defaultValue="7.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" title="Overall" />
                                    <input type="text" placeholder="L" defaultValue="8.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" title="Listening" />
                                    <input type="text" placeholder="R" defaultValue="7.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" title="Reading" />
                                    <input type="text" placeholder="W" defaultValue="6.5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" title="Writing" />
                                    <input type="text" placeholder="S" defaultValue="7.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center" title="Speaking" />
                                </div>
                            </div>
                        </div>
                    )}
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
