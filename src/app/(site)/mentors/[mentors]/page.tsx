"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

// This dynamic route has been replaced by /profile/:username.
// Redirect old mentor links to the new unified profile system.
export default function MentorRedirectPage() {
  const params = useParams();
  const mentorSlug = params.mentors as string;
  redirect(`/profile/${mentorSlug}`);
}
