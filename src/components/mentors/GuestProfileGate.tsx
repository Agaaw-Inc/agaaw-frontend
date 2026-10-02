"use client";

import Link from "next/link";
import { BadgeCheck, Check, GraduationCap, Lock, MapPin, Star } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import type { PublicMentorCard } from "@/lib/categories";

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
  const name = mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "this mentor";
  const login = `/login?redirect=${encodeURIComponent(returnTo)}`;

  return (
    <main className="flex-grow bg-paper">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:py-24">
        {/* The part anyone may see */}
        {mentor && (
          <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-ink/10">
            <div className="relative aspect-[4/3] bg-paper-deep">
              {mentor.profileImage ? (
                <Avatar src={resolveFileUrl(mentor.profileImage)} name={name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-6xl font-extrabold text-ink/20">
                  {mentor.firstName[0]}
                  {mentor.lastName[0]}
                </span>
              )}
              {mentor.identityVerified && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-elm">
                  <BadgeCheck size={14} /> ID verified
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink">{name}</h1>
                {mentor.rating.average !== null && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    <Star size={14} className="fill-ink" /> {mentor.rating.average.toFixed(1)}
                    <span className="font-normal text-ink-soft">({mentor.rating.count})</span>
                  </span>
                )}
              </div>
              {mentor.subject && <p className="text-ink-soft">{mentor.subject}</p>}
              <div className="mt-3 space-y-1 text-sm text-ink-soft">
                {mentor.currentUniversity && (
                  <p className="flex items-center gap-1.5">
                    <GraduationCap size={15} /> {mentor.currentUniversity}
                  </p>
                )}
                {mentor.countryName && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={15} /> {mentor.countryName}
                  </p>
                )}
              </div>
              {mentor.categories.length > 0 && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-elm">
                  {mentor.categories.map((c) => c.name).join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* The part that needs an account */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon">
            <Lock size={13} /> Members only
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Create a free account to see {mentor ? mentor.firstName : "the"}&apos;s full profile
          </h2>
          <ul className="mt-6 space-y-3">
            {UNLOCKS.map((item) => (
              <li key={item} className="flex gap-3 text-ink-soft">
                <Check size={18} className="mt-0.5 shrink-0 text-elm" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register/student" className="rounded-full bg-ink px-6 py-3 font-semibold text-white hover:bg-forest">
              Create free account
            </Link>
            <Link href={login} className="rounded-full border-2 border-ink/15 px-6 py-2.5 font-semibold text-ink hover:border-ink">
              I already have one
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-soft">Signing up is free. You only pay when you order a service.</p>
        </div>
      </div>
    </main>
  );
}
