/**
 * Admin Types & Constants
 *
 * Central type definitions for the admin authentication system.
 * These types mirror what the NestJS backend will return,
 * making future integration seamless.
 */

// ─── Admin Roles ─────────────────────────────────────────────
/** Available admin roles in the system */
export type AdminRole = "SUPER_ADMIN" | "ADMIN";

/**
 * Role hierarchy — higher number = more permissions.
 * Used by hasPermission() to compare roles.
 */
export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

// ─── Admin User ──────────────────────────────────────────────
/** Represents an authenticated admin user */
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
}

// ─── Admin Modules (matches AdminModule DB enum) ─────────────
/**
 * Modules in the admin panel that can have individual permissions.
 * Must match the AdminModule enum in the backend database.
 */
export type AdminModule =
  | "users"
  | "scholarships"
  | "blogs"
  | "countries"
  | "settings";

export const ALL_ADMIN_MODULES: AdminModule[] = [
  "users",
  "scholarships",
  "blogs",
  "countries",
  "settings",
];

// ─── Admin Permissions (matches admin_permissions table) ─────
/** Per-module CRUD permissions for an admin */
export interface AdminPermission {
  id: string;
  adminId: string;
  module: AdminModule;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

// ─── Admin Profile (matches admin_profiles table) ────────────
/**
 * Full admin profile as stored in the database.
 * Links a user to their admin role and permissions.
 */
export interface AdminProfile {
  id: string;
  userId: string;
  adminRole: AdminRole;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  /** Joined from users table */
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  /** Joined from admin_permissions table */
  permissions: AdminPermission[];
}

// ─── Auth Request / Response ─────────────────────────────────
/** Credentials sent to the login endpoint */
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

/**
 * Shape of the login API response.
 * Matches the expected NestJS response structure:
 *   POST /api/admin/login → { admin, accessToken }
 */
export interface AdminLoginResponse {
  admin: Admin;
  accessToken: string;
}

// ─── Auth State ──────────────────────────────────────────────
/** Shape of the auth context value */
export interface AdminAuthState {
  /** The currently authenticated admin, or null */
  admin: Admin | null;
  /** Whether an admin is currently authenticated */
  isAuthenticated: boolean;
  /** True while restoring session from storage on initial load */
  isLoading: boolean;
  /** Authenticate with email/password */
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  /** Clear session and redirect to login */
  logout: () => void;
}
