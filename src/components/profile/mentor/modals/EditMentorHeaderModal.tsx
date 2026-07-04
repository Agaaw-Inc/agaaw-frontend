"use client";

import React, { useState, useRef } from "react";
import { X, Save, Upload, Loader2 } from "lucide-react";
import { uploadProfileImage, getProfileImageUrl } from "@/lib/api";

interface EditMentorHeaderModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onProfileImageUpload: (url: string) => void;
}

export default function EditMentorHeaderModal({ profile, onClose, onSave, onProfileImageUpload }: EditMentorHeaderModalProps) {
    const user = profile?.user;
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [university, setUniversity] = useState(profile?.currentUniversity || "");
    const [country, setCountry] = useState(profile?.countryName || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB");
            return;
        }

        setIsUploading(true);
        try {
            const res = await uploadProfileImage(file);
            const newImageUrl = res.data?.profileImage || res.profileImage;
            if (newImageUrl) {
                onProfileImageUpload(newImageUrl);
            }
        } catch (err) {
            console.error("Profile image upload failed:", err);
            alert("Failed to upload photo. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                firstName,
                lastName,
                currentUniversity: university || null,
                countryName: country || null,
            });
            onClose();
        } catch (err) {
            console.error("Failed to save mentor header:", err);
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
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile Header</h2>
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col">
                    {/* Body */}
                    <div className="p-6 space-y-6 flex-1">
                        {/* Profile Image upload section */}
                        <div className="flex items-center gap-5">
                            <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-teal-700 font-bold text-xl uppercase">
                                {user?.profileImage ? (
                                    <img 
                                        src={getProfileImageUrl(user.profileImage)} 
                                        alt={user.firstName} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.firstName?.substring(0, 2) || "M"
                                )}
                            </div>
                            <div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                <button 
                                    type="button" 
                                    onClick={handleUploadClick}
                                    disabled={isUploading || isSaving}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin text-teal-600" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} /> Upload New Photo
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-500 mt-1.5">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        onChange={(e) => setFirstName(e.target.value)} 
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName} 
                                        onChange={(e) => setLastName(e.target.value)} 
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">University</label>
                                    <input 
                                        type="text" 
                                        value={university} 
                                        onChange={(e) => setUniversity(e.target.value)} 
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Country</label>
                                    <input 
                                        type="text" 
                                        value={country} 
                                        onChange={(e) => setCountry(e.target.value)} 
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
