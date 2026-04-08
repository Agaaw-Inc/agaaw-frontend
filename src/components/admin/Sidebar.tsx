"use client";

import { useState } from "react";
import { LayoutDashboard, Globe, GraduationCap, Users, Settings, Menu, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="bg-white shadow-sm border-r border-gray-100 hidden md:flex flex-col"
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        {!collapsed && <span className="font-bold text-lg text-teal-700">Agaaw Admin</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        <SidebarItem href="/dashboard/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/countries" icon={<Globe size={18} />} label="Countries" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/scholarships" icon={<GraduationCap size={18} />} label="Scholarships" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/blogs" icon={<BookOpen size={18} />} label="Blogs" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/users" icon={<Users size={18} />} label="Users" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} />
      </nav>
    </motion.aside>
  );
}

function SidebarItem({ href, icon, label, collapsed }: { href: string; icon: React.ReactNode; label: string; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(href));

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