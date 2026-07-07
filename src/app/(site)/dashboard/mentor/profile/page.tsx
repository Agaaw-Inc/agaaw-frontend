"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/landing/Footer";
import { 
    getMentorProfile, 
    updateMentorProfile, 
    getMentorDocuments, 
    uploadMentorDocument, 
    deleteMentorDocument,
    getMentorBlogs
} from "@/lib/api";
import { Loader2 } from "lucide-react";
import { calculateMentorProfileCompletion } from "@/lib/mentorProfileUtils";

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
import EditDocumentsModal from "@/components/profile/student/modals/EditDocumentsModal";

type ModalType = 
  | "header" 
  | "about" 
  | "details" 
  | "expertise" 
  | "services" 
  | "achievements"
  | "documents"
  | null;

export default function MentorProfilePage() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [profile, setProfile] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<{ type: string; title: string; subtitle: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfileAndDocs = async () => {
        try {
            const [profileData, docsData, blogsData] = await Promise.all([
                getMentorProfile(),
                getMentorDocuments(),
                getMentorBlogs()
            ]);
            setProfile(profileData);
            setDocuments(docsData);
            setBlogs(blogsData);
        } catch (err) {
            console.error("Error loading mentor profile or documents:", err);
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
        try {
            const updated = await updateMentorProfile(data);
            setProfile(updated);
        } catch (err) {
            console.error("Error updating profile:", err);
            throw err;
        }
    };

    const handleUploadClick = (type: string, title: string, subtitle: string) => {
        setSelectedDoc({ type, title, subtitle });
        setActiveModal("documents");
    };

    const handleUploadDocument = async (type: string, file: File) => {
        try {
            await uploadMentorDocument(type, file);
            const docsData = await getMentorDocuments();
            setDocuments(docsData);
        } catch (err) {
            console.error("Error uploading mentor document:", err);
            throw err;
        }
    };

    const handleDeleteDocument = async (id: string) => {
        try {
            await deleteMentorDocument(id);
            const docsData = await getMentorDocuments();
            setDocuments(docsData);
        } catch (err) {
            console.error("Error deleting mentor document:", err);
            alert("Failed to delete document. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
                <p className="text-sm font-semibold text-gray-500">Loading mentor profile...</p>
            </div>
        );
    }

    const { percentage, missingItems } = calculateMentorProfileCompletion(profile, documents);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                
                {/* Header Section */}
                <MentorProfileHeader profile={profile} onEdit={() => setActiveModal("header")} />

                {/* Profile Completion */}
                <ProfileCompletionBar percentage={percentage} missingItems={missingItems} />

                {/* Row Cards (Stacked Layout like Student Profile) */}
                <MentorAboutCard profile={profile} onEdit={() => setActiveModal("about")} />
                
                <MentorDetailsCard profile={profile} onEdit={() => setActiveModal("details")} />

                <MentorExpertiseCard profile={profile} onEdit={() => setActiveModal("expertise")} />
                
                <MentorAchievementsCard profile={profile} onEdit={() => setActiveModal("achievements")} />

                <MentorDocumentsCard 
                    documents={documents} 
                    onUploadClick={handleUploadClick} 
                    onDelete={handleDeleteDocument} 
                />

                <MentorServicesCard profile={profile} onEdit={() => setActiveModal("services")} />
                
                <MentorReviewsCard profile={profile} />
                
                <MentorBlogPostsCard blogs={blogs} />

            </div>

            <Footer />

            {/* Render Active Edit Modals */}
            {activeModal === "header" && (
                <EditMentorHeaderModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "about" && (
                <EditMentorAboutModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "details" && (
                <EditMentorDetailsModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "expertise" && (
                <EditMentorExpertiseModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "services" && (
                <EditMentorServicesModal 
                    profile={profile} 
                    onClose={closeModal} 
                    onSave={handleSaveProfile} 
                />
            )}
            {activeModal === "achievements" && (
                <EditMentorAchievementsModal 
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
        </div>
    );
}
