"use client";

import React, { useState } from "react";
import { X, Save, Plus, Trash2, Loader2 } from "lucide-react";

interface Achievement {
    id: number | string;
    title: string;
    issuer: string;
    icon: string;
}

interface EditMentorAchievementsModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditMentorAchievementsModal({ profile, onClose, onSave }: EditMentorAchievementsModalProps) {
    const initialAchievements = Array.isArray(profile?.achievements) ? profile.achievements : [];
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

    const [title, setTitle] = useState("");
    const [issuer, setIssuer] = useState("");
    const [icon, setIcon] = useState("🏆");
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && issuer.trim()) {
            const newItem: Achievement = {
                id: Date.now().toString(),
                title: title.trim(),
                issuer: issuer.trim(),
                icon
            };
            setAchievements([...achievements, newItem]);
            setTitle("");
            setIssuer("");
        }
    };

    const handleRemove = (id: number | string) => {
        setAchievements(achievements.filter(item => item.id !== id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ achievements });
            onClose();
        } catch (err) {
            console.error("Failed to save mentor achievements:", err);
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
                    <h2 className="text-xl font-bold text-gray-900">Manage Achievements & Awards</h2>
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
                    {/* Add form */}
                    <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add Achievement</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1">
                                <input 
                                    type="text"
                                    placeholder="Title (e.g. Dean's List Award)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <select 
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                >
                                    <option value="🏆">🏆 Trophy</option>
                                    <option value="🥇">🥇 Gold Medal</option>
                                    <option value="🥈">🥈 Silver Medal</option>
                                    <option value="🏅">🏅 Medal</option>
                                    <option value="🎓">🎓 Graduation</option>
                                    <option value="✨">✨ Star</option>
                                </select>
                            </div>
                        </div>
                        <input 
                            type="text"
                            placeholder="Issuer & Date (e.g. University of Dhaka - 2022)"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                            disabled={isSaving}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                            required
                        />
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-1.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                        >
                            <Plus size={16} /> Add Achievement
                        </button>
                    </form>

                    {/* Achievements List */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Current Achievements</label>
                        <div className="space-y-2.5">
                            {achievements.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-150 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-xs font-medium text-gray-500">{item.issuer}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => handleRemove(item.id)}
                                        disabled={isSaving}
                                        className="p-2 text-gray-400 hover:text-red-650 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {achievements.length === 0 && (
                                <p className="text-sm text-gray-500 italic py-2">No achievements added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
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
