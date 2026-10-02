"use client";

import { useMemo, useState } from "react";

import MentorCard from "@/components/mentors/MentorCard";
import type { MentorCardData } from "@/lib/mentorCards";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import type { ConnectionItem } from "@/lib/api";
import type { Category } from "@/lib/categories";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import EmptyState from "@/components/ui/EmptyState";

const SHOW = 4;

interface SuggestedMentorsProps {
  mentors: MentorCardData[];
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
      <SectionHeading
        size="card"
        title="Mentors for you"
        description={myCategories.length > 0 ? `In ${myCategories.map((c) => c.name.toLowerCase()).join(", ")}` : undefined}
        action={<ArrowLink href={seeAllHref}>See all</ArrowLink>}
        className="mb-4"
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-paper-deep" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <EmptyState
          title="No new mentors in your areas yet"
          body="New mentors join every week. Meanwhile, browse everyone."
          action={{ href: "/mentors", label: "Browse all mentors" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((mentor) => (
            <MentorCard
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
