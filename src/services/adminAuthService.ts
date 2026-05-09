/**
 * Admin Authentication Service
 *
 * Handles all admin auth operations using the real backend API.
 * Uses the centralized adminApi client for all requests.
 *
 * Auth flow:
 *   1. login() → POST /api/auth/login → stores access_token in memory
 *   2. restoreSession() → POST /api/auth/refresh + GET /api/auth/me → restores on page refresh
 *   3. logout() → POST /api/auth/logout → clears in-memory token + server clears cookie
 *
 * Security:
 *   - access_token: stored in memory only (lost on refresh, restored via cookie)
 *   - refresh_token: HttpOnly cookie set by the backend (never accessible to JS)
 *   - No localStorage usage
 */

import type {
  Admin,
  AdminLoginCredentials,
  AdminProfile,
} from "@/lib/adminTypes";
import * as adminApi from "@/lib/adminApi";

// ─── Service Methods ─────────────────────────────────────────

/**
 * Authenticate an admin with email and password.
 * Calls POST /api/auth/login, then verifies the user has admin role.
 * Returns the Admin object on success.
 */
async function login(credentials: AdminLoginCredentials): Promise<Admin> {
  const response = await adminApi.login(credentials);

  // Verify the user is an admin
  if (response.user.role !== "admin") {
    adminApi.clearAccessToken();
    throw new Error("Access denied. This portal is for administrators only.");
  }

  // Build the Admin object from the login response
  // We'll fetch the full admin profile separately for permissions
  const admin: Admin = {
    id: response.user.id,
    email: response.user.email,
    firstName: "", // Will be populated by fetchAdminProfile
    lastName: "",
    role: response.user.role,
  };

  // Try to fetch the full admin profile (with name and permissions)
  try {
    const profile = await fetchAdminProfile(response.user.id);
    if (profile) {
      admin.firstName = profile.user.firstName;
      admin.lastName = profile.user.lastName;
      admin.adminProfile = profile;
    }
  } catch (err) {
    console.warn("[AdminAuth] Could not fetch admin profile:", err);
    // Login still succeeds — we just won't have permissions info initially
  }

  return admin;
}

/**
 * End the admin session.
 * Calls POST /api/auth/logout and clears the in-memory token.
 */
async function logout(): Promise<void> {
  await adminApi.logout();
}

/**
 * Attempt to restore an admin session using the refresh token cookie.
 * Called on initial page load to check if the user is still authenticated.
 *
 * Flow:
 *   1. POST /api/auth/refresh → get a new access_token
 *   2. GET /api/auth/me → get user id/email/role
 *   3. Verify role === "admin"
 *   4. Fetch admin profile for name + permissions
 *
 * Returns the Admin object if session is valid, or null if not.
 */
async function restoreSession(): Promise<Admin | null> {
  try {
    // Step 1: Try to refresh the token using the HttpOnly cookie
    const refreshResult = await adminApi.refresh();
    if (!refreshResult) return null;

    // Step 2: Get current user info
    const meResponse = await adminApi.getMe();
    if (!meResponse?.user) return null;

    // Step 3: Verify admin role
    if (meResponse.user.role !== "admin") {
      adminApi.clearAccessToken();
      return null;
    }

    // Step 4: Build Admin object
    const admin: Admin = {
      id: meResponse.user.id,
      email: meResponse.user.email,
      firstName: "",
      lastName: "",
      role: meResponse.user.role,
    };

    // Step 5: Fetch full admin profile
    try {
      const profile = await fetchAdminProfile(meResponse.user.id);
      if (profile) {
        admin.firstName = profile.user.firstName;
        admin.lastName = profile.user.lastName;
        admin.adminProfile = profile;
      }
    } catch {
      // Profile fetch failed, but session is still valid
    }

    return admin;
  } catch {
    // Refresh token expired or invalid
    adminApi.clearAccessToken();
    return null;
  }
}

/**
 * Fetch the admin profile for a given user ID.
 * Searches the admin list to find the profile matching the userId.
 *
 * Uses GET /api/admin/admins to find the admin profile by userId,
 * since the admin endpoints use adminProfile.id, not user.id.
 */
async function fetchAdminProfile(
  userId: string
): Promise<AdminProfile | null> {
  try {
    const result = await adminApi.listAdmins({ limit: 100 });
    const profile = result.data.find((a) => a.userId === userId);
    return profile || null;
  } catch {
    return null;
  }
}

// ─── Export as service object ────────────────────────────────
export const adminAuthService = {
  login,
  logout,
  restoreSession,
};
