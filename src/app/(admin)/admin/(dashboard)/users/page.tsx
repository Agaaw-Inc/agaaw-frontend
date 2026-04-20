"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ShieldCheck, ShieldOff, UserCircle2, ChevronDown } from "lucide-react";
import UserModal from "@/components/admin/user/UserModal";
import { UserFormValues } from "@/lib/validation/userSchema";

/* ─── Mock seed data ─────────────────────────────────────────── */
type User = UserFormValues & { id: number; created_at: string };

const SEED_USERS: User[] = [
  { id: 1, name: "Arif Rahman", email: "arif@example.com", password: "hashed", role: "mentor", profile_image: "", is_verified: true, created_at: "2025-11-03" },
  { id: 2, name: "Sadia Islam", email: "sadia@example.com", password: "hashed", role: "student", profile_image: "", is_verified: true, created_at: "2025-11-14" },
  { id: 3, name: "Nabil Hossain", email: "nabil@example.com", password: "hashed", role: "student", profile_image: "", is_verified: false, created_at: "2025-12-01" },
  { id: 4, name: "Mitu Akter", email: "mitu@example.com", password: "hashed", role: "mentor", profile_image: "", is_verified: true, created_at: "2026-01-09" },
  { id: 5, name: "Rakib Hasan", email: "rakib@example.com", password: "hashed", role: "student", profile_image: "", is_verified: false, created_at: "2026-01-22" },
  { id: 6, name: "Tania Begum", email: "tania@example.com", password: "hashed", role: "student", profile_image: "", is_verified: true, created_at: "2026-02-05" },
  { id: 7, name: "Farhan Ahmed", email: "farhan@example.com", password: "hashed", role: "mentor", profile_image: "", is_verified: true, created_at: "2026-02-18" },
  { id: 8, name: "Lamia Chowdhury", email: "lamia@example.com", password: "hashed", role: "student", profile_image: "", is_verified: false, created_at: "2026-03-07" },
];

type RoleFilter = "all" | "student" | "mentor";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  setTimeout(onHide, 2800);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 animate-fade-in">
      <ShieldCheck size={16} className="text-teal-400" />
      {message}
    </div>
  );
}

/* ─── Role Badge ─────────────────────────────────────────────── */
function RoleBadge({ role }: { role: "student" | "mentor" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        role === "mentor"
          ? "bg-violet-100 text-violet-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; mode: "create" | "edit"; user?: User }>({ open: false, mode: "create" });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ─── filtered list ─── */
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, search]);

  /* ─── tab counts ─── */
  const counts = useMemo(() => ({
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    mentor: users.filter((u) => u.role === "mentor").length,
  }), [users]);

  /* ─── handlers ─── */
  const handleSave = (data: UserFormValues) => {
    if (modal.mode === "create") {
      const newUser: User = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [newUser, ...prev]);
      setToast("User created successfully!");
    } else if (modal.user) {
      setUsers((prev) =>
        prev.map((u) => (u.id === modal.user!.id ? { ...u, ...data } : u))
      );
      setToast("User updated successfully!");
    }
    setModal({ open: false, mode: "create" });
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setToast(`${deleteTarget.name} has been removed.`);
      setDeleteTarget(null);
    }
  };

  const handleVerify = (user: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_verified: true } : u))
    );
    setToast(`Mentor ${user.name} verified successfully. Notification sent.`);
  };

  const TABS: { key: RoleFilter; label: string }[] = [
    { key: "all", label: "All Users" },
    { key: "student", label: "Students" },
    { key: "mentor", label: "Mentors" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage students and mentors on the platform</p>
        </div>
        <button
          id="add-user-btn"
          onClick={() => setModal({ open: true, mode: "create" })}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Role tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                roleFilter === tab.key
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  roleFilter === tab.key
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
          />
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
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                  <UserCircle2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No users found</p>
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* User info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {user.profile_image ? (
                          <img src={user.profile_image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  {/* Verified */}
                  <td className="px-5 py-4">
                    {user.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <ShieldOff size={14} /> Unverified
                      </span>
                    )}
                  </td>
                  {/* Created at */}
                  <td className="px-5 py-4 text-gray-500 text-xs">{user.created_at}</td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!user.is_verified && user.role === "mentor" && (
                        <button
                          onClick={() => handleVerify(user)}
                          className="p-2 rounded-lg hover:bg-emerald-50 text-amber-500 hover:text-emerald-600 transition-colors"
                          title="Verify Mentor"
                        >
                          <ShieldCheck size={15} />
                        </button>
                      )}
                      <button
                        id={`edit-user-${user.id}`}
                        onClick={() => setModal({ open: true, mode: "edit", user })}
                        className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        id={`delete-user-${user.id}`}
                        onClick={() => handleDelete(user)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {users.length} users
            </p>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal.open && (
        <UserModal
          mode={modal.mode}
          defaultValues={modal.user}
          onClose={() => setModal({ open: false, mode: "create" })}
          onSubmit={handleSave}
        />
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove User?</h3>
            <p className="text-sm text-gray-500 mb-6">
              <strong>{deleteTarget.name}</strong> will be permanently removed from the platform.
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
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Remove
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
