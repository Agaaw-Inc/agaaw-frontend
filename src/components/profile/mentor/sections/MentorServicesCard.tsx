"use client";

import React from "react";
import { Clock, Settings } from "lucide-react";

interface MentorServicesCardProps {
    profile: any;
    onEdit: () => void;
}

export default function MentorServicesCard({ profile, onEdit }: MentorServicesCardProps) {
    const services = Array.isArray(profile?.services) ? profile.services : [];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Services & Pricing</h2>
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-1.5 text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                    <Settings size={14} /> Manage
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service: any, index: number) => (
                    <div 
                        key={service.id || index} 
                        className="border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all group relative bg-white"
                    >
                        {/* Top accent */}
                        <div className="absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-b-full" />
                        
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                            {service.description}
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-teal-700">
                                {service.currency || "$"} {service.price}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={12} />
                                {service.duration}
                            </span>
                        </div>
                    </div>
                ))}
                {services.length === 0 && (
                    <p className="text-sm text-gray-400 italic col-span-2">No services added yet. Click manage to list your mentoring services!</p>
                )}
            </div>
        </div>
    );
}
