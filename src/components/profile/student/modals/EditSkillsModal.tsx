"use client";

import React, { useState } from "react";
import { X, Save, Plus, Loader2 } from "lucide-react";

interface EditSkillsModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditSkillsModal({ profile, onClose, onSave }: EditSkillsModalProps) {
    const [skills, setSkills] = useState<string[]>(profile?.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ skills });
            onClose();
        } catch (err) {
            console.error("Failed to save skills:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Skills</h2>
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            disabled={isSaving}
                            placeholder="Add a new skill..." 
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                        />
                        <button type="submit" disabled={isSaving} className="bg-teal-500 hover:bg-teal-600 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span 
                                key={index} 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold"
                            >
                                {skill}
                                <button 
                                    onClick={() => removeSkill(skill)}
                                    disabled={isSaving}
                                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
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
                                <Save size={16} /> Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
