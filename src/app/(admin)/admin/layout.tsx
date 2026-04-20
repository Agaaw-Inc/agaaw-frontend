/**
 * Admin Root Layout
 *
 * Top-level layout for all /admin/* routes.
 * Wraps everything in AdminAuthProvider so auth state
 * is available to both the login page and dashboard pages.
 */

import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata = {
  title: "Admin Portal | Agaaw",
  description: "Agaaw administration dashboard",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
