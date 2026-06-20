"use client";

import React, { useState } from "react";
import Footer from "@/components/landing/Footer";

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

    const closeModal = () => setActiveModal(null);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">

                <StudentProfileHeader onEdit={() => setActiveModal("header")} />

                <PersonalInfoCard onEdit={() => setActiveModal("personal")} />

                <AcademicInfoCard onEdit={() => setActiveModal("academic")} />

                <ExperienceCard onEdit={() => setActiveModal("experience")} />

                {/* Documents Card typically has inline actions, but we can pass a dummy edit handler */}
                <DocumentsCard />

                <SkillsCard onEdit={() => setActiveModal("skills")} />

                <div className="grid grid-cols-1 gap-6">
                    <CertificationsCard onEdit={() => setActiveModal("certifications")} />
                </div>

                <FinancialDetailsCard onEdit={() => setActiveModal("financial")} />

                <ResearchCard onEdit={() => setActiveModal("research")} />

                <VolunteerCard onEdit={() => setActiveModal("volunteer")} />

                <AchievementsCard onEdit={() => setActiveModal("achievements")} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <SocialLinksCard onEdit={() => setActiveModal("social")} />
                    <AccountSettingsCard />
                </div>

            </div>

            <Footer />

            {/* Render Active Modal */}
            {activeModal === "header" && <EditProfileHeaderModal onClose={closeModal} />}
            {activeModal === "personal" && <EditPersonalInfoModal onClose={closeModal} />}
            {activeModal === "academic" && <EditAcademicInfoModal onClose={closeModal} />}
            {activeModal === "experience" && <EditExperienceModal onClose={closeModal} />}
            {activeModal === "documents" && <EditDocumentsModal onClose={closeModal} />}
            {activeModal === "skills" && <EditSkillsModal onClose={closeModal} />}
            {activeModal === "certifications" && <EditCertificationsModal onClose={closeModal} />}
            {activeModal === "financial" && <EditFinancialDetailsModal onClose={closeModal} />}
            {activeModal === "research" && <EditResearchModal onClose={closeModal} />}
            {activeModal === "volunteer" && <EditVolunteerModal onClose={closeModal} />}
            {activeModal === "achievements" && <EditAchievementsModal onClose={closeModal} />}
            {activeModal === "social" && <EditSocialLinksModal onClose={closeModal} />}
            {activeModal === "account" && <EditAccountSettingsModal onClose={closeModal} />}
        </div>
    );
}
