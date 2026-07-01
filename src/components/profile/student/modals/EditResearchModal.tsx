"use client";

import React, { useState } from "react";
import { X, Save, Trash2, Plus, Edit3, Loader2 } from "lucide-react";

interface Research {
    id: number;
    title: string;
    publishedIn: string;
    publicationDate: string;
    abstract: string;
}

interface EditResearchModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function EditResearchModal({ profile, onClose, onSave }: EditResearchModalProps) {
    const [researchList, setResearchList] = useState<Research[]>(
        (profile?.research as Research[]) || []
    );

    // State for the "Add New" form
    const [newTitle, setNewTitle] = useState("");
    const [newPublishedIn, setNewPublishedIn] = useState("");
    const [newPublicationDate, setNewPublicationDate] = useState("");
    const [newAbstract, setNewAbstract] = useState("");

    // State for tracking which item is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim() && newPublishedIn.trim()) {
            const newItem: Research = {
                id: Date.now(),
                title: newTitle.trim(),
                publishedIn: newPublishedIn.trim(),
                publicationDate: newPublicationDate,
                abstract: newAbstract.trim()
            };
            setResearchList([...researchList, newItem]);
            setNewTitle("");
            setNewPublishedIn("");
            setNewPublicationDate("");
            setNewAbstract("");
        }
    };

    const handleCancelAdd = () => {
        setNewTitle("");
        setNewPublishedIn("");
        setNewPublicationDate("");
        setNewAbstract("");
    };

    const handleDelete = (id: number) => {
        setResearchList(researchList.filter(item => item.id !== id));
    };

    const handleUpdate = (id: number, updatedItem: Research) => {
        setResearchList(researchList.map(item => item.id === id ? updatedItem : item));
        setEditingId(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({ research: researchList });
            onClose();
        } catch (err) {
            console.error("Failed to save research details:", err);
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
                    <h2 className="text-xl font-bold text-gray-900">Manage Research & Publication</h2>
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
                            <Plus size={16} className="text-teal-600" /> Add New Publication
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Optimizing Large Language Models..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Published In</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Journal Name"
                                        value={newPublishedIn}
                                        onChange={(e) => setNewPublishedIn(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Publication Date</label>
                                    <input 
                                        type="month"
                                        value={newPublicationDate}
                                        onChange={(e) => setNewPublicationDate(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Abstract / Description</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Describe your research..."
                                    value={newAbstract}
                                    onChange={(e) => setNewAbstract(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none disabled:opacity-50"
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
                                    disabled={!newTitle.trim() || !newPublishedIn.trim() || isSaving}
                                >
                                    <Plus size={16} /> Add Publication
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Research List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900">Your Publications</h3>
                        
                        {researchList.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No publications added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {researchList.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        {editingId === item.id ? (
                                            <EditResearchForm 
                                                research={item} 
                                                onSave={(updated) => handleUpdate(item.id, updated)} 
                                                onCancel={() => setEditingId(null)} 
                                            />
                                        ) : (
                                            <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{item.publishedIn} • {item.publicationDate}</p>
                                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.abstract}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
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

function EditResearchForm({ research, onSave, onCancel }: { research: Research, onSave: (item: Research) => void, onCancel: () => void }) {
    const [title, setTitle] = useState(research.title);
    const [publishedIn, setPublishedIn] = useState(research.publishedIn);
    const [publicationDate, setPublicationDate] = useState(research.publicationDate);
    const [abstract, setAbstract] = useState(research.abstract);

    const handleSave = () => {
        onSave({
            ...research,
            title,
            publishedIn,
            publicationDate,
            abstract
        });
    };

    return (
        <div className="p-5 space-y-4 bg-teal-50/30">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Published In</label>
                    <input 
                        type="text"
                        value={publishedIn}
                        onChange={(e) => setPublishedIn(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Publication Date</label>
                    <input 
                        type="month"
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Abstract / Description</label>
                <textarea 
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none"
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
