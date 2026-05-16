const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface PublicScholarshipFaq {
  question: string;
  answer: string;
  order: number;
}

export interface PublicScholarship {
  slug: string;
  name: string;
  provider: string;
  country: string;
  countrySlug: string;
  countryFlagImage: string | null;
  category: string | null;
  categorySlug: string | null;
  level: "bachelors" | "masters" | "phd" | "other";
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
  level?: PublicScholarship["level"];
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
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch user");
  }

  return json.data || json;
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

