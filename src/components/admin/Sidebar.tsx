"use client";

/**
 * Admin Sidebar
 *
 * Navigation sidebar for the admin dashboard.
 * Features:
 *   - Collapsible design with animation
 *   - Role-based link visibility (RBAC)
 *   - Active state highlighting
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
  ShieldCheck,
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
  /** Minimum role required to see this link. Defaults to "ADMIN". */
  requiredRole?: AdminRole;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin",              icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/admin/countries",    icon: <Globe size={18} />,           label: "Countries" },
  { href: "/admin/scholarships", icon: <GraduationCap size={18} />,   label: "Scholarships" },
  { href: "/admin/blogs",        icon: <BookOpen size={18} />,        label: "Blogs" },
  { href: "/admin/users",        icon: <Users size={18} />,           label: "Users",    requiredRole: "SUPER_ADMIN" },
  { href: "/admin/admins",       icon: <UserCog size={18} />,         label: "Admins",   requiredRole: "SUPER_ADMIN" },
  { href: "/admin/settings",     icon: <Settings size={18} />,        label: "Settings", requiredRole: "SUPER_ADMIN" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin } = useAdminAuth();

  // Filter nav items based on admin's role
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.requiredRole) return true;
    if (!admin) return false;
    return hasPermission(admin.role, item.requiredRole);
  });

  return (
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
            {admin.role.replace("_", " ")}
          </span>
        </div>
      )}
    </motion.aside>
  );
}

// ─── Sidebar Item ────────────────────────────────────────────
function SidebarItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
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