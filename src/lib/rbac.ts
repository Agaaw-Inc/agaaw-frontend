/**
 * Role-Based Access Control (RBAC) Utilities
 *
 * Provides permission checking and route-to-role mapping.
 * The role hierarchy is defined in adminTypes.ts.
 */

import { AdminRole, ROLE_HIERARCHY } from "./adminTypes";

// ─── Permission Check ────────────────────────────────────────
/**
 * Checks if a user's role has enough privileges for a required role.
 * Uses numeric hierarchy comparison — higher = more access.
 *
 * @example
 *   hasPermission("super_admin", "admin")   // true
 *   hasPermission("admin", "super_admin")   // false
 *   hasPermission("admin", "admin")         // true
 */
export function hasPermission(
  userRole: AdminRole,
  requiredRole: AdminRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// ─── Route → Required Role Mapping ──────────────────────────
/**
 * Defines the minimum role required to access each admin route.
 * Routes not listed here default to "admin" (any admin can access).
 *
 * When adding new admin routes, register them here to enforce RBAC.
 */
export const ROUTE_PERMISSIONS: Record<string, AdminRole> = {
  // General — accessible by any admin
  "/admin": "admin",
  "/admin/countries": "admin",
  "/admin/scholarships": "admin",
  "/admin/blogs": "admin",
  "/admin/mentors": "admin",

  // Restricted — super_admin only
  "/admin/users": "super_admin",
  "/admin/admins": "super_admin",
  "/admin/settings": "super_admin",
  "/admin/logs": "super_admin",
};

/**
 * Resolves the required role for a given pathname.
 * Checks for exact match first, then prefix match for sub-routes
 * (e.g., /admin/users/123 → checks /admin/users).
 *
 * Falls back to "admin" if no mapping is found.
 */
export function getRequiredRole(pathname: string): AdminRole {
  // Exact match
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Prefix match — find the most specific (longest) matching route
  const matchingRoutes = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => pathname.startsWith(route + "/"))
    .sort((a, b) => b.length - a.length); // longest first

  if (matchingRoutes.length > 0) {
    return ROUTE_PERMISSIONS[matchingRoutes[0]];
  }

  // Default: any admin can access unregistered routes
  return "admin";
}
