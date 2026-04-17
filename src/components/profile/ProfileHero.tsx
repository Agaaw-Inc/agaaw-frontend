"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  MessageSquare,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  Sparkles,
  Camera,
  Edit3,
  CheckCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { UserProfile, MentorProfile, StudentProfile } from "@/data/profileTypes";

interface ProfileHeroProps {
  profile: UserProfile;
  isOwner: boolean;
  viewMode: "public" | "own" | "conversation";
}

export default function ProfileHero({ profile, isOwner, viewMode }: ProfileHeroProps) {
  const isMentor = profile.role === "mentor";
  const mentorProfile = isMentor ? (profile as MentorProfile) : null;
  const studentProfile = !isMentor ? (profile as StudentProfile) : null;

  // Completion Tracker Logic
  let completionPercentage = 0;
  let missingItems: { label: string }[] = [];
  
  if (isMentor && isOwner && mentorProfile) {
    const items = [
      { key: 'name', label: 'Full name', isComplete: !!mentorProfile.name },
      { key: 'university', label: 'Currently studying university name', isComplete: !!mentorProfile.university },
      { key: 'department', label: 'Currently studying department', isComplete: !!mentorProfile.department },
      { key: 'country', label: 'Currently studying country', isComplete: !!mentorProfile.country },
      { key: 'services', label: 'Create minimum one service', isComplete: mentorProfile.services && mentorProfile.services.length > 0 },
      { key: 'universityIdCard', label: 'Insert attachment: University ID card', isComplete: !!mentorProfile.universityIdCard },
      { key: 'address', label: 'Address', isComplete: !!mentorProfile.address },
      { key: 'phoneNumber', label: 'Phone number', isComplete: !!mentorProfile.phoneNumber },
      { key: 'expertise', label: 'Expertise filled', isComplete: mentorProfile.expertise && mentorProfile.expertise.length > 0 },
      { key: 'hourly_rate', label: 'Hourly rate', isComplete: typeof mentorProfile.hourly_rate === 'number' },
      { key: 'experience_years', label: 'Experience (years)', isComplete: typeof mentorProfile.experience_years === 'number' },
      { key: 'bio', label: 'Bio', isComplete: !!mentorProfile.bio },
      { key: 'languages', label: 'Languages', isComplete: mentorProfile.languages && mentorProfile.languages.length > 0 },
      { key: 'portfolio_link', label: 'Portfolio link', isComplete: !!mentorProfile.portfolio_link },
    ];
    
    const completedCount = items.filter(i => i.isComplete).length;
    completionPercentage = Math.round((completedCount / items.length) * 100);
    missingItems = items.filter(i => !i.isComplete);
  }

  // Calculate SVG attributes for circular progress
  const radius = 68; // Based on 144px width/height standard
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/3 rounded-full" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Avatar */}
          <div className="relative shrink-0 group flex flex-col items-center">
            {/* Circular Progress (shown only to owner) */}
            {isMentor && isOwner && (
              <div className="absolute inset-[-12px] z-0 pointer-events-none">
                <svg className="w-full h-full -rotate-90 drop-shadow-md">
                  <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="50%" cy="50%" r="48%" 
                    stroke="#10b981" // emerald-500
                    strokeWidth="6" fill="transparent" 
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>
            )}
            
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl z-10 bg-teal-800">
              <Image
                src={profile.image}
                alt={profile.name}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
              {isOwner && (
                <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                </button>
              )}
            </div>

            {/* Percentage Badge */}
            {isMentor && isOwner && (
              <div className="absolute -bottom-2 -right-2 md:bottom-2 md:-right-2 bg-white text-teal-700 font-bold text-sm md:text-base px-2.5 py-0.5 rounded-full shadow-lg border-2 border-teal-500 z-20">
                {completionPercentage}%
              </div>
            )}
            {/* Availability / Status badge */}
            {mentorProfile && (
              <div
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-3 border-white flex items-center justify-center ${
                  mentorProfile.availability === "Available"
                    ? "bg-emerald-400"
                    : mentorProfile.availability === "Busy"
                    ? "bg-amber-400"
                    : "bg-gray-400"
                }`}
              >
                <Sparkles size={11} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
              {mentorProfile?.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium">
                  <CheckCircle size={12} />
                  Verified
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                  isMentor
                    ? "bg-amber-400/20 text-amber-100"
                    : "bg-blue-400/20 text-blue-100"
                }`}
              >
                {isMentor ? "Mentor" : "Student"}
              </span>
            </div>

            {/* University and country */}
            <p className="text-teal-100 font-medium mb-1">
              🎓 {profile.university}
            </p>
            <div className="flex items-center gap-1.5 text-teal-200 text-sm mb-4">
              <MapPin size={14} />
              <span>
                {profile.countryFlag} {profile.country}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-5 md:gap-8">
              {isMentor && mentorProfile && (
                <>
                  <StatItem
                    icon={Users}
                    value={String(mentorProfile.stats.studentsHelped)}
                    label="Students"
                  />
                  <StatItem
                    icon={Star}
                    value={`${mentorProfile.stats.rating} ★`}
                    label={`${mentorProfile.stats.totalReviews} reviews`}
                  />
                  <StatItem
                    icon={CalendarCheck}
                    value={String(mentorProfile.stats.sessions)}
                    label="Sessions"
                  />
                  <StatItem
                    icon={Clock}
                    value={`${mentorProfile.stats.responseRate}%`}
                    label="Response"
                  />
                </>
              )}
              {!isMentor && studentProfile && (
                <>
                  <StatItem
                    icon={BookOpen}
                    value={String(studentProfile.stats.applicationsSubmitted)}
                    label="Applications"
                  />
                  <StatItem
                    icon={Users}
                    value={String(studentProfile.stats.mentorsConnected)}
                    label="Mentors"
                  />
                  <StatItem
                    icon={GraduationCap}
                    value={String(studentProfile.stats.scholarshipsTracked)}
                    label="Scholarships"
                  />
                </>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            {isOwner ? (
              <Link
                href="/my-profile"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-teal-700 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm w-full md:w-auto"
              >
                <Edit3 size={15} />
                Edit Profile
              </Link>
            ) : (
              <>
                {viewMode !== "conversation" && (
                  <>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-teal-700 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm flex-1 md:flex-none"
                    >
                      <MessageSquare size={15} />
                      Contact
                    </Link>
                    {isMentor && (
                      <Link
                        href="#"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-400 text-amber-900 rounded-xl font-semibold text-sm hover:bg-amber-300 transition-colors shadow-sm flex-1 md:flex-none"
                      >
                        <Sparkles size={15} />
                        Hire Mentor
                      </Link>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Missing Profile Items */}
    {isMentor && isOwner && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        {completionPercentage === 100 ? (
          <div className="text-center p-4">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-900">100% Profile Completion</h3>
            <p className="text-sm text-gray-500 mt-1">Your profile is complete! Once verified by an admin, the verified badge will appear.</p>
          </div>
        ) : (
          <>
            <div className="text-center pb-2 border-b border-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{completionPercentage}% Profile Completion</h3>
              <p className="text-sm text-gray-500 mt-1">Complete your profile to 100% to get verified by an admin.</p>
            </div>
            {missingItems.length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} />
                  Missing Requirements ({missingItems.length})
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {missingItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                      <ChevronRight size={14} className="mt-0.5 shrink-0" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    )}
    </div>
  );
}

// ─── Stat Item helper ────────────────────────────────────────────

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={14} className="text-teal-200" />
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
      <p className="text-xs text-teal-200">{label}</p>
    </div>
  );
}
