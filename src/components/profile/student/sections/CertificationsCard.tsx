"use client";

import React from "react";
import { Award, Plus, CheckCircle2 } from "lucide-react";

interface CertificationsCardProps {
    profile: any;
    onEdit: () => void;
}

export default function CertificationsCard({ profile, onEdit }: CertificationsCardProps) {
    const certs = (profile?.certifications as any[]) || [];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Award size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {certs.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No certifications added yet. Click plus icon to add certifications.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certs.map((cert, idx) => (
                        <div key={cert.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl shadow-sm shrink-0">
                                    📜
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{cert.name}</h3>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">{cert.organization} • {cert.issueDate}</p>
                                    {cert.url && (
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline mt-1 inline-block">View Credential</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
