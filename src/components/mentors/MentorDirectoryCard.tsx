"use client";

import Link from "next/link";
import { BadgeCheck, Clock, GraduationCap, MapPin, Package, Send, Star, Users } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import type { MentorRating } from "@/lib/categories";

/** One shape for both directory sources (public cards and the student list). */
export interface DirectoryMentor {
  id: string;
  name: string;
  image: string | null;
  university: string | null;
  country: string | null;
  subject: string | null;
  expertise: string[];
  categories: { slug: string; name: string }[];
  identityVerified: boolean;
  rating: MentorRating;
}

export type DirectoryViewer =
  | { kind: "guest" }
  | { kind: "other" } // a logged-in mentor or admin — can look, can't book
  | {
      kind: "student";
      status: "none" | "pending" | "connected";
      onRequest: () => void;
      onOrder?: () => void;
    };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MentorDirectoryCard({ mentor, viewer }: { mentor: DirectoryMentor; viewer: DirectoryViewer }) {
  // One link for everyone. For guests the profile page shows a sign-up /
  // log-in screen instead of the profile, and brings them back after.
  const profileHref = `/profile/mentor/${mentor.id}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-ink/10 transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(20,24,22,0.25)]">
      <Link href={profileHref} className="relative block aspect-[4/3] bg-paper-deep" aria-label={`${mentor.name}'s profile`}>
        {mentor.image ? (
          <Avatar src={resolveFileUrl(mentor.image)} name={mentor.name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-5xl font-extrabold text-ink/20">
            {initials(mentor.name)}
          </span>
        )}
        {mentor.identityVerified && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-elm">
            <BadgeCheck size={14} /> ID verified
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={profileHref} className="min-w-0">
            <h3 className="truncate font-display text-lg font-bold tracking-[-0.01em] text-ink hover:underline">{mentor.name}</h3>
          </Link>
          {mentor.rating.average !== null && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink" title={`${mentor.rating.count} reviews`}>
              <Star size={14} className="fill-ink text-ink" />
              {mentor.rating.average.toFixed(1)}
              <span className="font-normal text-ink-soft">({mentor.rating.count})</span>
            </span>
          )}
        </div>
        {mentor.subject && <p className="truncate text-sm text-ink-soft">{mentor.subject}</p>}

        <div className="mt-3 space-y-1 text-sm text-ink-soft">
          {mentor.university && (
            <p className="flex items-center gap-1.5">
              <GraduationCap size={15} className="shrink-0" />
              <span className="truncate">{mentor.university}</span>
            </p>
          )}
          {mentor.country && (
            <p className="flex items-center gap-1.5">
              <MapPin size={15} className="shrink-0" />
              <span className="truncate">{mentor.country}</span>
            </p>
          )}
        </div>

        {mentor.categories.length > 0 && (
          <p className="mt-3 truncate text-xs font-semibold uppercase tracking-wider text-elm">
            {mentor.categories.map((c) => c.name).join(" · ")}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Actions viewer={viewer} profileHref={profileHref} />
        </div>
      </div>
    </article>
  );
}

function Actions({ viewer, profileHref }: { viewer: DirectoryViewer; profileHref: string }) {
  const primary = "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors";

  if (viewer.kind !== "student") {
    return (
      <Link href={profileHref} className={`${primary} border-2 border-ink/15 text-ink hover:border-ink`}>
        {viewer.kind === "guest" ? "Sign up to view profile" : "View profile"}
      </Link>
    );
  }
  if (viewer.status === "connected") {
    return viewer.onOrder ? (
      <button type="button" onClick={viewer.onOrder} className={`${primary} bg-elm text-white hover:bg-elm-dark`}>
        <Package size={16} /> Order a service
      </button>
    ) : (
      <span className={`${primary} bg-seagreen-soft text-forest`}>
        <Users size={16} /> Connected
      </span>
    );
  }
  if (viewer.status === "pending") {
    return (
      <span className={`${primary} cursor-default bg-paper-deep text-ink-soft`}>
        <Clock size={16} /> Request sent
      </span>
    );
  }
  return (
    <button type="button" onClick={viewer.onRequest} className={`${primary} bg-ink text-white hover:bg-forest`}>
      <Send size={16} /> Request mentorship
    </button>
  );
}
