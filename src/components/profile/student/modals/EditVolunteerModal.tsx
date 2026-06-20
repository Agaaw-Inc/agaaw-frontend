"use client";

import React, { useState } from "react";
import { X, Save, Trash2, Plus, Edit3 } from "lucide-react";

interface Volunteer {
    id: number;
    role: string;
    organization: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface EditVolunteerModalProps {
    onClose: () => void;
}

export default function EditVolunteerModal({ onClose }: EditVolunteerModalProps) {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([
        {
            id: 1,
            role: "Volunteer Teacher",
            organization: "Shobujer Ovijan (NGO)",
            location: "Dhaka",
            startDate: "2022-01",
            endDate: "", // empty means present
            description: "Providing free math classes and basic computer literacy lessons to underprivileged children in the local community weekly."
        }
    ]);

    // State for the "Add New" form
    const [newRole, setNewRole] = useState("");
    const [newOrganization, setNewOrganization] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // State for tracking which item is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRole.trim() && newOrganization.trim()) {
            const newItem: Volunteer = {
                id: Date.now(),
                role: newRole.trim(),
                organization: newOrganization.trim(),
                location: newLocation.trim(),
                startDate: newStartDate,
                endDate: newEndDate,
                description: newDescription.trim()
            };
            setVolunteers([...volunteers, newItem]);
            setNewRole("");
            setNewOrganization("");
            setNewLocation("");
            setNewStartDate("");
            setNewEndDate("");
            setNewDescription("");
        }
    };

    const handleCancelAdd = () => {
        setNewRole("");
        setNewOrganization("");
        setNewLocation("");
        setNewStartDate("");
        setNewEndDate("");
        setNewDescription("");
    };

    const handleDelete = (id: number) => {
        setVolunteers(volunteers.filter(item => item.id !== id));
    };

    const handleUpdate = (id: number, updatedItem: Volunteer) => {
        setVolunteers(volunteers.map(item => item.id === id ? updatedItem : item));
        setEditingId(null);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Manage Volunteer Experience</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Add New Section */}
                    <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Plus size={16} className="text-teal-600" /> Add New Volunteer Experience
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Role</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Volunteer Teacher"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Red Cross"
                                    value={newOrganization}
                                    onChange={(e) => setNewOrganization(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Location</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Dhaka"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Start Date</label>
                                        <input 
                                            type="month"
                                            value={newStartDate}
                                            onChange={(e) => setNewStartDate(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">End Date</label>
                                        <input 
                                            type="month"
                                            placeholder="Present"
                                            value={newEndDate}
                                            onChange={(e) => setNewEndDate(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Describe your volunteer work..."
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={handleCancelAdd}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleAdd}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                                    disabled={!newRole.trim() || !newOrganization.trim()}
                                >
                                    <Plus size={16} /> Add Experience
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Volunteer List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900">Your Volunteer Experience</h3>
                        
                        {volunteers.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No volunteer experience added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {volunteers.map((item) => (
                                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                        {editingId === item.id ? (
                                            <EditVolunteerForm 
                                                volunteer={item} 
                                                onSave={(updated) => handleUpdate(item.id, updated)} 
                                                onCancel={() => setEditingId(null)} 
                                            />
                                        ) : (
                                            <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900">{item.role}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">{item.organization} • {item.location}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.startDate} to {item.endDate || "Present"}</p>
                                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">
                                                    <button 
                                                        onClick={() => setEditingId(item.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-gray-200"
                                                    >
                                                        <Edit3 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={editingId !== null}
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
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditVolunteerForm({ volunteer, onSave, onCancel }: { volunteer: Volunteer, onSave: (item: Volunteer) => void, onCancel: () => void }) {
    const [role, setRole] = useState(volunteer.role);
    const [organization, setOrganization] = useState(volunteer.organization);
    const [location, setLocation] = useState(volunteer.location);
    const [startDate, setStartDate] = useState(volunteer.startDate);
    const [endDate, setEndDate] = useState(volunteer.endDate);
    const [description, setDescription] = useState(volunteer.description);

    const handleSave = () => {
        onSave({
            ...volunteer,
            role,
            organization,
            location,
            startDate,
            endDate,
            description
        });
    };

    return (
        <div className="p-5 space-y-4 bg-teal-50/30">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Role</label>
                <input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</label>
                <input 
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Location</label>
                    <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                </div>
                <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Start Date</label>
                        <input 
                            type="month"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">End Date</label>
                        <input 
                            type="month"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="Present"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
                <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
