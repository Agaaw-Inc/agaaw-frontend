"use client";

import React, { useRef, useState } from "react";
import { X, Save, Upload, Loader2, Trash2 } from "lucide-react";
import { resolveFileUrl, uploadStudentProfilePicture, deleteStudentProfilePicture } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";

type StudyLevel = 'bachelors' | 'masters' | 'phd' | 'diploma' | 'other';

const MAX_AVATAR_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface EditProfileHeaderModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onAvatarChange?: (user: { profileImage: string | null }) => void;
}

export default function EditProfileHeaderModal({ profile, onClose, onSave, onAvatarChange }: EditProfileHeaderModalProps) {
    const user = profile?.user;
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [nationality, setNationality] = useState(profile?.nationality || "");
    const [studyLevel, setStudyLevel] = useState<StudyLevel>(profile?.studyLevel || "masters");
    const [fieldOfInterest, setFieldOfInterest] = useState(profile?.fieldOfInterest || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profileImage || null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setAvatarError(null);

        if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
            setAvatarError("Please choose a JPG, PNG, WEBP or GIF image.");
            return;
        }
        if (file.size > MAX_AVATAR_SIZE) {
            setAvatarError("Image must be smaller than 1MB.");
            return;
        }

        const localPreviewUrl = URL.createObjectURL(file);
        setAvatarPreview(localPreviewUrl);
        setIsUploadingAvatar(true);
        try {
            const updated = await uploadStudentProfilePicture(file);
            setAvatarPreview(updated.profileImage);
            onAvatarChange?.(updated);
        } catch (err: any) {
            console.error("Failed to upload profile picture:", err);
            setAvatarError(err.message || "Failed to upload profile picture. Please try again.");
            setAvatarPreview(user?.profileImage || null);
        } finally {
            URL.revokeObjectURL(localPreviewUrl);
            setIsUploadingAvatar(false);
        }
    };

    const handleAvatarRemove = async () => {
        setAvatarError(null);
        setIsUploadingAvatar(true);
        try {
            const updated = await deleteStudentProfilePicture();
            setAvatarPreview(null);
            onAvatarChange?.(updated);
        } catch (err: any) {
            console.error("Failed to remove profile picture:", err);
            setAvatarError(err.message || "Failed to remove profile picture. Please try again.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                firstName,
                lastName,
                nationality,
                studyLevel,
                fieldOfInterest,
                bio,
            });
            onClose();
        } catch (err) {
            console.error("Failed to save profile header:", err);
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

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-5">
                        <div className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-teal-700 font-bold text-xl uppercase">
                            <Avatar
                                src={avatarPreview?.startsWith("blob:") ? avatarPreview : resolveFileUrl(avatarPreview)}
                                name={user?.firstName || "S"}
                            />
                            {isUploadingAvatar && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 size={20} className="text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarSelect}
                                className="hidden"
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="flex items-center gap-2 px-4 py-2 border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    <Upload size={16} /> Upload New Photo
                                </button>
                                {avatarPreview && (
                                    <button
                                        type="button"
                                        onClick={handleAvatarRemove}
                                        disabled={isUploadingAvatar}
                                        className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={15} /> Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">JPG, PNG or WEBP. Max size 1MB.</p>
                            {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
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
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Location / Nationality</label>
                                <input 
                                    type="text" 
                                    value={nationality} 
                                    onChange={(e) => setNationality(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Study Level</label>
                                <select 
                                    value={studyLevel}
                                    onChange={(e) => setStudyLevel(e.target.value as StudyLevel)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                >
                                    <option value="bachelors">Bachelors</option>
                                    <option value="masters">Masters</option>
                                    <option value="phd">PhD</option>
                                    <option value="diploma">Diploma</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Target Destination / Field of Interest</label>
                            <input 
                                type="text" 
                                value={fieldOfInterest} 
                                onChange={(e) => setFieldOfInterest(e.target.value)}
                                placeholder="e.g. Germany or Computer Science"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">About Me</label>
                            <textarea 
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none" 
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
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
            </div>
        </div>
    );
}
