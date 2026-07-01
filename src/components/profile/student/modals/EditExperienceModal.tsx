"use client";

import React, { useState } from "react";
import { X, Save, Trash2, Plus, Edit3, Loader2 } from "lucide-react";

interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface EditExperienceModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditExperienceModal({ profile, onClose, onSave }: EditExperienceModalProps) {
    const [experiences, setExperiences] = useState<Experience[]>(
        (profile?.experience as Experience[]) || []
    );

    // State for the "Add New" form
    const [newTitle, setNewTitle] = useState("");
    const [newCompany, setNewCompany] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // State for tracking which item is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form handlers
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim() && newCompany.trim()) {
            const newExp: Experience = {
                id: Date.now(),
                title: newTitle.trim(),
                company: newCompany.trim(),
                location: newLocation.trim(),
                startDate: newStartDate,
                endDate: newEndDate,
                description: newDescription.trim()
            };
            setExperiences([...experiences, newExp]);
            // Reset form
            setNewTitle("");
            setNewCompany("");
            setNewLocation("");
            setNewStartDate("");
            setNewEndDate("");
            setNewDescription("");
        }
    };

    const handleCancelAdd = () => {
        setNewTitle("");
        setNewCompany("");
        setNewLocation("");
        setNewStartDate("");
        setNewEndDate("");
        setNewDescription("");
    };

    const handleDelete = (id: number) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const handleUpdate = (id: number, updatedExp: Experience) => {
        setExperiences(experiences.map(exp => exp.id === id ? updatedExp : exp));
        setEditingId(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ experience: experiences });
            onClose();
        } catch (err) {
            console.error("Failed to save experience:", err);
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
                    <h2 className="text-xl font-bold text-gray-900">Manage Experience</h2>
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Add New Section */}
                    <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Plus size={16} className="text-teal-600" /> Add New Experience
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} disabled={isSaving} placeholder="e.g. Software Engineer Intern" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company</label>
                                    <input type="text" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} disabled={isSaving} placeholder="e.g. Pathao Ltd." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Location</label>
                                    <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} disabled={isSaving} placeholder="e.g. Dhaka, Bangladesh" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50" />
                                </div>
                                <div className="flex items-end gap-4">
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Start Date</label>
                                        <input type="month" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} disabled={isSaving} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">End Date</label>
                                        <input type="month" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} disabled={isSaving} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description (Bullet points)</label>
                                <textarea 
                                    rows={4}
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Describe your responsibilities and achievements..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50 resize-none leading-relaxed" 
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
                                    disabled={!newTitle.trim() || !newCompany.trim() || isSaving}
                                >
                                    <Plus size={16} /> Add Experience
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Past Added Experiences */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900">Your Experiences</h3>
                        
                        {experiences.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No experiences added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        {editingId === exp.id ? (
                                            // Edit Mode
                                            <EditExperienceForm 
                                                experience={exp} 
                                                onSave={(updatedExp) => handleUpdate(exp.id, updatedExp)} 
                                                onCancel={() => setEditingId(null)} 
                                            />
                                        ) : (
                                            // View Mode
                                            <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900">{exp.title} at {exp.company}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{exp.startDate} to {exp.endDate || "Present"} • {exp.location}</p>
                                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                                                    <button 
                                                        onClick={() => setEditingId(exp.id)}
                                                        disabled={isSaving}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-gray-200 disabled:opacity-50"
                                                    >
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(exp.id)}
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

// Sub-component for editing an existing item
function EditExperienceForm({ experience, onSave, onCancel }: { experience: Experience, onSave: (exp: Experience) => void, onCancel: () => void }) {
    const [title, setTitle] = useState(experience.title);
    const [company, setCompany] = useState(experience.company);
    const [location, setLocation] = useState(experience.location);
    const [startDate, setStartDate] = useState(experience.startDate);
    const [endDate, setEndDate] = useState(experience.endDate);
    const [description, setDescription] = useState(experience.description);

    const handleSave = () => {
        onSave({
            ...experience,
            title,
            company,
            location,
            startDate,
            endDate,
            description
        });
    };

    return (
        <div className="p-5 space-y-4 bg-teal-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </div>
                <div className="flex items-end gap-4">
                    <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Start Date</label>
                        <input type="month" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">End Date</label>
                        <input type="month" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description (Bullet points)</label>
                <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none leading-relaxed" 
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
