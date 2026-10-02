"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MentorDirectoryCard, { type DirectoryMentor } from "@/components/mentors/MentorDirectoryCard";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import type { ConnectionItem } from "@/lib/api";
import type { Category } from "@/lib/categories";

const SHOW = 4;

interface SuggestedMentorsProps {
  mentors: DirectoryMentor[];
  myCategories: Category[];
  connections: ConnectionItem[];
  pendingMentorIds: Set<string>;
  isLoading: boolean;
}

/**
 * Mentors in the categories this student chose, best-rated first, leaving
 * out mentors they're already working with.
 */
export default function SuggestedMentors({ mentors, myCategories, connections, pendingMentorIds, isLoading }: SuggestedMentorsProps) {
  const { toast, showToast, hideToast } = useToast();
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);

  const slugs = useMemo(() => new Set(myCategories.map((c) => c.slug)), [myCategories]);
  const connected = useMemo(() => new Set(connections.map((c) => c.counterpart.id)), [connections]);

  const suggestions = useMemo(
    () =>
      mentors
        .filter((m) => !connected.has(m.id))
        .filter((m) => slugs.size === 0 || m.categories.some((c) => slugs.has(c.slug)))
        .sort(
          (a, b) =>
            (b.rating.average ?? 0) - (a.rating.average ?? 0) ||
            b.rating.count - a.rating.count ||
            Number(b.identityVerified) - Number(a.identityVerified)
        )
        .slice(0, SHOW),
    [mentors, slugs, connected]
  );

  const seeAllHref = myCategories.length === 1 ? `/mentors?category=${myCategories[0].slug}` : "/mentors";

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">Mentors for you</h2>
          {myCategories.length > 0 && (
            <p className="text-sm text-ink-soft">In {myCategories.map((c) => c.name.toLowerCase()).join(", ")}</p>
          )}
        </div>
        <Link href={seeAllHref} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink hover:underline">
          See all <ArrowRight size={15} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-paper-deep" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink/15 px-6 py-10 text-center">
          <p className="font-display text-lg font-bold text-ink">No new mentors in your areas yet</p>
          <p className="mt-1 text-sm text-ink-soft">New mentors join every week. Meanwhile, browse everyone.</p>
          <Link href="/mentors" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-forest">
            Browse all mentors
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((mentor) => (
            <MentorDirectoryCard
              key={mentor.id}
              mentor={mentor}
              viewer={{
                kind: "student",
                status: pendingMentorIds.has(mentor.id) || requested.has(mentor.id) ? "pending" : "none",
                onRequest: () => setTarget({ id: mentor.id, name: mentor.name }),
              }}
            />
          ))}
        </div>
      )}

      {target && (
        <RequestMentorshipModal
          mentorId={target.id}
          mentorName={target.name}
          onClose={() => setTarget(null)}
          onSuccess={() => {
            setRequested((prev) => new Set(prev).add(target.id));
            setTarget(null);
            showToast("Mentorship request sent!");
          }}
        />
      )}
      <Toast toast={toast} onHide={hideToast} />
    </section>
  );
}
