"use client";

import { useEffect, useState } from "react";
import {
  getBlogs,
  getConnections,
  getMentorsList,
  getMentorshipRequests,
  getSavedScholarships,
  getScholarships,
  getSessions,
  getStudentProfile,
  type ConnectionItem,
  type PublicBlog,
  type PublicScholarship,
  type SessionListItem,
} from "@/lib/api";
import { fromStudentList, type MentorCardData } from "@/lib/mentorCards";

export interface TargetCountry {
  id: string;
  name: string;
  slug: string;
  flagImage: string | null;
}

export interface StudentDashboardData {
  scholarships: PublicScholarship[];
  savedIds: Set<string>;
  sessions: SessionListItem[];
  connections: ConnectionItem[];
  targetCountries: TargetCountry[];
  mentors: MentorCardData[];
  /** mentor user id → request state, for the suggested-mentor cards. */
  pendingMentorIds: Set<string>;
  blogs: PublicBlog[];
}

const EMPTY: StudentDashboardData = {
  scholarships: [],
  savedIds: new Set(),
  sessions: [],
  connections: [],
  targetCountries: [],
  mentors: [],
  pendingMentorIds: new Set(),
  blogs: [],
};

/**
 * Everything the student dashboard shows, loaded in parallel once. Each
 * request fails on its own: a broken sessions call still leaves the
 * scholarships visible, instead of blanking the whole page.
 */
export function useStudentDashboard() {
  const [data, setData] = useState<StudentDashboardData>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const settle = <T,>(p: Promise<T>, fallback: T) => p.catch(() => fallback);

    Promise.all([
      settle(getScholarships({ limit: 50 }), { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      settle(getSavedScholarships(), []),
      settle(getSessions({ scope: "upcoming", limit: 3 }), { data: [], meta: { page: 1, limit: 3, total: 0 } }),
      settle(getConnections("active"), []),
      settle(getStudentProfile(), null),
      settle(getMentorsList(), []),
      settle(getMentorshipRequests({ status: "pending", limit: 50 }), { data: [], meta: { page: 1, limit: 50, total: 0 } }),
      settle(getBlogs({ limit: 30 }), { data: [], meta: { total: 0, page: 1, limit: 30, totalPages: 0 } }),
    ]).then(([scholarships, saved, sessions, connections, profile, mentorList, pending, blogs]) => {
      if (!alive) return;
      setData({
        scholarships: scholarships.data,
        savedIds: new Set(saved.map((s) => s.id)),
        sessions: sessions.data,
        connections,
        targetCountries: (profile?.preferredCountries ?? [])
          .map((pc: { country?: TargetCountry }) => pc.country)
          .filter(Boolean),
        mentors: mentorList.map(fromStudentList),
        pendingMentorIds: new Set(pending.data.map((r: { mentorId: string }) => r.mentorId)),
        blogs: blogs.data,
      });
      setIsLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  return { data, isLoading, setData };
}
