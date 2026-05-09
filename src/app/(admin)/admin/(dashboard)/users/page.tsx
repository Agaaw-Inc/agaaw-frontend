"use client";

/**
 * User Management Page
 *
 * Lists all platform users with server-side pagination, filtering, and search.
 * Fetches from GET /api/admin/users. Actions call real API endpoints.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Ban, ShieldAlert, ChevronLeft, ChevronRight, Loader2, AlertCircle, Download,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCircle2
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { UserListItem, UserRole, PaginatedResponse } from "@/lib/adminTypes";

type RoleFilter = "all" | "student" | "mentor" | "admin";
type BanFilter = "all" | "active" | "banned";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 2800); return () => clearTimeout(t); }, [onHide]);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2">
      <ShieldCheck size={16} className="text-teal-400" />
      {message}
    </div>
  );
}

/* ─── Role Badge ─────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    mentor: "bg-violet-100 text-violet-700",
    student: "bg-blue-100 text-blue-700",
    admin: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[role] || "bg-gray-100 text-gray-600"}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

/* ─── Ban Badge ──────────────────────────────────────────────── */
function BanBadge({ isBanned }: { isBanned: boolean }) {
  return isBanned ? (
    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
      <Ban size={13} /> Banned
    </span>
  ) : null;
}

/* ─── Loading Skeleton Row ───────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200" /><div><div className="h-3 w-28 bg-gray-200 rounded mb-1.5" /><div className="h-2.5 w-36 bg-gray-100 rounded" /></div></div></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-14 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-14 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-100 rounded" /></td>
    </tr>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function UsersPage() {
  // Data state
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [banFilter, setBanFilter] = useState<BanFilter>("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // UI state
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Export handler
  const handleExport = async () => {
    try {
      const params: Record<string, unknown> = {};
      if (searchDebounced) params.search = searchDebounced;
      if (roleFilter !== "all") params.role = roleFilter;
      if (banFilter === "banned") params.isBanned = true;
      if (banFilter === "active") params.isBanned = false;
      
      await adminApi.exportUsersCsv(params as any);
      setToast("Users exported successfully");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Export failed");
    }
  };

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [roleFilter, banFilter]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: 10 };
      if (searchDebounced) params.search = searchDebounced;
      if (roleFilter !== "all") params.role = roleFilter;
      if (banFilter === "banned") params.isBanned = true;
      if (banFilter === "active") params.isBanned = false;

      const result: PaginatedResponse<UserListItem> = await adminApi.listUsers(params as Parameters<typeof adminApi.listUsers>[0]);
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced, roleFilter, banFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ─── Action handlers ─── */
  const handleBan = async (user: UserListItem) => {
    setActionLoading(user.id);
    try {
      if (user.isBanned) {
        await adminApi.unbanUser(user.id);
        setToast(`${user.firstName} ${user.lastName} has been unbanned.`);
      } else {
        await adminApi.banUser(user.id);
        setToast(`${user.firstName} ${user.lastName} has been banned.`);
      }
      await fetchUsers();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (user: UserListItem, newRole: UserRole) => {
    if (newRole === user.role) return;
    setActionLoading(user.id);
    try {
      await adminApi.changeUserRole(user.id, { role: newRole });
      setToast(`${user.firstName} ${user.lastName} role changed to ${newRole}.`);
      await fetchUsers();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await adminApi.deleteUser(deleteTarget.id);
      setToast(`${deleteTarget.firstName} ${deleteTarget.lastName} has been removed.`);
      setDeleteTarget(null);
      await fetchUsers();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ─── Tab config ─── */
  const ROLE_TABS: { key: RoleFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "student", label: "Students" },
    { key: "mentor", label: "Mentors" },
    { key: "admin", label: "Admins" },
  ];

  const BAN_TABS: { key: BanFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "banned", label: "Banned" },
  ];

  const displayName = (u: UserListItem) => `${u.firstName} ${u.lastName}`.trim() || u.email;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage all platform users · {meta.total} total
        </p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Role tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  roleFilter === tab.key
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Ban filter */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {BAN_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setBanFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  banFilter === tab.key
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="user-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleExport}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-teal-700 hover:border-teal-200 hover:bg-teal-50/30 transition-all flex items-center gap-2 text-sm shrink-0 shadow-sm"
            title="Export CSV"
          >
            <Download size={16} />
            <span className="hidden md:inline font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                  <UserCircle2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* User info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={displayName(user)} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user.firstName?.[0] || user.email[0]).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{displayName(user)}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role with change dropdown */}
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user, e.target.value as UserRole)}
                      disabled={actionLoading === user.id || user.role === "admin"}
                      className="appearance-none bg-transparent border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  {/* Verified */}
                  <td className="px-5 py-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <ShieldOff size={14} /> Unverified
                      </span>
                    )}
                  </td>
                  {/* Banned status */}
                  <td className="px-5 py-4">
                    {user.isBanned ? (
                      <BanBadge isBanned />
                    ) : (
                      <span className="text-xs text-gray-400">Active</span>
                    )}
                  </td>
                  {/* Created at */}
                  <td className="px-5 py-4 text-gray-500 text-xs" suppressHydrationWarning>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {actionLoading === user.id ? (
                        <Loader2 size={16} className="animate-spin text-gray-400" />
                      ) : (
                        <>
                          {/* Ban/Unban */}
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleBan(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isBanned
                                  ? "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                                  : "hover:bg-amber-50 text-gray-400 hover:text-amber-600"
                              }`}
                              title={user.isBanned ? "Unban" : "Ban"}
                            >
                              {user.isBanned ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
                            </button>
                          )}
                          {/* Delete */}
                          {user.role !== "admin" && (
                            <button
                              onClick={() => setDeleteTarget(user)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── Pagination footer ── */}
        {meta.totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Page {meta.page} of {meta.totalPages} · {meta.total} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
                const pageNum = start + i;
                if (pageNum > meta.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      pageNum === meta.page
                        ? "bg-teal-700 text-white"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove User?</h3>
            <p className="text-sm text-gray-500 mb-6">
              <strong>{displayName(deleteTarget)}</strong> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={actionLoading === deleteTarget.id}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading === deleteTarget.id ? (
                  <><Loader2 size={14} className="animate-spin" /> Removing…</>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
