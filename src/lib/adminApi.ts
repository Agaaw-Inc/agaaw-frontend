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
} from "./adminTypes";

// ─── Configuration ──────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

// ─── Token Refresh ──────────────────────────────────────────
/**
 * Attempt to refresh the access token using the HttpOnly cookie.
 * Returns the new access_token on success, or null if the
 * refresh token is expired/missing.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends refresh_token cookie
    });

    if (!res.ok) return null;

    const data: AuthRefreshResponse = await res.json();
    setAccessToken(data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
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
