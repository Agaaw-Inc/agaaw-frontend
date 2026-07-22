const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
import { authFetch } from "./authFetch";

// Resolves a relative file path returned by the backend (e.g. "/api/mentors/profile/avatar/file/xyz.jpg")
// into an absolute URL. Absolute URLs (external OAuth avatars, etc.) are passed through unchanged.
export function resolveFileUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL.replace(/\/api\/?$/, "")}${url}`;
}

export interface PublicScholarshipFaq {
  question: string;
  answer: string;
  order: number;
}

export interface PublicScholarship {
  id: string;
  slug: string;
  name: string;
  provider: string;
  country: string;
  countrySlug: string;
  countryFlagImage: string | null;
  category: string | null;
  categorySlug: string | null;
  level: ("bachelors" | "masters" | "phd" | "other")[];
  coverage: "full" | "partial" | "varies";
  deadline: string | null;
  description: string;
  benefits: string | null;
  eligibility: string | null;
  amount: string | null;
  howToApply: string;
  requiredDocuments: string;
  officialLink: string | null;
  bannerImage: string | null;
  faqs?: PublicScholarshipFaq[];
}

export interface PublicScholarshipQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  level?: ("bachelors" | "masters" | "phd" | "other")[] | string;
  coverage?: PublicScholarship["coverage"];
  category?: string;
}

export interface PaginatedPublicScholarships {
  data: PublicScholarship[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PublicScholarshipFilterOption {
  label: string;
  value: string;
  flagImage?: string | null;
}

export interface PublicScholarshipFilters {
  countries: PublicScholarshipFilterOption[];
  levels: PublicScholarshipFilterOption[];
  coverage: PublicScholarshipFilterOption[];
  categories: PublicScholarshipFilterOption[];
}

export interface PublicBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaDescription: string | null;
  coverImage: string | null;
  category: "scholarship" | "visa" | "career" | "general" | "test_prep";
  readTime: number | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImage: string | null;
  };
  tags: { id: string; tag: string }[];
}

export interface PublicBlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  authorId?: string;
}

export interface PaginatedPublicBlogs {
  data: PublicBlog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function toQueryString(params: Record<string, unknown>) {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return entries.length > 0 ? `?${entries.join("&")}` : "";
}

// ── Auth endpoints (no auto-refresh needed — these handle tokens directly) ──

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "mentor" | "student";
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
 
  if (!res.ok) {
    throw new Error(json.message || "Failed to register");
  }

  return json.data || json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to login");
  }

  return json.data || json;
}

export async function getMe() {
  const res = await authFetch("/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch user");
  }

  return json.data?.user || json.user || json.data || json;
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to verify email");
  }

  return json.data || json;
}

export async function resendVerification(email: string) {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to resend verification code");
  }

  return json.data || json;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to send reset link");
  }

  return json.data || json;
}

export async function resetPassword(data: { token: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to reset password");
  }

  return json.data || json;
}

// ── Public & Directory endpoints ──────────────────────────────────────────

export async function getCountries() {
  const res = await fetch(`${API_URL}/countries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 * 5 } // 5 minutes cache
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch countries");
  }

  return json.data || [];
}

export async function getStudents() {
  const res = await authFetch("/users/students");
  const json = await res.json();

  if (!res.ok) {
    console.error(`getStudents failed (${res.status}):`, json.message);
    return [];
  }

  const payload = json.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export async function getMentorsList() {
  const res = await authFetch("/users/mentors");
  const json = await res.json();

  if (!res.ok) {
    console.error(`getMentorsList failed (${res.status}):`, json.message);
    return [];
  }

  const payload = json.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export async function getMentorPublicProfile(id: string) {
  const res = await authFetch(`/users/mentors/${id}`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return null;
    }
    throw new Error(json.message || "Failed to fetch mentor profile");
  }
  return json.data || null;
}

export async function getStudentPublicProfile(id: string) {
  const res = await authFetch(`/users/students/${id}`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return null;
    }
    throw new Error(json.message || "Failed to fetch student profile");
  }
  return json.data || null;
}

