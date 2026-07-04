"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/landing/Footer";
import { getStudentProfile, updateStudentProfile, getStudentDocuments, uploadStudentDocument, deleteStudentDocument } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Sections
import StudentProfileHeader from "@/components/profile/student/sections/StudentProfileHeader";
import PersonalInfoCard from "@/components/profile/student/sections/PersonalInfoCard";
import AcademicInfoCard from "@/components/profile/student/sections/AcademicInfoCard";
import ExperienceCard from "@/components/profile/student/sections/ExperienceCard";
import DocumentsCard from "@/components/profile/student/sections/DocumentsCard";
import SkillsCard from "@/components/profile/student/sections/SkillsCard";
import CertificationsCard from "@/components/profile/student/sections/CertificationsCard";
import FinancialDetailsCard from "@/components/profile/student/sections/FinancialDetailsCard";
import ResearchCard from "@/components/profile/student/sections/ResearchCard";
import VolunteerCard from "@/components/profile/student/sections/VolunteerCard";
import AchievementsCard from "@/components/profile/student/sections/AchievementsCard";
import SocialLinksCard from "@/components/profile/student/sections/SocialLinksCard";
import AccountSettingsCard from "@/components/profile/student/sections/AccountSettingsCard";

// Modals
import EditProfileHeaderModal from "@/components/profile/student/modals/EditProfileHeaderModal";
import EditPersonalInfoModal from "@/components/profile/student/modals/EditPersonalInfoModal";
import EditAcademicInfoModal from "@/components/profile/student/modals/EditAcademicInfoModal";
import EditExperienceModal from "@/components/profile/student/modals/EditExperienceModal";
import EditDocumentsModal from "@/components/profile/student/modals/EditDocumentsModal";
import EditSkillsModal from "@/components/profile/student/modals/EditSkillsModal";
import EditCertificationsModal from "@/components/profile/student/modals/EditCertificationsModal";
import EditFinancialDetailsModal from "@/components/profile/student/modals/EditFinancialDetailsModal";
import EditResearchModal from "@/components/profile/student/modals/EditResearchModal";
import EditVolunteerModal from "@/components/profile/student/modals/EditVolunteerModal";
import EditAchievementsModal from "@/components/profile/student/modals/EditAchievementsModal";
import EditSocialLinksModal from "@/components/profile/student/modals/EditSocialLinksModal";
import EditAccountSettingsModal from "@/components/profile/student/modals/EditAccountSettingsModal";

type ModalType =
    | "header"
    | "personal"
    | "academic"
    | "experience"
    | "documents"
    | "skills"
    | "certifications"
    | "financial"
    | "research"
    | "volunteer"
    | "achievements"
    | "social"
    | "account"
    | null;

export default function StudentProfilePage() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [profile, setProfile] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<{ type: string; title: string; subtitle: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
 
    const fetchProfileAndDocs = async () => {
        try {
            const [profileData, docsData] = await Promise.all([
                getStudentProfile(),
                getStudentDocuments()
            ]);
            setProfile(profileData);
            setDocuments(docsData);
        } catch (err) {
            console.error("Error loading profile details:", err);
        } finally {
            setIsLoading(false);
        }
    };
 
    useEffect(() => {
        fetchProfileAndDocs();
    }, []);
 
    const closeModal = () => {
        setActiveModal(null);
        setSelectedDoc(null);
    };
 
    const handleSaveProfile = async (data: any) => {
        const updated = await updateStudentProfile(data);
        setProfile(updated);
    };

    const handleUploadClick = (type: string, title: string, subtitle: string) => {
        setSelectedDoc({ type, title, subtitle });
        setActiveModal("documents");
    };

    const handleUploadDocument = async (type: string, file: File) => {
        await uploadStudentDocument(type, file);
        const docsData = await getStudentDocuments();
        setDocuments(docsData);
    };

    const handleDeleteDocument = async (id: string) => {
        await deleteStudentDocument(id);
        const docsData = await getStudentDocuments();
        setDocuments(docsData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Loading student profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

                <StudentProfileHeader profile={profile} onEdit={() => setActiveModal("header")} />

                <PersonalInfoCard profile={profile} onEdit={() => setActiveModal("personal")} />

                <AcademicInfoCard profile={profile} onEdit={() => setActiveModal("academic")} />

                <ExperienceCard profile={profile} onEdit={() => setActiveModal("experience")} />

                <DocumentsCard 
                    documents={documents} 
                    onUploadClick={handleUploadClick} 
                    onDelete={handleDeleteDocument} 
                />

                <SkillsCard profile={profile} onEdit={() => setActiveModal("skills")} />

                <div className="grid grid-cols-1 gap-6">
                    <CertificationsCard profile={profile} onEdit={() => setActiveModal("certifications")} />
                </div>

                <FinancialDetailsCard profile={profile} onEdit={() => setActiveModal("financial")} />

                <ResearchCard profile={profile} onEdit={() => setActiveModal("research")} />

                <VolunteerCard profile={profile} onEdit={() => setActiveModal("volunteer")} />

                <AchievementsCard profile={profile} onEdit={() => setActiveModal("achievements")} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <SocialLinksCard profile={profile} onEdit={() => setActiveModal("social")} />
                    <AccountSettingsCard />
                </div>

            </div>

            <Footer />

            {/* Render Active Modal */}
            {activeModal === "header" && (
                <EditProfileHeaderModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                    onProfileImageUpload={(newImageUrl) => {
                        setProfile((prev: any) => ({
                            ...prev,
                            user: {
                                ...prev.user,
                                profileImage: newImageUrl
                            }
                        }));
                    }}
                />
            )}
            {activeModal === "personal" && (
                <EditPersonalInfoModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "academic" && (
                <EditAcademicInfoModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "experience" && (
                <EditExperienceModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "documents" && selectedDoc && (
                <EditDocumentsModal 
                    docInfo={selectedDoc} 
                    onClose={closeModal} 
                    onUpload={handleUploadDocument} 
                />
            )}
            {activeModal === "skills" && (
                <EditSkillsModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "certifications" && (
                <EditCertificationsModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "financial" && (
                <EditFinancialDetailsModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "research" && (
                <EditResearchModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "volunteer" && (
                <EditVolunteerModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "achievements" && (
                <EditAchievementsModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "social" && (
                <EditSocialLinksModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "account" && <EditAccountSettingsModal onClose={closeModal} />}
        </div>
    );
}
