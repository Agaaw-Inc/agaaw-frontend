"use client";
 
import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
 
interface EditAcademicInfoModalProps {
    profile: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}
 
export default function EditAcademicInfoModal({ profile, onClose, onSave }: EditAcademicInfoModalProps) {
    const [institution, setInstitution] = useState(profile?.institution || "");
    const [degreeLevel, setDegreeLevel] = useState(profile?.degreeLevel || "");
    const [department, setDepartment] = useState(profile?.department || "");
    const [studentId, setStudentId] = useState(profile?.studentId || "");
    const [currentSemester, setCurrentSemester] = useState(profile?.currentSemester || "");
    const [expectedGraduation, setExpectedGraduation] = useState(profile?.expectedGraduation || "");
    const [cgpaInput, setCgpaInput] = useState(
        profile?.cgpa ? `${profile.cgpa}${profile.cgpaScale ? ` / ${profile.cgpaScale}` : " / 4.00"}` : ""
    );
    const [ranking, setRanking] = useState(profile?.ranking || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let cgpa = cgpaInput;
            let cgpaScale = "4.00";
            if (cgpaInput.includes("/")) {
                const parts = cgpaInput.split("/");
                cgpa = parts[0].trim();
                cgpaScale = parts[1].trim();
            }

            await onSave({
                institution,
                degreeLevel,
                department,
                studentId,
                currentSemester,
                expectedGraduation,
                cgpa,
                cgpaScale,
                ranking,
            });
            onClose();
        } catch (err) {
            console.error("Failed to save academic info:", err);
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
                    <h2 className="text-xl font-bold text-gray-900">Edit Academic Information</h2>
                    <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>
 
                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Institution</label>
                                <input 
                                    type="text" 
                                    value={institution} 
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Degree Level</label>
                                <input 
                                    type="text" 
                                    value={degreeLevel} 
                                    onChange={(e) => setDegreeLevel(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                        </div>
 
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Department</label>
                            <input 
                                type="text" 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                            />
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Student ID</label>
                                <input 
                                    type="text" 
                                    value={studentId} 
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Current Semester</label>
                                <input 
                                    type="text" 
                                    value={currentSemester} 
                                    onChange={(e) => setCurrentSemester(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Expected Grad.</label>
                                <input 
                                    type="text" 
                                    value={expectedGraduation} 
                                    onChange={(e) => setExpectedGraduation(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">CGPA (e.g. 3.85 / 4.00)</label>
                                <input 
                                    type="text" 
                                    value={cgpaInput} 
                                    onChange={(e) => setCgpaInput(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Department Ranking</label>
                                <input 
                                    type="text" 
                                    value={ranking} 
                                    onChange={(e) => setRanking(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                                />
                            </div>
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
