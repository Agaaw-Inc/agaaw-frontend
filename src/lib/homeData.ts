/**
 * Data for the public homepage. Server-only, and cached for 5 minutes so the
 * homepage stays a pre-built static page: one database round trip every few
 * minutes, instead of one per visitor. Every loader falls back to an empty
 * value, so the homepage still renders if the API is down.
 */

import type { PublicScholarship } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const REVALIDATE_SECONDS = 300;

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return fallback;
    const json = await res.json();
    return (json?.data ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Scholarships whose deadline is still ahead, soonest first. */
export async function getClosingSoonScholarships(limit: number): Promise<{
  scholarships: PublicScholarship[];
  total: number;
}> {
  const page = await getJson<{ data: PublicScholarship[]; meta: { total: number } }>(
    "/scholarships?limit=50",
    { data: [], meta: { total: 0 } }
  );
  const now = Date.now();
  const upcoming = page.data
    .filter((s) => s.deadline && new Date(s.deadline).getTime() >= now)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  return { scholarships: upcoming.slice(0, limit), total: page.meta.total };
}

export async function getCountryCount(): Promise<number> {
  const countries = await getJson<unknown[]>("/countries", []);
  return Array.isArray(countries) ? countries.length : 0;
}

/** Whole days from now until `iso`; 0 means today. */
export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

