"use client";

import { useEffect, useState } from "react";
import {
  getConnections,
  getSavedScholarships,
  getScholarships,
  getSessions,
  getStudentProfile,
  type ConnectionItem,
  type PublicScholarship,
  type SessionListItem,
} from "@/lib/api";
import { getCategories, type CategoryWithCount } from "@/lib/categories";

export interface TargetCountry {
  id: string;
  name: string;
  slug: string;
  flagImage: string | null;
}

export interface StudentDashboardData {
  categories: CategoryWithCount[];
  scholarships: PublicScholarship[];
  savedIds: Set<string>;
  sessions: SessionListItem[];
  mentors: ConnectionItem[];
  targetCountries: TargetCountry[];
}

const EMPTY: StudentDashboardData = {
  categories: [],
  scholarships: [],
  savedIds: new Set(),
  sessions: [],
  mentors: [],
  targetCountries: [],
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
      settle(getCategories(), []),
      settle(getScholarships({ limit: 50 }), { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } }),
      settle(getSavedScholarships(), []),
      settle(getSessions({ scope: "upcoming", limit: 3 }), { data: [], meta: { page: 1, limit: 3, total: 0 } }),
      settle(getConnections("active"), []),
      settle(getStudentProfile(), null),
    ]).then(([categories, scholarships, saved, sessions, mentors, profile]) => {
      if (!alive) return;
      setData({
        categories,
        scholarships: scholarships.data,
        savedIds: new Set(saved.map((s) => s.id)),
        sessions: sessions.data,
        mentors,
        targetCountries: (profile?.preferredCountries ?? [])
          .map((pc: { country?: TargetCountry }) => pc.country)
          .filter(Boolean),
      });
      setIsLoading(false);
    });

    return () => {
      alive = false;
    };
  }, []);

  return { data, isLoading, setData };
}
