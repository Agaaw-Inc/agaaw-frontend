/**
 * Mentorship categories (study abroad, career, business…), the services
 * mentors list under them, and which categories a mentor has joined.
 *
 * Prices arrive as strings ("1500") so no precision is lost in transit;
 * format with formatTaka() from ./orders.
 */

import { authFetch } from "./authFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ── Types ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** lucide icon name, e.g. "briefcase" */
  icon: string | null;
  isHighlight: boolean;
  /** false = "Coming soon": shown, but can't be joined or browsed. */
  isActive: boolean;
  displayOrder: number;
  modules: string[];
}

/** GET /categories adds how many approved mentors work in each one. */
export interface CategoryWithCount extends Category {
  mentorCount: number;
}

export interface CategoryMentorPreview {
  /** The mentor's user id — the one /profile/mentor/[id] uses. */
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  currentUniversity: string | null;
  countryName: string | null;
  subject: string | null;
  /** An admin approved their ID documents. */
  identityVerified: boolean;
}

export interface JoinedCategory extends Category {
  joinedAt: string;
}

export type ServiceDeliveryType = "session" | "deliverable";

export interface MentorServiceCategoryRef {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
}

export interface MyMentorService {
  id: string;
  title: string;
  description: string | null;
  price: string;
  currency: string | null;
  deliveryType: ServiceDeliveryType;
  durationMinutes: number | null;
  duration: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Null for services created before categories existed. */
  category: MentorServiceCategoryRef | null;
}

export interface ServiceInput {
  title: string;
  description?: string;
  categoryId: string;
  price: number;
  deliveryType: ServiceDeliveryType;
  durationMinutes?: number;
}

export const DELIVERY_TYPE_LABELS: Record<ServiceDeliveryType, string> = {
  session: "Live session",
  deliverable: "Deliverable",
};

// ── Helpers ───────────────────────────────────────────────────────────────

function errorMessage(json: unknown, fallback: string): string {
  const msg = (json as { message?: unknown } | null)?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return typeof msg === "string" && msg ? msg : fallback;
}

async function readJson<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(errorMessage(json, fallback));
  return json?.data as T;
}

// ── Public (safe to call from server components) ─────────────────────────

/** All categories in homepage order, including "coming soon" ones. */
export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      // Categories change rarely; refresh the cached copy every 5 minutes.
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    // The homepage must still render if the API is down.
    return [];
  }
}

/** Null when the slug doesn't exist. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const res = await fetch(`${API_URL}/categories/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  return readJson<Category>(res, "Failed to load category");
}

/**
 * Up to 12 approved mentors in a category, plus the total. Null when the
 * slug doesn't exist. Always fresh: a mentor who just joined must show up.
 */
export async function getCategoryMentors(
  slug: string
): Promise<{ total: number; mentors: CategoryMentorPreview[] } | null> {
  const res = await fetch(`${API_URL}/categories/${encodeURIComponent(slug)}/mentors`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  return readJson<{ total: number; mentors: CategoryMentorPreview[] }>(res, "Failed to load mentors");
}

// ── Mentor: own categories ───────────────────────────────────────────────

export async function getMyCategories(): Promise<JoinedCategory[]> {
  const res = await authFetch("/mentor-categories/mine", { cache: "no-store" });
  return readJson<JoinedCategory[]>(res, "Failed to load your categories");
}

export async function joinCategory(categoryId: string): Promise<JoinedCategory[]> {
  const res = await authFetch("/mentor-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId }),
  });
  return readJson<JoinedCategory[]>(res, "Failed to join category");
}

export async function leaveCategory(categoryId: string): Promise<JoinedCategory[]> {
  const res = await authFetch(`/mentor-categories/${categoryId}`, { method: "DELETE" });
  return readJson<JoinedCategory[]>(res, "Failed to leave category");
}

// ── Mentor: own services ─────────────────────────────────────────────────

export async function getMyServices(): Promise<MyMentorService[]> {
  const res = await authFetch("/mentor-services/mine", { cache: "no-store" });
  return readJson<MyMentorService[]>(res, "Failed to load your services");
}

export async function createService(input: ServiceInput): Promise<MyMentorService> {
  const res = await authFetch("/mentor-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readJson<MyMentorService>(res, "Failed to create service");
}

export async function updateService(
  id: string,
  input: Partial<ServiceInput>
): Promise<MyMentorService> {
  const res = await authFetch(`/mentor-services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readJson<MyMentorService>(res, "Failed to update service");
}

export async function deleteService(id: string): Promise<void> {
  const res = await authFetch(`/mentor-services/${id}`, { method: "DELETE" });
  await readJson<unknown>(res, "Failed to delete service");
}

// ── Student: own categories ──────────────────────────────────────────────

export async function getMyStudentCategories(): Promise<Category[]> {
  const res = await authFetch("/student-categories/mine", { cache: "no-store" });
  return readJson<Category[]>(res, "Failed to load your categories");
}

/** Replaces the student's whole selection. */
export async function setMyStudentCategories(categoryIds: string[]): Promise<Category[]> {
  const res = await authFetch("/student-categories/mine", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryIds }),
  });
  return readJson<Category[]>(res, "Failed to save your categories");
}

// ── Public mentor directory (logged-out visitors) ────────────────────────

export interface MentorRating {
  average: number | null;
  count: number;
}

/** A mentor card anyone may see — no bio, prices or contact details. */
export interface PublicMentorCard {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  currentUniversity: string | null;
  countryName: string | null;
  subject: string | null;
  expertise: string[];
  categories: { slug: string; name: string }[];
  identityVerified: boolean;
  rating: MentorRating;
}

export interface PublicMentorDirectory {
  total: number;
  /** The most a logged-out visitor is shown. */
  limit: number;
  mentors: PublicMentorCard[];
  filters: { countries: string[]; universities: string[] };
}

export async function getPublicMentorDirectory(filters: {
  category?: string;
  country?: string;
  university?: string;
}): Promise<PublicMentorDirectory> {
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
  const res = await fetch(`${API_URL}/users/mentors/directory?${qs.toString()}`, { cache: "no-store" });
  return readJson<PublicMentorDirectory>(res, "Failed to load mentors");
}

/** One mentor's public card. Null if they don't exist or aren't approved. */
export async function getPublicMentorCard(id: string): Promise<PublicMentorCard | null> {
  const res = await fetch(`${API_URL}/users/mentors/directory/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  return readJson<PublicMentorCard>(res, "Failed to load mentor");
}
