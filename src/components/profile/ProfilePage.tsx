"use client";

import type {
  UserProfile,
  MentorProfile,
  StudentProfile,
  ProfileViewMode,
  Conversation,
} from "@/data/profileTypes";

import ProfileHero from "./ProfileHero";
import AboutSection from "./AboutSection";
import MentorInfoSection from "./MentorInfoSection";
import ExpertiseSection from "./ExpertiseSection";
import ServicesSection from "./ServicesSection";
import ReviewsSection from "./ReviewsSection";
import BlogPostsSection from "./BlogPostsSection";
import AcademicSection from "./AcademicSection";
import GoalsSection from "./GoalsSection";
import ConversationPanel from "./ConversationPanel";
import ActionPanel from "./ActionPanel";

interface ProfilePageProps {
  profile: UserProfile;
  viewMode: ProfileViewMode;
  isOwner: boolean;
  conversation?: Conversation;
  currentUserUsername?: string;
  currentUserRole?: "mentor" | "student";
}

export default function ProfilePage({
  profile,
  viewMode,
  isOwner,
  conversation,
  currentUserUsername = "",
  currentUserRole = "student",
}: ProfilePageProps) {
  const isMentor = profile.role === "mentor";
  const mentorProfile = isMentor ? (profile as MentorProfile) : null;
  const studentProfile = !isMentor ? (profile as StudentProfile) : null;

  const isConversation = viewMode === "conversation";

  // ─── Profile Content (shared across all modes) ───────────────
  const profileContent = (
    <div className="space-y-6">
      {/* Hero */}
      <ProfileHero profile={profile} isOwner={isOwner} viewMode={viewMode} />

      {/* About */}
      <AboutSection bio={profile.bio} isOwner={isOwner} />

      {/* Mentor-specific sections */}
      {isMentor && mentorProfile && (
        <>
          <MentorInfoSection
            university={mentorProfile.university}
            country={mentorProfile.country}
            countryFlag={mentorProfile.countryFlag}
            experience_years={mentorProfile.experience_years}
            hourly_rate={mentorProfile.hourly_rate}
            portfolio_link={mentorProfile.portfolio_link}
            languages={mentorProfile.languages}
            is_available={mentorProfile.is_available}
            bio={mentorProfile.bio}
            isOwner={isOwner}
          />
          <ExpertiseSection
            expertise={mentorProfile.expertise}
            isOwner={isOwner}
          />
          <ServicesSection
            services={mentorProfile.services}
            isOwner={isOwner}
          />
          <ReviewsSection
            reviews={mentorProfile.reviews}
            averageRating={mentorProfile.stats.rating}
            totalReviews={mentorProfile.stats.totalReviews}
            isOwner={isOwner}
          />
          <BlogPostsSection
            blogIds={mentorProfile.blogIds}
            isOwner={isOwner}
          />
        </>
      )}

      {/* Student-specific sections */}
      {!isMentor && studentProfile && (
        <>
          <AcademicSection
            education={studentProfile.education}
            testScores={studentProfile.testScores}
            isOwner={isOwner}
          />
          <GoalsSection
            goals={studentProfile.goals}
            interests={studentProfile.interests}
            isOwner={isOwner}
          />
        </>
      )}
    </div>
  );

  // ─── Conversation Layout (split panel) ───────────────────────
  if (isConversation && conversation) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile side (60%) */}
        <div className="lg:col-span-3">{profileContent}</div>

        {/* Conversation side (40%) */}
        <div className="lg:col-span-2 space-y-6">
          <ConversationPanel
            messages={conversation.messages}
            currentUserUsername={currentUserUsername}
          />
          <ActionPanel
            conversation={conversation}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>
    );
  }

  // ─── Standard Layout (public / own) ──────────────────────────
  return profileContent;
}
