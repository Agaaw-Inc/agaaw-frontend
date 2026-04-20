/**
 * Admin Authentication Service
 *
 * Handles all admin auth operations. Currently uses mock data
 * and localStorage, but structured so each method can be swapped
 * with a real NestJS API call without touching UI components.
 *
 * Backend integration checklist:
 *   1. Replace login() body with POST /api/admin/login
 *   2. Replace logout() body with POST /api/admin/logout
 *   3. Replace getCurrentAdmin() with GET /api/admin/me
 *   4. Remove localStorage usage (httpOnly cookies handle persistence)
 */

import type {
  Admin,
  AdminLoginCredentials,
  AdminLoginResponse,
} from "@/lib/adminTypes";

// ─── Storage Keys ────────────────────────────────────────────
const ADMIN_SESSION_KEY = "agaaw_admin_session";
const ADMIN_TOKEN_KEY = "agaaw_admin_token";

// ─── Mock Admin Data ─────────────────────────────────────────
/** Hardcoded admin for mock authentication */
const MOCK_ADMIN: Admin = {
  id: "admin-001",
  email: "admin@agaaw.com",
  name: "Omar Faruk",
  role: "SUPER_ADMIN",
};

const MOCK_PASSWORD = "123456";
const MOCK_TOKEN = "mock-jwt-token-agaaw-admin-2026";

// ─── Service Methods ─────────────────────────────────────────

/**
 * Authenticate an admin with email and password.
 *
 * TODO: Replace with API call:
 *   const res = await fetch('/api/admin/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *     credentials: 'include', // for httpOnly cookies
 *   });
 *   if (!res.ok) throw new Error('Invalid credentials');
 *   return res.json();
 */
async function login(
  credentials: AdminLoginCredentials
): Promise<AdminLoginResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Validate against mock credentials
  if (
    credentials.email !== MOCK_ADMIN.email ||
    credentials.password !== MOCK_PASSWORD
  ) {
    throw new Error("Invalid email or password");
  }

  const response: AdminLoginResponse = {
    admin: MOCK_ADMIN,
    accessToken: MOCK_TOKEN,
  };

  // Persist session in localStorage
  // TODO: When using httpOnly cookies, remove this — the browser handles persistence
  persistSession(response.admin, response.accessToken);

  return response;
}

/**
 * End the admin session.
 *
 * TODO: Replace with API call:
 *   await fetch('/api/admin/logout', {
 *     method: 'POST',
 *     credentials: 'include',
 *   });
 */
async function logout(): Promise<void> {
  // Clear localStorage
  // TODO: When using httpOnly cookies, the server clears the cookie
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

/**
 * Retrieve the currently authenticated admin from storage.
 *
 * TODO: Replace with API call:
 *   const res = await fetch('/api/admin/me', {
 *     credentials: 'include',
 *   });
 *   if (!res.ok) return null;
 *   return res.json();
 */
function getCurrentAdmin(): Admin | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) return null;

    const admin: Admin = JSON.parse(stored);

    // Basic validation — ensure stored data has required fields
    if (!admin.id || !admin.email || !admin.role) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }

    return admin;
  } catch {
    // Corrupted data — clear it
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

/**
 * Get the stored access token.
 *
 * TODO: When using httpOnly cookies, this is no longer needed.
 *   The token is sent automatically via cookies.
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Persist admin session data in localStorage.
 *
 * TODO: When using httpOnly cookies, this becomes a no-op.
 *   The server sets the cookie on login response.
 */
function persistSession(admin: Admin, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

// ─── Export as service object ────────────────────────────────
export const adminAuthService = {
  login,
  logout,
  getCurrentAdmin,
  getToken,
  persistSession,
};
