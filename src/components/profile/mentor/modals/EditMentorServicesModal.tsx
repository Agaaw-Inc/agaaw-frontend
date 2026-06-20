"use client";

import React, { useState } from "react";
import { X, Save, Plus, Trash2, Clock, DollarSign } from "lucide-react";

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
}

interface EditMentorServicesModalProps {
    onClose: () => void;
    onSave?: (services: Service[]) => void;
}

export default function EditMentorServicesModal({ onClose, onSave }: EditMentorServicesModalProps) {
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            title: "Full Application Review",
            description: "Complete review of your university application including personal statement, CV, and profile positioning.",
            price: 120,
            currency: "$",
            duration: "95 min",
        },
        {
            id: 2,
            title: "Scholarship Strategy Session",
            description: "Personalized session to identify the best scholarship opportunities for your profile and map out next steps.",
            price: 80,
            currency: "$",
            duration: "60 min",
        },
    ]);

    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDuration, setNewDuration] = useState("");

    const handleAddService = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim() && newPrice && newDuration) {
            const newService: Service = {
                id: Date.now(),
                title: newTitle.trim(),
                description: newDesc.trim() || "No description provided.",
                price: Number(newPrice),
                currency: "$",
                duration: newDuration.trim()
            };
            setServices([...services, newService]);
            setNewTitle("");
            setNewDesc("");
            setNewPrice("");
            setNewDuration("");
        }
    };

    const handleRemoveService = (id: number) => {
        setServices(services.filter(s => s.id !== id));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(services);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Manage Services & Pricing</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add New Service Form */}
                    <form onSubmit={handleAddService} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add a New Service</h3>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <input 
                                type="text"
                                placeholder="Service Title (e.g. Statement of Purpose Check)"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500"
                                required
                            />
                            
                            <textarea 
                                placeholder="Service Description..."
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none h-20"
                            />
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <input 
                                        type="number"
                                        placeholder="Price"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-teal-500"
                                        required
                                    />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Duration (e.g. 45 min)"
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full flex items-center justify-center gap-1.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition"
                        >
                            <Plus size={16} /> Add Service
                        </button>
                    </form>

                    {/* Services List */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Current Services</label>
                        <div className="space-y-3">
                            {services.map((service) => (
                                <div 
                                    key={service.id} 
                                    className="flex items-start justify-between gap-4 p-4 border border-gray-150 rounded-xl hover:border-gray-300 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-gray-900">{service.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                                        <div className="flex items-center gap-3 pt-1">
                                            <span className="text-sm font-bold text-teal-700">{service.currency}{service.price}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {service.duration}</span>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveService(service.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {services.length === 0 && (
                                <p className="text-sm text-gray-500 italic py-2">No services added yet. Add a service above.</p>
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
