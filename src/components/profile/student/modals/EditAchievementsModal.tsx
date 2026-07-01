"use client";

import React, { useState } from "react";
import { X, Save, Trash2, Plus, Edit3, Loader2 } from "lucide-react";

interface Achievement {
    id: number;
    title: string;
    issuer: string;
    icon: string;
}

interface EditAchievementsModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditAchievementsModal({ profile, onClose, onSave }: EditAchievementsModalProps) {
    const [achievements, setAchievements] = useState<Achievement[]>(
        (profile?.achievements as Achievement[]) || []
    );

    // State for the "Add New" form
    const [newTitle, setNewTitle] = useState("");
    const [newIssuer, setNewIssuer] = useState("");
    const [newIcon, setNewIcon] = useState("🏆");

    // State for tracking which item is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim() && newIssuer.trim()) {
            const newItem: Achievement = {
                id: Date.now(),
                title: newTitle.trim(),
                issuer: newIssuer.trim(),
                icon: newIcon
            };
            setAchievements([...achievements, newItem]);
            setNewTitle("");
            setNewIssuer("");
            setNewIcon("🏆");
        }
    };

    const handleCancelAdd = () => {
        setNewTitle("");
        setNewIssuer("");
        setNewIcon("🏆");
    };

    const handleDelete = (id: number) => {
        setAchievements(achievements.filter(item => item.id !== id));
    };

    const handleUpdate = (id: number, updatedItem: Achievement) => {
        setAchievements(achievements.map(item => item.id === id ? updatedItem : item));
        setEditingId(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ achievements });
            onClose();
        } catch (err) {
            console.error("Failed to save achievements details:", err);
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
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Add New Section */}
                    <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Plus size={16} className="text-teal-600" /> Add New Achievement
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Achievement Title</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Dean's List Award"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Icon</label>
                                    <select 
                                        value={newIcon}
                                        onChange={(e) => setNewIcon(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
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
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Issuer & Date</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. University of Dhaka - 2022"
                                    value={newIssuer}
                                    onChange={(e) => setNewIssuer(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={handleCancelAdd}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Clear
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleAdd}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                                    disabled={!newTitle.trim() || !newIssuer.trim() || isSaving}
                                >
                                    <Plus size={16} /> Add Achievement
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Achievements List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900">Your Achievements</h3>
                        
                        {achievements.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No achievements added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {achievements.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        {editingId === item.id ? (
                                            <EditAchievementForm 
                                                achievement={item} 
                                                onSave={(updated) => handleUpdate(item.id, updated)} 
                                                onCancel={() => setEditingId(null)} 
                                            />
                                        ) : (
                                            <div className="p-4 flex items-center justify-between gap-4 bg-white">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl shrink-0">{item.icon}</span>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5">{item.issuer}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button 
                                                        onClick={() => setEditingId(item.id)}
                                                        disabled={isSaving}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-gray-200 disabled:opacity-50"
                                                    >
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={editingId !== null || isSaving}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save & Done
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditAchievementForm({ achievement, onSave, onCancel }: { achievement: Achievement, onSave: (item: Achievement) => void, onCancel: () => void }) {
    const [title, setTitle] = useState(achievement.title);
    const [issuer, setIssuer] = useState(achievement.issuer);
    const [icon, setIcon] = useState(achievement.icon);

    const handleSave = () => {
        onSave({
            ...achievement,
            title,
            issuer,
            icon
        });
    };

    return (
        <div className="p-5 space-y-4 bg-teal-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Achievement Title</label>
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Icon</label>
                    <select 
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
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
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Issuer & Date</label>
                <input 
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
                <button 
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>
    );
}
