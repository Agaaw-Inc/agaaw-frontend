"use client";

/**
 * Admin Authentication Context
 *
 * Provides global admin auth state to all admin pages.
 * Handles session restoration on mount (from localStorage),
 * login, and logout.
 *
 * Usage:
 *   Wrap admin routes with <AdminAuthProvider>
 *   Access state via useAdminAuth() hook
 *
 * Backend integration:
 *   No changes needed here — all logic is delegated to adminAuthService.
 *   Just update the service methods to call real APIs.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Admin, AdminAuthState, AdminLoginCredentials } from "@/lib/adminTypes";
import { adminAuthService } from "@/services/adminAuthService";

// ─── Context ─────────────────────────────────────────────────
export const AdminAuthContext = createContext<AdminAuthState | null>(null);

// ─── Provider ────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ───────────────────────────────
  useEffect(() => {
    try {
      const storedAdmin = adminAuthService.getCurrentAdmin();
      if (storedAdmin) {
        setAdmin(storedAdmin);
      }
    } catch (error) {
      console.error("[AdminAuth] Failed to restore session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: AdminLoginCredentials) => {
      const response = await adminAuthService.login(credentials);
      setAdmin(response.admin);
      router.push("/admin");
    },
    [router]
  );

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await adminAuthService.logout();
    setAdmin(null);
    router.push("/admin/login");
  }, [router]);

  // ── Context value ──────────────────────────────────────────
  const value: AdminAuthState = {
    admin,
    isAuthenticated: admin !== null,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
