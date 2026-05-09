"use client";

/**
 * Admin Topbar
 *
 * Top navigation bar for the admin dashboard.
 * Features:
 *   - Dynamic page title
 *   - Admin profile dropdown (name, email, role badge)
 *   - Logout button that clears session
 */

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/** Build a display name from the Admin object */
function getDisplayName(admin: { firstName?: string; lastName?: string; email?: string } | null): string {
  if (!admin) return "Admin";
  const full = [admin.firstName, admin.lastName].filter(Boolean).join(" ");
  return full || admin.email || "Admin";
}

/** Build initials from first + last name */
function getInitials(admin: { firstName?: string; lastName?: string } | null): string {
  if (!admin) return "A";
  const parts = [admin.firstName, admin.lastName].filter(Boolean);
  if (parts.length === 0) return "A";
  return parts
    .map((n) => n![0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Topbar() {
  const { admin, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = getDisplayName(admin);
  const initials = getInitials(admin);
  const roleLabel = admin?.adminProfile?.adminRole?.replace("_", " ") || admin?.role || "admin";

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-100">
      {/* ── Title ── */}
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>

      {/* ── Profile area ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          aria-label="Admin menu"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>

          {/* Name (desktop only) */}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {displayName}
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">
              {roleLabel}
            </p>
          </div>

          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* ── Dropdown ── */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
            {/* Admin info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {admin?.email}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 uppercase tracking-wider">
                  <ShieldCheck size={10} />
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Logout */}
            <div className="px-2 py-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}