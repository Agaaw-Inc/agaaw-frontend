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
import { getCategories, getMyStudentCategories, type Category, type CategoryWithCount } from "@/lib/categories";
import type { DirectoryMentor } from "@/components/mentors/MentorDirectoryCard";

export interface TargetCountry {
  id: string;
  name: string;
  slug: string;
  flagImage: string | null;
}

export interface StudentDashboardData {
  categories: CategoryWithCount[];
  /** What this student said they need help with (onboarding / profile). */
  myCategories: Category[];
  scholarships: PublicScholarship[];
  savedIds: Set<string>;
  sessions: SessionListItem[];
  connections: ConnectionItem[];
  targetCountries: TargetCountry[];
  mentors: DirectoryMentor[];
  /** mentor user id → request state, for the suggested-mentor cards. */
  pendingMentorIds: Set<string>;
  blogs: PublicBlog[];
}

const EMPTY: StudentDashboardData = {
  categories: [],
  myCategories: [],
  scholarships: [],
  savedIds: new Set(),
  sessions: [],
  connections: [],
  targetCountries: [],
  mentors: [],
  pendingMentorIds: new Set(),
  blogs: [],
};

const real = (v: string | null | undefined) => (v && v !== "Not specified" ? v : null);

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
      settle(getCategories(), []),
      settle(getMyStudentCategories(), []),
      settle(getScholarships({ limit: 50 }), { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      settle(getSavedScholarships(), []),
      settle(getSessions({ scope: "upcoming", limit: 3 }), { data: [], meta: { page: 1, limit: 3, total: 0 } }),
      settle(getConnections("active"), []),
      settle(getStudentProfile(), null),
      settle(getMentorsList(), []),
      settle(getMentorshipRequests({ status: "pending", limit: 50 }), { data: [], meta: { page: 1, limit: 50, total: 0 } }),
      settle(getBlogs({ limit: 30 }), { data: [], meta: { total: 0, page: 1, limit: 30, totalPages: 0 } }),
    ]).then(([categories, myCategories, scholarships, saved, sessions, connections, profile, mentorList, pending, blogs]) => {
      if (!alive) return;
      setData({
        categories,
        myCategories,
        scholarships: scholarships.data,
        savedIds: new Set(saved.map((s) => s.id)),
        sessions: sessions.data,
        connections,
        targetCountries: (profile?.preferredCountries ?? [])
          .map((pc: { country?: TargetCountry }) => pc.country)
          .filter(Boolean),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- getMentorsList is untyped in lib/api
        mentors: mentorList.map((m: any) => ({
          id: m.id,
          name: m.name,
          image: m.image ?? null,
          university: real(m.university),
          country: real(m.country),
          subject: null,
          expertise: m.expertise ?? [],
          categories: m.categories ?? [],
          identityVerified: !!m.identityVerified,
          rating: m.rating ?? { average: null, count: 0 },
        })),
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
