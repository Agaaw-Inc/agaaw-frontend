"use client";

/**
 * useAdminAuth Hook
 *
 * Convenience hook for accessing the AdminAuthContext.
 * Throws a clear error if used outside an AdminAuthProvider.
 *
 * Usage:
 *   const { admin, isAuthenticated, login, logout } = useAdminAuth();
 */

import { useContext } from "react";
import { AdminAuthContext } from "@/context/AdminAuthContext";
import type { AdminAuthState } from "@/lib/adminTypes";

export function useAdminAuth(): AdminAuthState {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth() must be used within an <AdminAuthProvider>. " +
        "Wrap your admin routes with AdminAuthProvider in the layout."
    );
  }

  return context;
}
