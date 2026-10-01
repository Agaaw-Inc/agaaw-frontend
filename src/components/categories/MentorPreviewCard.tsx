import Link from "next/link";
import { BadgeCheck, GraduationCap, MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import type { CategoryMentorPreview } from "@/lib/categories";

/**
 * A mentor on a public category page: face first, then where they studied or
 * work. Clicking through needs an account — the full profile is for students.
 */
export default function MentorPreviewCard({ mentor }: { mentor: CategoryMentorPreview }) {
  const name = `${mentor.firstName} ${mentor.lastName}`.trim();

  return (
    <Link
      href={`/profile/mentor/${mentor.id}`}
      className="group flex flex-col overflow-hidden rounded-[24px] bg-card ring-1 ring-ink/10 transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-paper-deep">
        {mentor.profileImage ? (
          <Avatar src={resolveFileUrl(mentor.profileImage)} name={name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-5xl font-extrabold text-ink/25">
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
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl font-bold tracking-[-0.01em] text-ink">{name}</p>
        {mentor.subject && <p className="text-sm text-ink-soft">{mentor.subject}</p>}
        <div className="mt-3 space-y-1 text-sm text-ink-soft">
          {mentor.currentUniversity && (
            <p className="flex items-center gap-1.5">
              <GraduationCap size={15} className="shrink-0" /> <span className="truncate">{mentor.currentUniversity}</span>
            </p>
          )}
          {mentor.countryName && (
            <p className="flex items-center gap-1.5">
              <MapPin size={15} className="shrink-0" /> <span className="truncate">{mentor.countryName}</span>
            </p>
          )}
        </div>
        <span className="mt-auto pt-4 text-sm font-semibold text-elm group-hover:underline">View profile →</span>
      </div>
    </Link>
  );
}
