"use client";
 
import React from "react";
import { Link2, Github, Linkedin, Plus, Globe } from "lucide-react";
 
interface SocialLinksCardProps {
    profile: any;
    onEdit: () => void;
}
 
export default function SocialLinksCard({ profile, onEdit }: SocialLinksCardProps) {
    const links = (profile?.socialLinks as any[]) || [];

    const getIcon = (platform: string) => {
        const lower = platform.toLowerCase();
        if (lower.includes("linkedin")) {
            return <Linkedin size={18} className="text-white" />;
        }
        if (lower.includes("github")) {
            return <Github size={18} className="text-white" />;
        }
        return <Globe size={18} className="text-white" />;
    };

    const getBgColor = (platform: string) => {
        const lower = platform.toLowerCase();
        if (lower.includes("linkedin")) return "bg-[#0A66C2]";
        if (lower.includes("github")) return "bg-[#181717]";
        return "bg-teal-600";
    };
 
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
 
            {links.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No social links added yet. Click plus icon to add your social media profiles.</p>
            ) : (
                <div className="space-y-4">
                    {links.map((link, idx) => (
                        <a 
                            key={link.id || idx} 
                            href={link.url.startsWith("http") ? link.url : `https://${link.url}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors group"
                        >
                            <div className={`w-10 h-10 ${getBgColor(link.platform)} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                                {getIcon(link.platform)}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-sm font-bold text-gray-900">{link.platform}</h3>
                                <p className="text-xs font-medium text-gray-500 mt-0.5 truncate group-hover:text-teal-600 transition-colors">{link.url}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
