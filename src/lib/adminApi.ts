/**
 * Admin API Client
 *
 * Centralized fetch wrapper for all admin panel API calls.
 * Handles:
 *   - In-memory access token management (NOT localStorage)
 *   - Authorization header injection
 *   - HttpOnly cookie credentials
 *   - Automatic token refresh on 401
 *   - Consistent error handling
 *
 * All admin endpoint functions are grouped by domain below.
 */

import type {
  AuthLoginResponse,
  AuthRefreshResponse,
  AuthMeResponse,
  AdminLoginCredentials,
  DashboardStatsResponse,
  PaginatedResponse,
  AdminProfile,
  UserListItem,
  UserDetail,
  MentorListItem,
  ActivityLog,
  UserQueryParams,
  AdminQueryParams,
  MentorQueryParams,
  ActivityLogQueryParams,
  CreateAdminPayload,
  UpdatePermissionsPayload,
  ChangeUserRolePayload,
  Country,
  CreateCountryPayload,
  CountryQueryParams,
  Scholarship,
  CreateScholarshipPayload,
  ScholarshipQueryParams,
  ScholarshipCategory,
  CreateScholarshipCategoryPayload,
  UpdateScholarshipCategoryPayload,
  Blog,
  CreateBlogPayload,
  UpdateBlogPayload,
  BlogQueryParams,
  UpdateProfilePayload,
} from "./adminTypes";
import type { Order, Payout, PayoutDetails, PayoutMethod } from "./orders";

// ─── Configuration ──────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── In-Memory Token Store ──────────────────────────────────
/**
 * Access token is stored in memory for security.
 * It's never written to localStorage or cookies.
 * This means it's lost on page refresh — we rely on
 * the HttpOnly refresh_token cookie to restore it.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        setAccessToken(null);
        return null;
      }

      const data: AuthRefreshResponse = await res.json();
      setAccessToken(data.access_token);
      return data.access_token;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Base Fetch Wrapper ─────────────────────────────────────
/**
 * Core fetch function that all API calls use.
 * - Adds Authorization header if we have a token
 * - Sends credentials (cookies) with every request
 * - On 401, attempts a token refresh and retries once
 * - Throws a descriptive error on failure
 */
async function adminFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  // If 401, try refreshing the token and retry once
  if (res.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  const json = await res.json();

  if (!res.ok) {
    const message =
      json?.message ||
      (Array.isArray(json?.message) ? json.message.join(", ") : null) ||
      `API error: ${res.status}`;
    throw new Error(message);
  }

  // Unwrap the global response interceptor format: { success, data, message }
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data as T;
  }

  return json as T;
}

// ─── Query String Helper ────────────────────────────────────
/**
 * Converts a params object to a URL query string.
 * Skips undefined/null values.
 */
function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);

  return entries.length > 0 ? `?${entries.join("&")}` : "";
}

// ================================================================
// Auth Endpoints
// ================================================================

/**
 * Login with email and password.
 * POST /api/auth/login
 * Backend sets refresh_token as HttpOnly cookie.
 */
