"use client";

import { Check, Lock } from "lucide-react";
import MentorCard from "@/components/mentors/MentorCard";
import { ButtonLink } from "@/components/ui/Button";
import { fromPublicCard } from "@/lib/mentorCards";
import type { PublicMentorCard } from "@/lib/categories";
import SectionHeading from "@/components/ui/SectionHeading";

const UNLOCKS = [
  "Their full story — where they studied or worked, and how they got there",
  "The services they offer, with prices in taka",
  "Reviews from students they've helped",
  "Sending a mentorship request and messaging them",
];

/**
 * What a logged-out visitor sees when they open a mentor's profile: the
 * public card, what an account unlocks, and a way back here after signing up.
 */
export default function GuestProfileGate({ mentor, returnTo }: { mentor: PublicMentorCard | null; returnTo: string }) {
  const login = `/login?redirect=${encodeURIComponent(returnTo)}`;

  return (
    <main className="flex-grow bg-paper">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:py-24">
        {/* The part anyone may see — the same card as the directory */}
        {mentor && <MentorCard mentor={fromPublicCard(mentor)} viewer={{ kind: "preview" }} />}

        {/* The part that needs an account */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon">
            <Lock size={13} /> Members only
          </span>
          <SectionHeading
            className="mt-4"
            title={`Create a free account to see ${mentor ? `${mentor.firstName}'s` : "the"} full profile`}
          />
          <ul className="mt-6 space-y-3">
            {UNLOCKS.map((item) => (
              <li key={item} className="flex gap-3 text-ink-soft">
                <Check size={18} className="mt-0.5 shrink-0 text-elm" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register/student">Create free account</ButtonLink>
            <ButtonLink href={login} variant="outline">
              I already have one
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-soft">Signing up is free. You only pay when you order a service.</p>
        </div>
      </div>
    </main>
  );
}
