"use client";

import React, { useState } from "react";
import { X, Save, Plus } from "lucide-react";

interface EditMentorExpertiseModalProps {
    onClose: () => void;
    onSave?: (data: string[]) => void;
}

export default function EditMentorExpertiseModal({ onClose, onSave }: EditMentorExpertiseModalProps) {
    const [tags, setTags] = useState([
        "Scholarship Essays",
        "UK Universities",
        "Personal Statements",
        "IELTS Preparation",
        "Application Strategy",
        "Interview Coaching"
    ]);
    const [newTag, setNewTag] = useState("");

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(tags);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Expertise Tags</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add Tag */}
                    <form onSubmit={handleAddTag} className="flex gap-2">
                        <input 
                            type="text"
                            placeholder="Add new expertise tag (e.g., TOEFL, Germany Applications)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                        <button 
                            type="submit"
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </form>

                    {/* Current Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Your Expertise Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-800 text-sm font-medium"
                                >
                                    <span>{tag}</span>
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="p-0.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {tags.length === 0 && (
                                <p className="text-sm text-gray-500 italic py-2">No tags added yet. Add some above.</p>
                            )}
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
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