export async function getCountryBySlug(slug: string) {
  const res = await fetch(`${API_URL}/countries/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(json.message || "Failed to fetch country details");
  }

  return json.data || null;
}

export async function getScholarships(
  params: PublicScholarshipQueryParams = {}
): Promise<PaginatedPublicScholarships> {
  const qs = toQueryString(params as Record<string, unknown>);
  const res = await fetch(`${API_URL}/scholarships${qs}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch scholarships");
  }

  return json.data || {
    data: [],
    meta: { total: 0, page: 1, limit: params.limit || 12, totalPages: 0 },
  };
}

export async function getScholarshipFilters(): Promise<PublicScholarshipFilters> {
  const res = await fetch(`${API_URL}/scholarships/filters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch scholarship filters");
  }

  return json.data || {
    countries: [],
    levels: [],
    coverage: [],
    categories: [],
  };
}

export async function getScholarshipBySlug(
  slug: string
): Promise<PublicScholarship | null> {
  const res = await fetch(`${API_URL}/scholarships/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(json.message || "Failed to fetch scholarship details");
  }

  return json.data || null;
}

export interface SavedScholarship extends PublicScholarship {
  savedAt: string;
}

export async function getSavedScholarships(): Promise<SavedScholarship[]> {
  const res = await authFetch("/students/saved-scholarships", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    console.error(`getSavedScholarships failed (${res.status}):`, json.message);
    return [];
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function checkScholarshipSaved(scholarshipId: string): Promise<boolean> {
  const res = await authFetch(`/students/saved-scholarships/${scholarshipId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) return false;
  return !!(json.data || json).saved;
}

export async function saveScholarship(scholarshipId: string) {
  const res = await authFetch(`/students/saved-scholarships/${scholarshipId}`, {
    method: "POST",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to save scholarship");
  }
  return json.data || json;
}

export async function unsaveScholarship(scholarshipId: string) {
  const res = await authFetch(`/students/saved-scholarships/${scholarshipId}`, {
    method: "DELETE",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to remove saved scholarship");
  }
  return json.data || json;
}

export async function getBlogs(
  params: PublicBlogQueryParams = {}
): Promise<PaginatedPublicBlogs> {
  const qs = toQueryString(params as Record<string, unknown>);
  const res = await fetch(`${API_URL}/blogs${qs}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch blogs");
  }

  return json.data || {
    data: [],
    meta: { total: 0, page: 1, limit: params.limit || 10, totalPages: 0 },
  };
}

export async function getBlogBySlug(slug: string): Promise<PublicBlog | null> {
  const res = await fetch(`${API_URL}/blogs/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(json.message || "Failed to fetch blog details");
  }

  return json.data || null;
}

export async function getCountriesClient() {
  const res = await fetch(`${API_URL}/countries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch countries");
  }
  return json.data || [];
}

export async function getMentorCount(): Promise<number> {
  const res = await fetch(`${API_URL}/users/stats/mentor-count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok) {
    return 0;
  }
  return json.data?.count ?? 0;
}

// ── Authenticated endpoints (use authFetch for automatic token refresh) ─────

export async function getStudentProfile() {
  const res = await authFetch("/students/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(json.message || "Failed to fetch student profile");
  }
  return json.data || json;
}

export async function updateStudentProfile(data: any) {
  const res = await authFetch("/students/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update student profile");
  }
  return json.data || json;
}

export async function completeStudentOnboarding(data: any) {
  const res = await authFetch("/students/onboarding/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to complete onboarding");
  }
  return json.data || json;
}

export async function getOnboardingStatus() {
  const res = await authFetch("/students/onboarding/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    return { completed: false };
  }
  return json.data || json;
}

export async function getMentorProfile() {
  const res = await authFetch("/mentors/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(json.message || "Failed to fetch mentor profile");
  }
  return json.data || json;
}

export async function updateMentorProfile(data: any) {
  const res = await authFetch("/mentors/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update mentor profile");
  }
  return json.data || json;
}

export async function completeMentorOnboarding(data: any) {
  const res = await authFetch("/mentors/onboarding/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to complete mentor onboarding");
  }
  return json.data || json;
}

export async function getMentorOnboardingStatus() {
  const res = await authFetch("/mentors/onboarding/status", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    return { completed: false };
  }
  return json.data || json;
}

export async function getStudentDocuments() {
  const res = await authFetch("/students/documents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch student documents");
  }
  return json.data || json;
}

export async function uploadStudentDocument(type: string, file: File) {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

  const res = await authFetch("/students/documents", {
    method: "POST",
    // Note: no Content-Type header — browser sets it with boundary for FormData
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to upload student document");
  }
  return json.data || json;
}

export async function deleteStudentDocument(id: string) {
  const res = await authFetch(`/students/documents/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete student document");
  }
  return json.data || json;
}

export async function getMentorDocuments() {
  const res = await authFetch("/mentors/documents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch mentor documents");
  }
  return json.data || json;
}

export async function uploadMentorDocument(type: string, file: File) {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

  const res = await authFetch("/mentors/documents", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to upload mentor document");
  }
  return json.data || json;
}

export async function deleteMentorDocument(id: string) {
  const res = await authFetch(`/mentors/documents/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete mentor document");
  }
  return json.data || json;
}

export async function uploadMentorProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch("/mentors/profile/avatar", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to upload profile picture");
  }
  return json.data || json;
}

export async function deleteMentorProfilePicture() {
  const res = await authFetch("/mentors/profile/avatar", {
    method: "DELETE",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to remove profile picture");
  }
  return json.data || json;
}

export async function uploadStudentProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch("/students/profile/avatar", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to upload profile picture");
  }
  return json.data || json;
}

export async function deleteStudentProfilePicture() {
  const res = await authFetch("/students/profile/avatar", {
    method: "DELETE",
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to remove profile picture");
  }
  return json.data || json;
}

export async function getMentorBlogs() {
  const res = await authFetch("/mentors/blogs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch mentor blogs");
  }
  return json.data || json;
}

export async function getMentorBlogById(id: string) {
  const res = await authFetch(`/mentors/blogs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch mentor blog details");
  }
  return json.data || json;
}

export async function createMentorBlog(data: any) {
  const res = await authFetch("/mentors/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to create mentor blog");
  }
  return json.data || json;
}

