"use client";

/**
 * Admin Authentication Context
 *
 * Provides global admin auth state to all admin pages.
 * Handles:
 *   - Session restoration on mount (via refresh token cookie)
 *   - Login with email/password
 *   - Logout with server-side session cleanup
 *
 * Usage:
 *   Wrap admin routes with <AdminAuthProvider>
 *   Access state via useAdminAuth() hook
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
  // Attempts to refresh the access token using the HttpOnly cookie
  // and fetch the admin's profile. If successful, the user stays
  // logged in across page refreshes.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const restoredAdmin = await adminAuthService.restoreSession();
        if (!cancelled && restoredAdmin) {
          setAdmin(restoredAdmin);
        }
      } catch (error) {
        console.error("[AdminAuth] Failed to restore session:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: AdminLoginCredentials) => {
      const loggedInAdmin = await adminAuthService.login(credentials);
      setAdmin(loggedInAdmin);
      router.push("/internal-hq");
    },
    [router]
  );

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await adminAuthService.logout();
    setAdmin(null);
    router.push("/internal-hq/login");
  }, [router]);

  // ── Refresh ────────────────────────────────────────────────
  const refreshAdmin = useCallback(async () => {
    try {
      const updatedAdmin = await adminAuthService.restoreSession();
      if (updatedAdmin) {
        setAdmin(updatedAdmin);
      }
    } catch (error) {
      console.error("[AdminAuth] Failed to refresh admin:", error);
    }
  }, []);

  // ── Context value ──────────────────────────────────────────
  const value: AdminAuthState = {
    admin,
    isAuthenticated: admin !== null,
    isLoading,
    login,
    logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
