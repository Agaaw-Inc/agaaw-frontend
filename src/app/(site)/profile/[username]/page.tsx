"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import ProfilePage from "@/components/profile/ProfilePage";
import {
  getProfileByUsername,
  CURRENT_USER_USERNAME,
  CURRENT_USER_ROLE,
} from "@/lib/mock/profileData";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const profile = getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const isOwner = username === CURRENT_USER_USERNAME;

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <ProfilePage
            profile={profile}
            viewMode="public"
            isOwner={isOwner}
            currentUserUsername={CURRENT_USER_USERNAME}
            currentUserRole={CURRENT_USER_ROLE}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
