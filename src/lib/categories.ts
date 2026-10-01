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

export interface PublicMentorService extends MyMentorService {
  mentor: {
    /** The mentor's user id — the one /profile/mentor/[id] uses. */
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    currentUniversity: string | null;
    countryName: string | null;
  };
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
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
export async function getCategories(): Promise<Category[]> {
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

export async function getPublicServices(params: {
  categoryId?: string;
  mentorId?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<PublicMentorService>> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  });
  const res = await fetch(`${API_URL}/mentor-services?${qs.toString()}`, {
    // Always fresh: a mentor who adds a service and opens the category page
    // must see it there. (A cached copy showed "No services" for a minute.)
    // Two indexed queries per view; Neon bills awake time, not query count.
    cache: "no-store",
  });
  return readJson<Paginated<PublicMentorService>>(res, "Failed to load services");
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