export async function updateMentorBlog(id: string, data: any) {
  const res = await authFetch(`/mentors/blogs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update mentor blog");
  }
  return json.data || json;
}

export async function deleteMentorBlog(id: string) {
  const res = await authFetch(`/mentors/blogs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to delete mentor blog");
  }
  return json.data || json;
}

// ── Mentorship requests & connections ────────────────────────────────────

function extractErrorMessage(json: any, fallback: string): string {
  const msg = json?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return msg || fallback;
}

export interface MentorServiceItem {
  id: string;
  mentorId: string;
  title: string;
  description: string | null;
  price: string;
  durationMinutes: number | null;
  duration: string | null;
  currency: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MentorshipRequestStatus = "pending" | "accepted" | "declined" | "withdrawn";

export interface MentorshipRequestServiceItem {
  id: string;
  title: string;
  priceSnapshot: string;
  currency: string | null;
}

export interface MentorshipRequestUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface MentorshipRequestItem {
  id: string;
  studentId: string;
  mentorId: string;
  message: string;
  status: MentorshipRequestStatus;
  viewedAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalPrice: string;
  requestedServices: MentorshipRequestServiceItem[];
  student: MentorshipRequestUserSummary & {
    studentProfile?: {
      institution: string | null;
      degreeLevel: string | null;
      fieldOfInterest: string | null;
    } | null;
  };
  mentor: MentorshipRequestUserSummary;
}

export interface PaginatedMentorshipRequests {
  data: MentorshipRequestItem[];
  meta: { page: number; limit: number; total: number };
}

export interface ConnectionCounterpart {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  role: "student" | "mentor" | "admin";
}

export interface ConnectionItem {
  id: string;
  status: "active" | "ended";
  startedAt: string;
  endedAt: string | null;
  conversationId: string | null;
  counterpart: ConnectionCounterpart;
}

export async function getMentorServices(mentorId: string): Promise<MentorServiceItem[]> {
  const res = await authFetch(`/mentors/${mentorId}/services`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to fetch mentor services"));
  }
  return json.data || [];
}

export async function sendMentorshipRequest(data: {
  mentorId: string;
  message: string;
  serviceIds?: string[];
}) {
  const res = await authFetch("/mentorship-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to send mentorship request"));
  }
  return json.data;
}

