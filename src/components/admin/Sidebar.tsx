"use client";

import { useState } from "react";
import { LayoutDashboard, Globe, GraduationCap, Users, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="bg-white shadow-sm border-r border-gray-100 hidden md:flex flex-col"
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <span className="font-bold text-lg">Agaaw Admin</span>}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-2">
        <SidebarItem href="/dashboard/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/countries" icon={<Globe size={18} />} label="Countries" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/scholarships" icon={<GraduationCap size={18} />} label="Scholarships" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/mentors" icon={<Users size={18} />} label="Mentors" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/students" icon={<Users size={18} />} label="Students" collapsed={collapsed} />
        <SidebarItem href="/dashboard/admin/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} />
      </nav>
    </motion.aside>
  );
}

function SidebarItem({ href, icon, label, collapsed }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-all"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}