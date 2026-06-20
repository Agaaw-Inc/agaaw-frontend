"use client";

import React from "react";
import Image from "next/image";
import { Camera, MapPin, Edit3, GraduationCap } from "lucide-react";

interface StudentProfileHeroProps {
    onEdit: () => void;
}

export default function StudentProfileHero({ onEdit }: StudentProfileHeroProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
            {/* Cover Photo */}
            <div className="h-48 w-full bg-gradient-to-r from-teal-600 to-teal-400 relative">
                <Image 
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop" 
                    alt="Cover" 
                    fill 
                    className="object-cover opacity-60 mix-blend-overlay"
                />
                <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors">
                    <Camera size={14} /> Change Cover
                </button>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 sm:px-10 pb-8 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-6 sm:left-10 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md relative group">
                    <Image 
                        src="https://i.pravatar.cc/250?img=11" 
                        alt="Profile Picture" 
                        fill 
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end pt-4">
                    <button 
                        onClick={onEdit}
                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>

                {/* Info */}
                <div className="mt-2 sm:mt-0 pt-4 sm:pt-0 sm:ml-40">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Fahim Rahman</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">Aspiring Data Scientist | BSc. Computer Science</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
                            <MapPin size={16} className="text-teal-600" />
                            Dhaka, Bangladesh
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
                            <GraduationCap size={16} className="text-teal-600" />
                            Targeting Masters in Germany
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
