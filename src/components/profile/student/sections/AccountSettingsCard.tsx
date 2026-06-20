"use client";

import React from "react";
import { Settings } from "lucide-react";

interface AccountSettingsCardProps {
    // maybe pass a handler or just do state here?
    // The design has toggles
}

export default function AccountSettingsCard({}: AccountSettingsCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6">
                <Settings size={20} className="text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Scholarship Alerts</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Get notified about new relevant scholarships</p>
                    </div>
                    {/* Toggle Switch */}
                    <button className="w-11 h-6 bg-teal-600 rounded-full relative transition-colors focus:outline-none">
                        <span className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></span>
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Two-factor Authentication</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                    {/* Toggle Switch Off */}
                    <button className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors focus:outline-none">
                        <span className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></span>
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Profile Visibility</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Control who can see your profile details</p>
                    </div>
                    <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors">
                        Members only
                    </button>
                </div>
            </div>
        </div>
    );
}
