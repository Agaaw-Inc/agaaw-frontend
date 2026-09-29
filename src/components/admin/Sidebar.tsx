"use client";

/**
 * Admin Sidebar
 *
 * Navigation sidebar for the admin dashboard.
 * Features:
 *   - Collapsible design with animation
 *   - Role-based link visibility (RBAC)
 *   - Active state highlighting
 *   - Links for Mentors and Activity Logs
 */

import { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  GraduationCap,
  Users,
  UserCog,
  Settings,
  Menu,
  BookOpen,
  Megaphone,
  ShieldCheck,
  ScrollText,
  CreditCard,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { hasPermission } from "@/lib/rbac";
import type { AdminRole } from "@/lib/adminTypes";

// ─── Navigation items with optional role requirement ─────────
interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  /** Minimum role required to see this link. Defaults to "admin". */
  requiredRole?: AdminRole;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/internal-hq",              icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/internal-hq/countries",    icon: <Globe size={18} />,           label: "Countries" },
  { href: "/internal-hq/scholarships", icon: <GraduationCap size={18} />,   label: "Scholarships" },
  { href: "/internal-hq/blogs",        icon: <BookOpen size={18} />,        label: "Blogs" },
  { href: "/internal-hq/mentors",      icon: <GraduationCap size={18} />,   label: "Mentors" },
  { href: "/internal-hq/payments",     icon: <CreditCard size={18} />,      label: "Payments" },
  { href: "/internal-hq/announcements", icon: <Megaphone size={18} />,      label: "Announcements" },
  { href: "/internal-hq/users",        icon: <Users size={18} />,           label: "Users",    requiredRole: "super_admin" },
  { href: "/internal-hq/admins",       icon: <UserCog size={18} />,         label: "Admins",   requiredRole: "super_admin" },
  { href: "/internal-hq/logs",         icon: <ScrollText size={18} />,      label: "Logs",     requiredRole: "super_admin" },
  { href: "/internal-hq/settings",     icon: <Settings size={18} />,        label: "Settings", requiredRole: "super_admin" },
];

/** The page's nav label, for the top bar title ("Payments", "Users"…). */
export function pageTitle(pathname: string): string {
  const match = NAV_ITEMS.filter(
    (item) => pathname === item.href || (item.href !== "/internal-hq" && pathname.startsWith(item.href + "/")),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Dashboard";
}

interface SidebarProps {
  /** Phones/tablets: whether the slide-in drawer is open. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { admin } = useAdminAuth();

  // Resolve the admin's AdminRole for RBAC checks
  // The admin.adminProfile.adminRole is the real role ("super_admin" | "admin")
  const adminRole: AdminRole = admin?.adminProfile?.adminRole ?? "admin";

  // Filter nav items based on admin's role
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.requiredRole) return true;
    return hasPermission(adminRole, item.requiredRole);
  });

  return (
    <>
      {/* ── Phones & tablets: slide-in drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-600" />
                <span className="font-bold text-lg text-teal-700">Agaaw Admin</span>
              </div>
              <button onClick={onMobileClose} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {visibleItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={false}
                  onNavigate={onMobileClose}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Desktop: collapsible rail ── */}
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="bg-white shadow-sm border-r border-gray-100 hidden md:flex flex-col"
    >
      {/* ── Header ── */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-600" />
            <span className="font-bold text-lg text-teal-700">Agaaw Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* ── Navigation links ── */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {visibleItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* ── Role indicator (expanded only) ── */}
      {!collapsed && admin && (
        <div className="px-4 py-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 uppercase tracking-wider">
            {adminRole.replace("_", " ")}
          </span>
        </div>
      )}
    </motion.aside>
    </>
  );
}

// ─── Sidebar Item ────────────────────────────────────────────
function SidebarItem({
  href,
  icon,
  label,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/internal-hq" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isActive
          ? "bg-teal-50 text-teal-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      title={collapsed ? label : undefined}
    >
      <span className={isActive ? "text-teal-700" : ""}>{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}