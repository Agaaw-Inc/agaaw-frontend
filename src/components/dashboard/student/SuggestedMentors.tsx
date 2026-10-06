"use client";

import { useMemo, useState } from "react";

import MentorCard from "@/components/mentors/MentorCard";
import type { MentorCardData } from "@/lib/mentorCards";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import type { ConnectionItem } from "@/lib/api";
import type { TargetCountry } from "@/hooks/useStudentDashboard";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import EmptyState from "@/components/ui/EmptyState";

const SHOW = 4;

interface SuggestedMentorsProps {
  mentors: MentorCardData[];
  targetCountries: TargetCountry[];
  connections: ConnectionItem[];
  pendingMentorIds: Set<string>;
  isLoading: boolean;
}

/**
 * Mentors in the countries this student is aiming for first, leaving out
 * mentors they're already working with.
 */
export default function SuggestedMentors({ mentors, targetCountries, connections, pendingMentorIds, isLoading }: SuggestedMentorsProps) {
  const { toast, showToast, hideToast } = useToast();
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);

  const targets = useMemo(() => new Set(targetCountries.map((c) => c.name)), [targetCountries]);
  const connected = useMemo(() => new Set(connections.map((c) => c.counterpart.id)), [connections]);

  const suggestions = useMemo(
    () =>
      mentors
        .filter((m) => !connected.has(m.id))
        .sort((a, b) => Number(targets.has(b.country ?? "")) - Number(targets.has(a.country ?? "")))
        .slice(0, SHOW),
    [mentors, targets, connected]
  );

  return (
    <section>
      <SectionHeading
        size="card"
        title="Mentors for you"
        description={targetCountries.length > 0 ? `Starting with ${targetCountries.map((c) => c.name).join(", ")}` : undefined}
        action={<ArrowLink href="/mentors">See all</ArrowLink>}
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
          title="No new mentors to suggest yet"
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
