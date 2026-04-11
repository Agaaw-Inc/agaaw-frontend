"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/layout/DashboardNavbar";
import ProfilePage from "@/components/profile/ProfilePage";
import {
  getConversationById,
  getProfileByUsername,
  CURRENT_USER_USERNAME,
  CURRENT_USER_ROLE,
} from "@/lib/mock/profileData";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const conversation = getConversationById(conversationId);

  if (!conversation) {
    notFound();
  }

  // Determine the "other party" profile to display
  const otherUsername =
    CURRENT_USER_ROLE === "student"
      ? conversation.participants.mentorUsername
      : conversation.participants.studentUsername;

  const otherProfile = getProfileByUsername(otherUsername);

  if (!otherProfile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <DashboardNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ProfilePage
          profile={otherProfile}
          viewMode="conversation"
          isOwner={false}
          conversation={conversation}
          currentUserUsername={CURRENT_USER_USERNAME}
          currentUserRole={CURRENT_USER_ROLE}
        />
      </main>
    </div>
  );
}
