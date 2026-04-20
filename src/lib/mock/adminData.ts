/**
 * Mock Admin Management Data
 *
 * Simulates data from the admin_profiles and admin_permissions tables.
 * Includes mock users that can be "promoted" to admin.
 *
 * TODO: Replace with API calls:
 *   GET  /api/admin/admins         → list all admin profiles
 *   POST /api/admin/admins         → create (promote user to admin)
 *   PUT  /api/admin/admins/:id     → update role/permissions
 *   PATCH /api/admin/admins/:id/status → activate/deactivate
 *   GET  /api/users/search?q=...   → search users for promotion
 */

import type {
  AdminProfile,
  AdminPermission,
  AdminModule,
  AdminRole,
  ALL_ADMIN_MODULES,
} from "@/lib/adminTypes";

// ─── Mock Users (from the `users` table) ─────────────────────
/** Users who can potentially be promoted to admin */
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "mentor";
  profileImage?: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "user-001", name: "Omar Faruk", email: "admin@agaaw.com", role: "student" },
  { id: "user-002", name: "Sadia Islam", email: "sadia@example.com", role: "mentor" },
  { id: "user-003", name: "Arif Rahman", email: "arif@example.com", role: "mentor" },
  { id: "user-004", name: "Nabil Hossain", email: "nabil@example.com", role: "student" },
  { id: "user-005", name: "Mitu Akter", email: "mitu@example.com", role: "mentor" },
  { id: "user-006", name: "Rakib Hasan", email: "rakib@example.com", role: "student" },
  { id: "user-007", name: "Tania Begum", email: "tania@example.com", role: "student" },
  { id: "user-008", name: "Farhan Ahmed", email: "farhan@example.com", role: "mentor" },
  { id: "user-009", name: "Lamia Chowdhury", email: "lamia@example.com", role: "student" },
  { id: "user-010", name: "Zayed Khan", email: "zayed@example.com", role: "student" },
];

// ─── Helper: Generate full permissions for super admin ───────
function fullPermissions(adminId: string, modules: string[]): AdminPermission[] {
  return modules.map((mod, i) => ({
    id: `perm-${adminId}-${i}`,
    adminId,
    module: mod as AdminModule,
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
  }));
}

// ─── Helper: Generate limited permissions ────────────────────
function limitedPermissions(
  adminId: string,
  config: Partial<Record<AdminModule, { c: boolean; r: boolean; u: boolean; d: boolean }>>
): AdminPermission[] {
  return Object.entries(config).map(([mod, perms], i) => ({
    id: `perm-${adminId}-${i}`,
    adminId,
    module: mod as AdminModule,
    canCreate: perms?.c ?? false,
    canRead: perms?.r ?? true,
    canUpdate: perms?.u ?? false,
    canDelete: perms?.d ?? false,
  }));
}

// ─── Mock Admin Profiles ─────────────────────────────────────
export const MOCK_ADMIN_PROFILES: AdminProfile[] = [
  {
    id: "admin-001",
    userId: "user-001",
    adminRole: "SUPER_ADMIN",
    isActive: true,
    createdBy: null, // bootstrapped — first super admin
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
    user: {
      id: "user-001",
      name: "Omar Faruk",
      email: "admin@agaaw.com",
    },
    permissions: fullPermissions("admin-001", [
      "users", "scholarships", "blogs", "countries", "settings",
    ]),
  },
  {
    id: "admin-002",
    userId: "user-002",
    adminRole: "ADMIN",
    isActive: true,
    createdBy: "user-001",
    createdAt: "2025-08-15T00:00:00Z",
    updatedAt: "2025-08-15T00:00:00Z",
    user: {
      id: "user-002",
      name: "Sadia Islam",
      email: "sadia@example.com",
    },
    permissions: limitedPermissions("admin-002", {
      blogs: { c: true, r: true, u: true, d: false },
      scholarships: { c: true, r: true, u: true, d: false },
      countries: { c: false, r: true, u: false, d: false },
    }),
  },
  {
    id: "admin-003",
    userId: "user-003",
    adminRole: "ADMIN",
    isActive: false, // deactivated
    createdBy: "user-001",
    createdAt: "2025-10-20T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
    user: {
      id: "user-003",
      name: "Arif Rahman",
      email: "arif@example.com",
    },
    permissions: limitedPermissions("admin-003", {
      blogs: { c: true, r: true, u: true, d: true },
    }),
  },
];

// ─── IDs of users already promoted to admin ──────────────────
export function getPromotedUserIds(profiles: AdminProfile[]): Set<string> {
  return new Set(profiles.map((p) => p.userId));
}
