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

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/3 rounded-full" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src={profile.image}
                alt={profile.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            {isOwner && (
              <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
              </button>
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