export async function login(
  credentials: AdminLoginCredentials
): Promise<AuthLoginResponse> {
  const res = await adminFetch<AuthLoginResponse>(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store access token in memory
  setAccessToken(res.access_token);

  return res;
}

/**
 * Logout and clear session.
 * POST /api/auth/logout
 * Backend clears the refresh_token cookie.
 */
export async function logout(): Promise<void> {
  try {
    await adminFetch<{ message: string }>(`${API_URL}/auth/logout`, {
      method: "POST",
    });
  } catch {
    // Ignore errors on logout — we clear local state regardless
  } finally {
    clearAccessToken();
  }
}

/**
 * Get the currently authenticated user.
 * GET /api/auth/me
 */
export async function getMe(): Promise<AuthMeResponse> {
  return adminFetch<AuthMeResponse>(`${API_URL}/auth/me`);
}

/**
 * Update the currently authenticated admin's profile.
 * PATCH /api/admin/settings/profile
 */
export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<void> {
  return adminFetch<void>(`${API_URL}/admin/settings/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Refresh the access token.
 * POST /api/auth/refresh
 * Uses the HttpOnly refresh_token cookie automatically.
 */
export async function refresh(): Promise<AuthRefreshResponse | null> {
  const token = await refreshAccessToken();
  if (!token) return null;
  return { access_token: token };
}

// ================================================================
// Dashboard Endpoints
// ================================================================

/**
 * Get dashboard statistics.
 * GET /api/admin/dashboard/stats
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  return adminFetch<DashboardStatsResponse>(
    `${API_URL}/admin/dashboard/stats`
  );
}

/** Chart windows; buckets are cut in Bangladesh time on the server. */
export type StatsRange = "7d" | "30d" | "12m" | "all";

export interface RegistrationBucket {
  /** "YYYY-MM-DD" — the first day of the bucket, Dhaka time. */
  bucket: string;
  students: number;
  mentors: number;
}

/**
 * New students and mentors per day (7d/30d) or month (12m/all).
 * GET /api/admin/dashboard/registrations
 */
export async function getRegistrationStats(range: StatsRange): Promise<RegistrationBucket[]> {
  return adminFetch<RegistrationBucket[]>(`${API_URL}/admin/dashboard/registrations?range=${range}`);
}

// ================================================================
// User Management Endpoints
// ================================================================

/**
 * List users with pagination and filters.
 * GET /api/admin/users
 */
export async function listUsers(
  params: UserQueryParams = {}
): Promise<PaginatedResponse<UserListItem>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<UserListItem>>(
    `${API_URL}/admin/users${qs}`
  );
}

/**
 * Get a single user's full detail.
 * GET /api/admin/users/:id
 */
export async function getUserDetail(userId: string): Promise<UserDetail> {
  return adminFetch<UserDetail>(`${API_URL}/admin/users/${userId}`);
}

/**
 * Ban a user.
 * PATCH /api/admin/users/:id/ban
 */
export async function banUser(
  userId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/users/${userId}/ban`,
    { method: "PATCH" }
  );
}

/**
 * Unban a user.
 * PATCH /api/admin/users/:id/unban
 */
export async function unbanUser(
  userId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/users/${userId}/unban`,
    { method: "PATCH" }
  );
}

/**
 * Change a user's role.
 * PATCH /api/admin/users/:id/role
 */
export async function changeUserRole(
  userId: string,
  payload: ChangeUserRolePayload
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/users/${userId}/role`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

/**
 * Permanently delete a user.
 * DELETE /api/admin/users/:id
 */
export async function deleteUser(
  userId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/users/${userId}`,
    { method: "DELETE" }
  );
}

// ================================================================
// Admin Management Endpoints
// ================================================================

/**
 * List all admins with pagination.
 * GET /api/admin/admins
 */
export async function listAdmins(
  params: AdminQueryParams = {}
): Promise<PaginatedResponse<AdminProfile>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<AdminProfile>>(
    `${API_URL}/admin/admins${qs}`
  );
}

/**
 * Get a single admin profile.
 * GET /api/admin/admins/:id
 */
export async function getAdminProfile(
  adminId: string
): Promise<AdminProfile> {
  return adminFetch<AdminProfile>(`${API_URL}/admin/admins/${adminId}`);
}

/**
 * Create a new admin (promote a user).
 * POST /api/admin/admins
 */
export async function createAdmin(
  payload: CreateAdminPayload
): Promise<AdminProfile> {
  return adminFetch<AdminProfile>(`${API_URL}/admin/admins`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update an admin's permissions.
 * PATCH /api/admin/admins/:id/permissions
 */
export async function updateAdminPermissions(
  adminId: string,
  payload: UpdatePermissionsPayload
): Promise<AdminProfile> {
  return adminFetch<AdminProfile>(
    `${API_URL}/admin/admins/${adminId}/permissions`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

/**
 * Deactivate an admin.
 * PATCH /api/admin/admins/:id/deactivate
 */
export async function deactivateAdmin(
  adminId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/admins/${adminId}/deactivate`,
    { method: "PATCH" }
  );
}

/**
 * Reactivate an admin.
 * PATCH /api/admin/admins/:id/reactivate
 */
export async function reactivateAdmin(
  adminId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/admins/${adminId}/reactivate`,
    { method: "PATCH" }
  );
}

// ================================================================
// Mentor Management Endpoints
// ================================================================

/**
 * List mentors with pagination and filters.
 * GET /api/admin/mentors
 */
export async function listMentors(
  params: MentorQueryParams = {}
): Promise<PaginatedResponse<MentorListItem>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<MentorListItem>>(
    `${API_URL}/admin/mentors${qs}`
  );
}

/**
 * Approve a mentor application.
 * PATCH /api/admin/mentors/:id/approve
 */
export async function approveMentor(
  mentorProfileId: string
): Promise<unknown> {
  return adminFetch(`${API_URL}/admin/mentors/${mentorProfileId}/approve`, {
    method: "PATCH",
  });
}

/**
 * Reject a mentor application.
 * PATCH /api/admin/mentors/:id/reject
 */
export async function rejectMentor(
  mentorProfileId: string,
  reason: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(
    `${API_URL}/admin/mentors/${mentorProfileId}/reject`,
    { method: "PATCH", body: JSON.stringify({ reason }) }
  );
}

// ================================================================
// Activity Log Endpoints
// ================================================================

/**
 * Get activity logs with pagination and filters.
 * GET /api/admin/activity-logs
 */
export async function getActivityLogs(
  params: ActivityLogQueryParams = {}
): Promise<PaginatedResponse<ActivityLog>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<ActivityLog>>(
    `${API_URL}/admin/activity-logs${qs}`
  );
}

// ================================================================
// Country Management Endpoints
// ================================================================

export async function listCountries(
  params: CountryQueryParams = {}
): Promise<PaginatedResponse<Country>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<Country>>(`${API_URL}/admin/countries${qs}`);
}

export async function getCountry(id: string): Promise<Country> {
  return adminFetch<Country>(`${API_URL}/admin/countries/${id}`);
}

export async function createCountry(payload: CreateCountryPayload): Promise<Country> {
  return adminFetch<Country>(`${API_URL}/admin/countries`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCountry(id: string, payload: CreateCountryPayload): Promise<Country> {
  return adminFetch<Country>(`${API_URL}/admin/countries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCountry(id: string): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(`${API_URL}/admin/countries/${id}`, {
    method: "DELETE",
  });
}

// ================================================================
// Scholarship Management Endpoints
// ================================================================

export async function listScholarshipCategories(): Promise<ScholarshipCategory[]> {
  return adminFetch<ScholarshipCategory[]>(`${API_URL}/admin/scholarships/categories`);
}

export async function createScholarshipCategory(
  payload: CreateScholarshipCategoryPayload
): Promise<ScholarshipCategory> {
  return adminFetch<ScholarshipCategory>(`${API_URL}/admin/scholarships/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateScholarshipCategory(
  categoryId: string,
  payload: UpdateScholarshipCategoryPayload
): Promise<ScholarshipCategory> {
  return adminFetch<ScholarshipCategory>(`${API_URL}/admin/scholarships/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteScholarshipCategory(
  categoryId: string
): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(`${API_URL}/admin/scholarships/categories/${categoryId}`, {
    method: "DELETE",
  });
}

export async function listScholarships(
  params: ScholarshipQueryParams = {}
): Promise<PaginatedResponse<Scholarship>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<Scholarship>>(`${API_URL}/admin/scholarships${qs}`);
}

export async function getScholarship(id: string): Promise<Scholarship> {
  return adminFetch<Scholarship>(`${API_URL}/admin/scholarships/${id}`);
}

export async function createScholarship(payload: CreateScholarshipPayload): Promise<Scholarship> {
  return adminFetch<Scholarship>(`${API_URL}/admin/scholarships`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateScholarship(id: string, payload: CreateScholarshipPayload): Promise<Scholarship> {
  return adminFetch<Scholarship>(`${API_URL}/admin/scholarships/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteScholarship(id: string): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(`${API_URL}/admin/scholarships/${id}`, {
    method: "DELETE",
  });
}

// ================================================================
// Blog Management Endpoints
// ================================================================

export async function listBlogs(
  params: BlogQueryParams = {}
): Promise<PaginatedResponse<Blog>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<Blog>>(`${API_URL}/admin/blogs${qs}`);
}

export async function getBlog(id: string): Promise<Blog> {
  return adminFetch<Blog>(`${API_URL}/admin/blogs/${id}`);
}

export async function createBlog(payload: CreateBlogPayload): Promise<Blog> {
  return adminFetch<Blog>(`${API_URL}/admin/blogs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBlog(
  id: string,
  payload: UpdateBlogPayload
): Promise<Blog> {
  return adminFetch<Blog>(`${API_URL}/admin/blogs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlog(id: string): Promise<{ message: string }> {
  return adminFetch<{ message: string }>(`${API_URL}/admin/blogs/${id}`, {
    method: "DELETE",
  });
}

// ================================================================
// Export Endpoints
// ================================================================

/**
 * Downloads users as CSV.
 * GET /api/admin/users/export
 */
export async function exportUsersCsv(params: UserQueryParams = {}): Promise<void> {
  const qs = toQueryString(params as Record<string, unknown>);
  const url = `${API_URL}/admin/users/export${qs}`;
  return downloadCsv(url, "users-export.csv");
}

/**
 * Downloads mentors as CSV.
 * GET /api/admin/mentors/export
 */
export async function exportMentorsCsv(params: MentorQueryParams = {}): Promise<void> {
  const qs = toQueryString(params as Record<string, unknown>);
  const url = `${API_URL}/admin/mentors/export${qs}`;
  return downloadCsv(url, "mentors-export.csv");
}

/**
 * Helper to download CSV file from an endpoint.
 * Handles auth headers and browser download trigger.
 */
async function downloadCsv(url: string, filename: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (getAccessToken()) {
    headers["Authorization"] = `Bearer ${getAccessToken()}`;
  }

  const res = await fetch(url, {
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to export CSV: ${res.status}`);
  }

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

// ================================================================
// Announcement Endpoints (Notification System)
// ================================================================

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  audience: "all" | "students" | "mentors";
  link: string | null;
  sentCount: number;
  sentBy: string;
  createdAt: string;
}

/**
 * Sends an announcement to an audience.
 * POST /api/admin/announcements
 */
export async function createAnnouncement(payload: {
  title: string;
  message: string;
  audience: "all" | "students" | "mentors";
  link?: string;
}): Promise<{ id: string; sentCount: number }> {
  return adminFetch<{ id: string; sentCount: number }>(
    `${API_URL}/admin/announcements`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

/**
 * Announcement history.
 * GET /api/admin/announcements
 */
export async function listAnnouncements(
  params: { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<AdminAnnouncement>> {
  const qs = toQueryString(params as Record<string, unknown>);
  return adminFetch<PaginatedResponse<AdminAnnouncement>>(
    `${API_URL}/admin/announcements${qs}`
  );
}

/**
 * Audience size hint for the composer confirm dialog.
 * GET /api/admin/announcements/audience-size/:audience
 */
export async function getAudienceSize(
  audience: "all" | "students" | "mentors"
): Promise<number> {
  const result = await adminFetch<{ audience: string; count: number }>(
    `${API_URL}/admin/announcements/audience-size/${audience}`
  );
  return result?.count ?? 0;
}

// ================================================================
// Payments (manual bKash/bank verification, disputes, refunds, payouts)
// ================================================================


export interface PaymentsSummary {
  pendingPayments: number;
  openDisputes: number;
  pendingRefunds: number;
  pendingPayouts: number;
  pendingKyc: number;
}

export interface AdminPaymentSubmission {
  id: string;
  orderId: string;
  method: "bkash" | "bank";
  senderInfo: string;
  transactionId: string;
  hasScreenshot: boolean;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  order: {
    id: string;
    reference: string;
    title: string;
    amount: string;
    currency: string;
    status: string;
    student: { id: string; firstName: string; lastName: string };
    mentor: { id: string; firstName: string; lastName: string };
  };
}

export interface AdminDispute {
  id: string;
  round: number;
  reason: string;
  status: "open" | "resolved_release" | "resolved_refund" | "resolved_revision";
  adminNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
  /** Null when raised automatically (missed revision deadline). */
  raisedBy: { id: string; firstName: string; lastName: string } | null;
  order: Order;
}

export interface AdminPayout extends Payout {
  mentor: { id: string; firstName: string; lastName: string; email: string };
}

export interface AdminKycEntry {
  mentorId: string;
  mentor: { id: string; firstName: string; lastName: string; email: string };
  payoutMethod: PayoutMethod;
  payoutDetails: PayoutDetails;
  kycVerified: boolean;
  kycVerifiedAt: string | null;
  availableBalance: string;
  detailsUpdatedAt: string;
}

export interface PlatformPaymentConfig {
  bkashNumber: string | null;
  bkashType: "personal" | "merchant";
  bankName: string | null;
  bankAccountNo: string | null;
  bankAccountName: string | null;
  bankBranch: string | null;
  instructions: string | null;
  updatedAt: string | null;
}

const P = () => `${API_URL}/admin/payments`;

export const getPaymentsSummary = () => adminFetch<PaymentsSummary>(`${P()}/summary`);

export const listPaymentSubmissions = (status = "pending", page = 1) =>
  adminFetch<PaginatedResponse<AdminPaymentSubmission>>(`${P()}/submissions${toQueryString({ status, page, limit: 20 })}`);

export const verifyPaymentSubmission = (id: string, approved: boolean, note?: string) =>
  adminFetch<Order>(`${P()}/submissions/${id}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ approved, note: note || undefined }),
  });

export const listAdminOrders = (status?: string, page = 1) =>
  adminFetch<PaginatedResponse<Order>>(`${P()}/orders${toQueryString({ status, page, limit: 20 })}`);

export const markOrderRefunded = (id: string, reason?: string) =>
  adminFetch<Order>(`${P()}/orders/${id}/mark-refunded`, {
    method: "PATCH",
    body: JSON.stringify(reason ? { reason } : {}),
  });

export const listDisputes = (status = "open", page = 1) =>
  adminFetch<PaginatedResponse<AdminDispute>>(`${P()}/disputes${toQueryString({ status, page, limit: 20 })}`);

export const resolveDispute = (
  id: string,
  resolution: "release" | "refund" | "revision",
  notes?: string,
  revisionDays?: number,
) =>
  adminFetch<Order>(`${P()}/disputes/${id}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ resolution, notes: notes || undefined, revisionDays }),
  });

export const listAdminPayouts = (status = "pending", page = 1) =>
  adminFetch<PaginatedResponse<AdminPayout>>(`${P()}/payouts${toQueryString({ status, page, limit: 20 })}`);

export const completePayout = (id: string, transferReference: string, note?: string) =>
  adminFetch<Payout>(`${P()}/payouts/${id}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ transferReference, note: note || undefined }),
  });

export const failPayout = (id: string, reason: string) =>
  adminFetch<Payout>(`${P()}/payouts/${id}/fail`, { method: "PATCH", body: JSON.stringify({ reason }) });

export const listKyc = (verified = false, page = 1) =>
  adminFetch<PaginatedResponse<AdminKycEntry>>(`${P()}/kyc${toQueryString({ verified, page, limit: 20 })}`);

export const verifyKyc = (mentorId: string, detailsUpdatedAt: string) =>
  adminFetch<{ mentorId: string }>(`${P()}/kyc/${mentorId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ detailsUpdatedAt }),
  });

export const getPaymentConfig = () => adminFetch<PlatformPaymentConfig>(`${P()}/config`);

export const updatePaymentConfig = (payload: Omit<PlatformPaymentConfig, "updatedAt">) =>
  adminFetch<PlatformPaymentConfig>(`${P()}/config`, { method: "PUT", body: JSON.stringify(payload) });

export interface OrderAnalyticsBucket {
  bucket: string;
  /** Agaaw's fee on orders released in this bucket. */
  income: string;
  /** Payments verified in this bucket (incl. ones later refunded). */
  received: string;
  orders: number;
  delivered: number;
  refunded: number;
  refundedAmount: string;
}

export interface OrderAnalytics {
  range: StatsRange;
  unit: "day" | "month";
  timezone: string;
  currency: string;
  totals: {
    income: string;
    received: string;
    orders: number;
    delivered: number;
    refunded: number;
    refundedAmount: string;
  };
  snapshot: {
    incomeAllTime: string;
    completedOrdersAllTime: number;
    heldForActiveOrders: string;
    activeOrders: number;
    expectedIncome: string;
    awaitingVerification: string;
    awaitingVerificationCount: number;
    refundsOwed: string;
    refundsOwedCount: number;
    owedToMentors: string;
    paidOutToMentors: string;
    servicesListed: number;
    mentorsWithServices: number;
  };
  series: OrderAnalyticsBucket[];
}

export const getOrderAnalytics = (range: StatsRange) =>
  adminFetch<OrderAnalytics>(`${P()}/analytics?range=${range}`);

/**
 * Private files (payment screenshots, deliverables) are fetched with the
 * admin's token and returned as a temporary blob URL. Revoke it when done.
 */
export async function fetchPrivateFileUrl(path: string): Promise<string> {
  const token = getAccessToken();
  const res = await fetch(`${P()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Couldn't load file (${res.status})`);
  }
  return URL.createObjectURL(await res.blob());
}
