/**
 * Admin Dashboard Layout
 *
 * Wraps all authenticated admin pages (the (dashboard) route group)
 * with the AdminProtectedLayout which handles:
 *   - Auth guard (redirect to login if unauthenticated)
 *   - RBAC check (AccessDenied if insufficient role)
 *   - Sidebar + Topbar chrome
 */

import AdminProtectedLayout from "@/components/admin/AdminProtectedLayout";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
}
