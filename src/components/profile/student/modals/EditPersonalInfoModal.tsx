"use client";

import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface EditPersonalInfoModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditPersonalInfoModal({ profile, onClose, onSave }: EditPersonalInfoModalProps) {
    const [dateOfBirth, setDateOfBirth] = useState(
        profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""
    );
    const [gender, setGender] = useState(profile?.gender || "Male");
    const [nationality, setNationality] = useState(profile?.nationality || "Bangladeshi");
    const [phone, setPhone] = useState(profile?.phone || "");
    const [isSaving, setIsSaving] = useState(false);

    // Parse IELTS scores
    const ieltsScoreObj = profile?.testScores?.find((ts: any) => ts.testType === "ielts");
    let initialIelts = { overall: "", listening: "", reading: "", writing: "", speaking: "" };
    if (ieltsScoreObj?.score) {
        try {
            initialIelts = JSON.parse(ieltsScoreObj.score);
        } catch {
            initialIelts = { overall: ieltsScoreObj.score, listening: "", reading: "", writing: "", speaking: "" };
        }
    }

    const [overall, setOverall] = useState(initialIelts.overall || "");
    const [listening, setListening] = useState(initialIelts.listening || "");
    const [reading, setReading] = useState(initialIelts.reading || "");
    const [writing, setWriting] = useState(initialIelts.writing || "");
    const [speaking, setSpeaking] = useState(initialIelts.speaking || "");

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                dateOfBirth: dateOfBirth || null,
                gender,
                nationality,
                phone,
                testScores: {
                    ielts: {
                        overall,
                        listening,
                        reading,
                        writing,
                        speaking
                    }
                }
            });
            onClose();
        } catch (err) {
            console.error("Failed to save personal info:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Personal Information</h2>
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
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
                                <input 
                                    type="date" 
                                    value={dateOfBirth} 
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</label>
                                <select 
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nationality</label>
                                <input 
                                    type="text" 
                                    value={nationality} 
                                    onChange={(e) => setNationality(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. +880 1700-000000"
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Language Test Score (Optional)</h3>
                            <div className="grid grid-cols-5 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">Overall</label>
                                    <input 
                                        type="text" 
                                        placeholder="Overall" 
                                        value={overall} 
                                        onChange={(e) => setOverall(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500 disabled:opacity-50 font-bold text-teal-700" 
                                        title="Overall" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">Listening</label>
                                    <input 
                                        type="text" 
                                        placeholder="L" 
                                        value={listening} 
                                        onChange={(e) => setListening(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500 disabled:opacity-50 font-semibold" 
                                        title="Listening" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">Reading</label>
                                    <input 
                                        type="text" 
                                        placeholder="R" 
                                        value={reading} 
                                        onChange={(e) => setReading(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500 disabled:opacity-50 font-semibold" 
                                        title="Reading" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">Writing</label>
                                    <input 
                                        type="text" 
                                        placeholder="W" 
                                        value={writing} 
                                        onChange={(e) => setWriting(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500 disabled:opacity-50 font-semibold" 
                                        title="Writing" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-center">Speaking</label>
                                    <input 
                                        type="text" 
                                        placeholder="S" 
                                        value={speaking} 
                                        onChange={(e) => setSpeaking(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-teal-500 disabled:opacity-50 font-semibold" 
                                        title="Speaking" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
