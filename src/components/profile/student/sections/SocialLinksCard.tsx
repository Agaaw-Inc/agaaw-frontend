"use client";

import React from "react";
import { Link2, Github, Linkedin, Plus } from "lucide-react";

interface SocialLinksCardProps {
    onEdit: () => void;
}

export default function SocialLinksCard({ onEdit }: SocialLinksCardProps) {
    const links = [
        {
            id: 1,
            platform: "LinkedIn",
            url: "linkedin.com/in/omarfaruk...",
            icon: <Linkedin size={18} className="text-white" />,
            bgColor: "bg-[#0A66C2]"
        },
        {
            id: 2,
            platform: "GitHub",
            url: "github.com/omarfaruk",
            icon: <Github size={18} className="text-white" />,
            bgColor: "bg-[#181717]"
        }
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Link2 size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-gray-900">Social Links</h2>
                </div>
                <button 
                    onClick={onEdit}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {links.map((link) => (
                    <a 
                        key={link.id} 
                        href={`https://${link.url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors group"
                    >
                        <div className={`w-10 h-10 ${link.bgColor} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                            {link.icon}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-sm font-bold text-gray-900">{link.platform}</h3>
                            <p className="text-xs font-medium text-gray-500 mt-0.5 truncate group-hover:text-teal-600 transition-colors">{link.url}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
