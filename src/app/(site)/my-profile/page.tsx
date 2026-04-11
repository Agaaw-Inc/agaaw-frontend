"use client";

import ProfilePage from "@/components/profile/ProfilePage";
import {
  getProfileByUsername,
  CURRENT_USER_USERNAME,
  CURRENT_USER_ROLE,
} from "@/lib/mock/profileData";

export default function MyProfilePage() {
  const profile = getProfileByUsername(CURRENT_USER_USERNAME);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <ProfilePage
          profile={profile}
          viewMode="own"
          isOwner={true}
          currentUserUsername={CURRENT_USER_USERNAME}
          currentUserRole={CURRENT_USER_ROLE}
        />
      </main>
    </div>
  );
}
