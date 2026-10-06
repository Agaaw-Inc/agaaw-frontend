"use client";

import Link from "next/link";
import { Clock, GraduationCap, MapPin, Package, Send, Users } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { resolveFileUrl } from "@/lib/api";
import type { MentorCardData } from "@/lib/mentorCards";

/**
 * Who is looking at the card decides its action:
 * - other:   a logged-in admin — "View profile"
 * - student: request mentorship / order a service / status
 */
export type MentorCardViewer =
  | { kind: "other" }
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

/** The one mentor card — the directory and the student dashboard. */
export default function MentorCard({ mentor, viewer }: { mentor: MentorCardData; viewer: MentorCardViewer }) {
  const profileHref = `/profile/mentor/${mentor.id}`;

  return (
    <Card as="article" padding="none" interactive className="flex h-full flex-col overflow-hidden">
      <Link href={profileHref} className="relative block aspect-[4/3] bg-paper-deep" aria-label={`${mentor.name}'s profile`}>
        {mentor.image ? (
          <Avatar src={resolveFileUrl(mentor.image)} name={mentor.name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-ink/20">{initials(mentor.name)}</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={profileHref} className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-[-0.01em] text-ink hover:underline">{mentor.name}</h3>
        </Link>

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

        {mentor.expertise.length > 0 && (
          <p className="mt-3 truncate text-xs font-semibold uppercase tracking-wider text-elm">
            {mentor.expertise.slice(0, 3).join(" · ")}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Actions viewer={viewer} profileHref={profileHref} />
        </div>
      </div>
    </Card>
  );
}

function Actions({ viewer, profileHref }: { viewer: MentorCardViewer; profileHref: string }) {
  const full = "w-full rounded-xl";

  if (viewer.kind !== "student") {
    return (
      <Link href={profileHref} className={buttonClasses({ variant: "outline", size: "sm", className: full })}>
        View profile
      </Link>
    );
  }
  if (viewer.status === "connected") {
    return viewer.onOrder ? (
      <button type="button" onClick={viewer.onOrder} className={buttonClasses({ variant: "brand", size: "sm", className: full })}>
        <Package size={16} /> Order a service
      </button>
    ) : (
      <span className={buttonClasses({ size: "sm", className: `${full} cursor-default bg-seagreen-soft text-forest hover:bg-seagreen-soft` })}>
        <Users size={16} /> Connected
      </span>
    );
  }
  if (viewer.status === "pending") {
    return (
      <span className={buttonClasses({ size: "sm", className: `${full} cursor-default bg-paper-deep text-ink-soft hover:bg-paper-deep` })}>
        <Clock size={16} /> Request sent
      </span>
    );
  }
  return (
    <button type="button" onClick={viewer.onRequest} className={buttonClasses({ size: "sm", className: full })}>
      <Send size={16} /> Request mentorship
    </button>
  );
}
