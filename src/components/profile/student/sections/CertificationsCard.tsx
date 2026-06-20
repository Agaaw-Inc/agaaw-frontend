"use client";

import React from "react";
import { Award, Plus, CheckCircle2 } from "lucide-react";

interface CertificationsCardProps {
    onEdit: () => void;
}

export default function CertificationsCard({ onEdit }: CertificationsCardProps) {
    const certs = [
        {
            id: 1,
            title: "Google Data Analytics",
            issuer: "Coursera",
            date: "Issued Nov 2023",
            verified: true,
            icon: "📊" // placeholder for Google logo or generic icon
        },
        {
            id: 2,
            title: "AWS Cloud Practitioner",
            issuer: "Amazon Web Services",
            date: "Issued Aug 2023",
            verified: true,
            icon: "☁️" // placeholder for AWS logo
        }
    ];

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certs.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl shadow-sm shrink-0">
                                {cert.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{cert.title}</h3>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">{cert.issuer} • {cert.date}</p>
                            </div>
                        </div>
                        
                        {cert.verified && (
                            <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 size={12} /> Verified
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
