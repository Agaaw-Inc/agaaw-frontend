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

// Redesigned Student sections
import StudentProfileHeader from "./student/sections/StudentProfileHeader";
import PersonalInfoCard from "./student/sections/PersonalInfoCard";
import AcademicInfoCard from "./student/sections/AcademicInfoCard";
import ExperienceCard from "./student/sections/ExperienceCard";
import DocumentsCard from "./student/sections/DocumentsCard";
import SkillsCard from "./student/sections/SkillsCard";
import CertificationsCard from "./student/sections/CertificationsCard";
import FinancialDetailsCard from "./student/sections/FinancialDetailsCard";
import ResearchCard from "./student/sections/ResearchCard";
import VolunteerCard from "./student/sections/VolunteerCard";
import AchievementsCard from "./student/sections/AchievementsCard";
import SocialLinksCard from "./student/sections/SocialLinksCard";

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

  // Adapt mock StudentProfile to DB schema shape expected by cards
  const adaptedStudentProfile = studentProfile ? {
    user: {
      firstName: studentProfile.name.split(" ")[0] || "",
      lastName: studentProfile.name.split(" ").slice(1).join(" ") || "",
      profileImage: studentProfile.image,
      email: `${studentProfile.username}@gmail.com`,
      isVerified: true,
    },
    nationality: studentProfile.country,
    studyLevel: studentProfile.goals?.targetDegree || "phd",
    fieldOfInterest: studentProfile.interests?.[0] || "Computer Science",
    bio: studentProfile.bio,
    gender: "Male",
    phone: "+880 1712-345678",
    dateOfBirth: "2003-05-15",
    
    // Academic Info Card
    institution: studentProfile.education?.[0]?.institution || studentProfile.university || "University of Dhaka",
    degreeLevel: studentProfile.education?.[0]?.degree || studentProfile.goals?.targetDegree || "Bachelor's",
    department: studentProfile.education?.[0]?.field || studentProfile.interests?.[0] || "Computer Science",
    studentId: "2020-813-045",
    currentSemester: "8th Semester",
    expectedGraduation: studentProfile.education?.[0]?.year || studentProfile.goals?.timeline || "2026",
    cgpa: "3.85",
    cgpaScale: "4.00",
    ranking: "Top 5%",

    // Other details
    skills: studentProfile.interests || [],
    experience: [
      {
        id: "exp-1",
        title: "Research Assistant",
        company: "AI & ML Research Group",
        location: studentProfile.university || "Dhaka, Bangladesh",
        startDate: "2024",
        endDate: "Present",
        description: "- Developed machine learning models for vision applications\n- Contributed to open-source project development\n- Wrote draft research manuscript"
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Deep Learning Specialization",
        organization: "DeepLearning.AI",
        issueDate: "2025",
        url: "#"
      }
    ],
    financialDetails: {
      annualIncome: "650,000",
      guardianName: "Md. Rafiqul Islam",
      incomeSource: "Business",
      relation: "Father",
      occupation: "Merchant",
      phone: "+880 1555-555555"
    },
    research: [
      {
        id: "res-1",
        title: "Optimized Computer Vision Architectures",
        publishedIn: "IEEE Access (Under Review)",
        publicationDate: "2025",
        abstract: "This research proposes a highly-efficient convolutional architecture tailored for edge computing platforms."
      }
    ],
    volunteer: [
      {
        id: "vol-1",
        role: "Event Coordinator",
        organization: "Dhaka University IT Club",
        location: "Dhaka",
        startDate: "2023",
        endDate: "2024",
        description: "Organized national programming contests and tech hackathons."
      }
    ],
    achievements: [
      {
        id: "ach-1",
        title: "Dean's Excellence Award",
        issuer: "University Faculty",
        icon: "🏆"
      }
    ],
    socialLinks: [
      { id: "soc-1", platform: "GitHub", url: `github.com/${studentProfile.username}` },
      { id: "soc-2", platform: "LinkedIn", url: `linkedin.com/in/${studentProfile.username}` }
    ],
    testScores: studentProfile.testScores?.map((ts) => {
      if (ts.name.toLowerCase() === "ielts") {
        return {
          testType: "ielts",
          score: JSON.stringify({
            overall: ts.score,
            listening: "8.0",
            reading: "7.5",
            writing: "7.0",
            speaking: "7.5"
          })
        };
      }
      return {
        testType: ts.name.toLowerCase(),
        score: ts.score
      };
    }) || []
  } : null;

  // Mock documents adapted from student name
  const adaptedDocuments = studentProfile ? [
    { id: "doc-1", type: "transcript", fileName: `${studentProfile.username}_Academic_Transcript.pdf`, fileUrl: "#", createdAt: "2026-01-10T10:00:00Z" },
    { id: "doc-2", type: "certificate", fileName: `${studentProfile.username}_Student_ID.jpg`, fileUrl: "#", createdAt: "2026-01-12T12:00:00Z" },
    { id: "doc-3", type: "lor", fileName: `Recommendation_Letter_CS_Dept.pdf`, fileUrl: "#", createdAt: "2026-02-15T09:00:00Z" },
    { id: "doc-4", type: "cv", fileName: `${studentProfile.username}_CV_Resume.pdf`, fileUrl: "#", createdAt: "2026-03-01T14:30:00Z" }
  ] : [];

  // ─── Profile Content (shared across all modes) ───────────────
  const profileContent = (
    <div className="space-y-6">
      {/* Mentor Content */}
      {isMentor && mentorProfile && (
        <>
          <ProfileHero profile={profile} isOwner={isOwner} viewMode={viewMode} />
          <AboutSection bio={profile.bio} isOwner={isOwner} />
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
            department={mentorProfile.department}
            universityIdCard={mentorProfile.universityIdCard}
            address={mentorProfile.address}
            eduMail={mentorProfile.eduMail}
            phoneNumber={mentorProfile.phoneNumber}
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
            username={mentorProfile.username}
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

      {/* Student Content (Redesigned with beautiful modern cards) */}
      {!isMentor && adaptedStudentProfile && (
        <>
          <StudentProfileHeader profile={adaptedStudentProfile} />
          <PersonalInfoCard profile={adaptedStudentProfile} />
          <AcademicInfoCard profile={adaptedStudentProfile} />
          <ExperienceCard profile={adaptedStudentProfile} />
          <DocumentsCard documents={adaptedDocuments} />
          <SkillsCard profile={adaptedStudentProfile} />
          <div className="grid grid-cols-1 gap-6">
            <CertificationsCard profile={adaptedStudentProfile} />
          </div>
          <FinancialDetailsCard profile={adaptedStudentProfile} />
          <ResearchCard profile={adaptedStudentProfile} />
          <VolunteerCard profile={adaptedStudentProfile} />
          <AchievementsCard profile={adaptedStudentProfile} />
          <SocialLinksCard profile={adaptedStudentProfile} />
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
