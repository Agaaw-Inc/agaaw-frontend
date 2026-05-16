/**
 * Admin Login Layout
 *
 * Minimal layout for the login page — no sidebar or topbar.
 * Just provides the auth context (needed for redirect-if-authenticated logic).
 */

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
