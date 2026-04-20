"use client";

/**
 * Access Denied Component
 *
 * Shown when an authenticated admin tries to access a route
 * that requires a higher role than they have.
 *
 * Displays the user's current role, the required role,
 * and a button to go back to the dashboard.
 */

import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { AdminRole } from "@/lib/adminTypes";

interface AccessDeniedProps {
  /** The admin's current role */
  userRole: AdminRole;
  /** The role required to access this route */
  requiredRole: AdminRole;
}

export default function AccessDenied({ userRole, requiredRole }: AccessDeniedProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          You don&apos;t have permission to view this page.
          This area requires <strong className="text-gray-700">{formatRole(requiredRole)}</strong> access.
        </p>

        {/* Role badges */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <RoleBadge label="Your Role" role={userRole} variant="current" />
          <span className="text-gray-300">→</span>
          <RoleBadge label="Required" role={requiredRole} variant="required" />
        </div>

        {/* Back button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

// ─── Helper Components ───────────────────────────────────────

function RoleBadge({
  label,
  role,
  variant,
}: {
  label: string;
  role: AdminRole;
  variant: "current" | "required";
}) {
  const colors = variant === "current"
    ? "bg-gray-100 text-gray-600 border-gray-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${colors}`}>
        {formatRole(role)}
      </span>
    </div>
  );
}

function formatRole(role: AdminRole): string {
  return role.replace("_", " ");
}
