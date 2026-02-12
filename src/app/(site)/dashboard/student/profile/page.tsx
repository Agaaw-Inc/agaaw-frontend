"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Camera,
    MapPin,
    Mail,
    User,
    FileText,
    Save,
    Edit
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function StudentProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Mock Data (State)
    const [profile, setProfile] = useState({
        firstName: "Md. Omar Faruk",
        lastName: "Maruf",
        email: "omar.faruk@example.com",
        bio: "Aspiring software engineer passionate about building scalable web applications. Currently looking for scholarship opportunities to pursue higher studies abroad.",
        address: "Dhaka, Bangladesh",
        profileImage: "/placeholder-avatar.jpg" // You might need a real placeholder or use a colorful div
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Here you would typically call an API to update the user profile
        setIsEditing(false);
        console.log("Saved profile:", profile);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">

            {/* Header Section */}
            <div className="relative">
                {/* Banner / Background */}
                <div className="h-48 w-full bg-gradient-to-r from-elm-dark to-elm rounded-t-2xl"></div>

                {/* Profile Info Overlay */}
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-4 flex justify-between items-end">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden relative">
                                {/* Placeholder Avatar - replacing image source for now as we might not have one */}
                                <div className="h-full w-full bg-slate-200 flex items-center justify-center text-slate-400">
                                    <User className="h-16 w-16" />
                                </div>
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-1 right-1 p-2 bg-codgray text-white rounded-full hover:bg-codgray/90 transition shadow-sm">
                                    <Camera className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="mb-2">
                            <Button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={isEditing ? "bg-elm text-white hover:bg-elm-dark" : "bg-white text-codgray border border-bombay/30 hover:bg-slate-50"}
                            >
                                {isEditing ? (
                                    <span className="flex items-center gap-2">
                                        <Save className="h-4 w-4" /> Save Changes
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" /> Edit Profile
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-codgray">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-bombay flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" /> {profile.address}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Quick Stats / Completion */}
                <div className="space-y-6">
                    <Card className="!p-6 !max-w-none bg-white">
                        <h3 className="font-semibold text-codgray mb-4">Profile Completion</h3>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-elm-dark bg-elm-light/20">
                                        85%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-elm-light/20">
                                <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-elm"></div>
                            </div>
                            <p className="text-xs text-bombay">Complete your profile to get better scholarship recommendations.</p>
                        </div>
                    </Card>

                    <Card className="!p-6 !max-w-none bg-white">
                        <h3 className="font-semibold text-codgray mb-4">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-codgray">
                                <Mail className="h-4 w-4 text-bombay" />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-codgray">
                                <MapPin className="h-4 w-4 text-bombay" />
                                {profile.address}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Personal Details Form */}
                <div className="md:col-span-2">
                    <Card className="!p-8 !max-w-none bg-white">
                        <div className="flex items-center gap-2 mb-6 border-b border-bombay/20 pb-4">
                            <User className="h-5 w-5 text-elm" />
                            <h2 className="text-lg font-semibold text-codgray">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-codgray">First Name</label>
                                {isEditing ? (
                                    <Input
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="p-2 text-sm text-codgray">{profile.firstName}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-codgray">Last Name</label>
                                {isEditing ? (
                                    <Input
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="p-2 text-sm text-codgray">{profile.lastName}</div>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-codgray">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-md bg-bombay/20 border-[0.5px] border-bombay/40 text-codgray placeholder:text-bombay focus:outline-none focus:ring-1 focus:ring-codgray focus:border-elm transition resize-none"
                                    />
                                ) : (
                                    <p className="p-2 text-sm text-codgray leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-codgray">Address</label>
                                {isEditing ? (
                                    <Input
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="p-2 text-sm text-codgray">{profile.address}</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
