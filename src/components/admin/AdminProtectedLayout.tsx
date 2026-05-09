"use client";

/**
 * Admin Protected Layout
 *
 * Client-side auth guard for all admin dashboard pages.
 * Handles three states:
 *   1. Loading — shows spinner while checking session
 *   2. Not authenticated — redirects to /admin/login
 *   3. Authenticated — checks RBAC, renders page or AccessDenied
 *
 * Wraps the sidebar + topbar + main content area.
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { hasPermission, getRequiredRole } from "@/lib/rbac";
import type { AdminRole } from "@/lib/adminTypes";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AccessDenied from "./AccessDenied";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ── Redirect to login if not authenticated ─────────────────
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // ── Loading state — prevents UI flicker ────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          <p className="text-sm text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated — redirect in progress ───────────────
  if (!isAuthenticated || !admin) {
    return null;
  }

  // ── RBAC check ─────────────────────────────────────────────
  // Use the admin's AdminRole (from admin_profiles table), not the User role.
  // This distinguishes between "super_admin" and "admin" permissions.
  const adminRole: AdminRole = admin.adminProfile?.adminRole ?? "admin";
  const requiredRole = getRequiredRole(pathname);
  const authorized = hasPermission(adminRole, requiredRole);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-y-auto flex-1">
          {authorized ? children : (
            <AccessDenied userRole={adminRole} requiredRole={requiredRole} />
          )}
        </main>
      </div>
    </div>
  );
}