export async function getMentorshipRequests(
  params: { status?: MentorshipRequestStatus; page?: number; limit?: number } = {}
): Promise<PaginatedMentorshipRequests> {
  const qs = toQueryString(params as Record<string, unknown>);
  const res = await authFetch(`/mentorship-requests${qs}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to fetch mentorship requests"));
  }
  return json.data || { data: [], meta: { page: 1, limit: params.limit || 10, total: 0 } };
}

export async function getMentorshipRequestDetail(id: string): Promise<MentorshipRequestItem | null> {
  const res = await authFetch(`/mentorship-requests/${id}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(extractErrorMessage(json, "Failed to fetch request detail"));
  }
  return json.data || null;
}

export async function acceptMentorshipRequest(id: string) {
  const res = await authFetch(`/mentorship-requests/${id}/accept`, { method: "PATCH" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to accept request"));
  }
  return json.data;
}

export async function declineMentorshipRequest(id: string, reason?: string) {
  const res = await authFetch(`/mentorship-requests/${id}/decline`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reason ? { reason } : {}),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to decline request"));
  }
  return json.data;
}

export async function withdrawMentorshipRequest(id: string) {
  const res = await authFetch(`/mentorship-requests/${id}/withdraw`, { method: "PATCH" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to withdraw request"));
  }
  return json.data;
}

export async function getConnections(status?: "active" | "ended"): Promise<ConnectionItem[]> {
  const qs = toQueryString(status ? { status } : {});
  const res = await authFetch(`/connections${qs}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    console.error(`getConnections failed (${res.status}):`, json.message);
    return [];
  }
  return Array.isArray(json.data) ? json.data : [];
}

export async function getStudentProfileForMentor(userId: string) {
  const res = await authFetch(`/students/${userId}/profile`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 403 || res.status === 404) return null;
    throw new Error(extractErrorMessage(json, "Failed to fetch student profile"));
  }
  return json.data || null;
}

export async function getStudentDocumentsForMentor(userId: string) {
  const res = await authFetch(`/students/${userId}/documents`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 403 || res.status === 404) return [];
    throw new Error(extractErrorMessage(json, "Failed to fetch student documents"));
  }
  return Array.isArray(json.data) ? json.data : [];
}

// ── Mentorship sessions (video calls) ────────────────────────────────────

export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
export type SessionListScope = "upcoming" | "past" | "cancelled";

export interface SessionCounterpart {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  role: "student" | "mentor" | "admin";
}

export interface SessionListItem {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  status: SessionStatus;
  isToday: boolean;
  counterpart: SessionCounterpart;
  canJoin: boolean;
}

export interface SessionDetail extends SessionListItem {
  description: string | null;
  roomUrl: string | null;
  cancelledById: string | null;
  cancelReason: string | null;
  rescheduledFrom: string | null;
}

export interface PaginatedSessions {
  data: SessionListItem[];
  meta: { page: number; limit: number; total: number };
}

export interface JoinSessionResult {
  roomUrl: string;
  token: string;
  provider: "daily";
  expiresAt: string;
}

export async function createSession(data: {
  connectionId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
}) {
  const res = await authFetch("/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to schedule session"));
  }
  return json.data;
}

export async function getSessions(
  params: { scope?: SessionListScope; page?: number; limit?: number } = {}
): Promise<PaginatedSessions> {
  const qs = toQueryString(params as Record<string, unknown>);
  const res = await authFetch(`/sessions${qs}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    console.error(`getSessions failed (${res.status}):`, json.message);
    return { data: [], meta: { page: 1, limit: params.limit || 5, total: 0 } };
  }
  return json.data || { data: [], meta: { page: 1, limit: params.limit || 5, total: 0 } };
}

export async function getSessionDetail(id: string): Promise<SessionDetail | null> {
  const res = await authFetch(`/sessions/${id}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 403 || res.status === 404) return null;
    throw new Error(extractErrorMessage(json, "Failed to fetch session detail"));
  }
  return json.data || null;
}

export async function joinSession(id: string): Promise<JoinSessionResult> {
  const res = await authFetch(`/sessions/${id}/join`, { method: "POST" });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to join session"));
  }
  return json.data;
}

export async function rescheduleSession(
  id: string,
  data: { scheduledAt: string; durationMinutes?: number }
) {
  const res = await authFetch(`/sessions/${id}/reschedule`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to reschedule session"));
  }
  return json.data;
}

export async function cancelSession(id: string, reason?: string) {
  const res = await authFetch(`/sessions/${id}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reason ? { reason } : {}),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(extractErrorMessage(json, "Failed to cancel session"));
  }
  return json.data;
}
