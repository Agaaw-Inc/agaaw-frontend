"use client";

import React, { useState } from "react";
import Footer from "@/components/landing/Footer";

// Sections
import MentorProfileHeader from "@/components/profile/mentor/sections/MentorProfileHeader";
import ProfileCompletionBar from "@/components/profile/mentor/sections/ProfileCompletionBar";
import MentorAboutCard from "@/components/profile/mentor/sections/MentorAboutCard";
import MentorDetailsCard from "@/components/profile/mentor/sections/MentorDetailsCard";
import MentorExpertiseCard from "@/components/profile/mentor/sections/MentorExpertiseCard";
import MentorServicesCard from "@/components/profile/mentor/sections/MentorServicesCard";
import MentorReviewsCard from "@/components/profile/mentor/sections/MentorReviewsCard";
import MentorBlogPostsCard from "@/components/profile/mentor/sections/MentorBlogPostsCard";
import MentorDocumentsCard from "@/components/profile/mentor/sections/MentorDocumentsCard";
import MentorAchievementsCard from "@/components/profile/mentor/sections/MentorAchievementsCard";

// Modals
import EditMentorHeaderModal from "@/components/profile/mentor/modals/EditMentorHeaderModal";
import EditMentorAboutModal from "@/components/profile/mentor/modals/EditMentorAboutModal";
import EditMentorDetailsModal from "@/components/profile/mentor/modals/EditMentorDetailsModal";
import EditMentorExpertiseModal from "@/components/profile/mentor/modals/EditMentorExpertiseModal";
import EditMentorServicesModal from "@/components/profile/mentor/modals/EditMentorServicesModal";
import EditMentorAchievementsModal from "@/components/profile/mentor/modals/EditMentorAchievementsModal";

type ModalType = 
  | "header" 
  | "about" 
  | "details" 
  | "expertise" 
  | "services" 
  | "achievements"
  | null;

export default function MentorProfilePage() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const closeModal = () => setActiveModal(null);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                
                {/* Header Section */}
                <MentorProfileHeader onEdit={() => setActiveModal("header")} />

                {/* Profile Completion */}
                <ProfileCompletionBar percentage={85} />

                {/* Row Cards (Stacked Layout like Student Profile) */}
                <MentorAboutCard onEdit={() => setActiveModal("about")} />
                
                <MentorDetailsCard onEdit={() => setActiveModal("details")} />

                <MentorExpertiseCard onEdit={() => setActiveModal("expertise")} />
                
                <MentorAchievementsCard onEdit={() => setActiveModal("achievements")} />

                <MentorDocumentsCard />

                <MentorServicesCard onEdit={() => setActiveModal("services")} />
                
                <MentorReviewsCard />
                
                <MentorBlogPostsCard />

            </div>

            <Footer />

            {/* Render Active Edit Modals */}
            {activeModal === "header" && <EditMentorHeaderModal onClose={closeModal} />}
            {activeModal === "about" && <EditMentorAboutModal onClose={closeModal} />}
            {activeModal === "details" && <EditMentorDetailsModal onClose={closeModal} />}
            {activeModal === "expertise" && <EditMentorExpertiseModal onClose={closeModal} />}
            {activeModal === "services" && <EditMentorServicesModal onClose={closeModal} />}
            {activeModal === "achievements" && <EditMentorAchievementsModal onClose={closeModal} />}
        </div>
    );
}
