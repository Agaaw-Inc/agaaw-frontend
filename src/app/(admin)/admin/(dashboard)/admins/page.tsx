"use client";

/**
 * Manage Admins Page
 *
 * SUPER_ADMIN-only page for managing admin accounts.
 * Features:
 *   - List all admins with role, status, permissions summary
 *   - Promote existing users to admin (search by email)
 *   - Edit admin role and per-module CRUD permissions
 *   - Activate/deactivate admins
 *
 * TODO: Replace mock data with API calls:
 *   GET  /api/admin/admins         → list admin profiles
 *   POST /api/admin/admins         → promote user
 *   PUT  /api/admin/admins/:id     → update role/permissions
 *   PATCH /api/admin/admins/:id/status → toggle active
 *   GET  /api/users/search?q=...   → search users
 */

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  UserCog,
  CheckCircle2,
  XCircle,
  Crown,
  X,
} from "lucide-react";
import type {
  AdminProfile,
  AdminPermission,
  AdminModule,
  AdminRole,
} from "@/lib/adminTypes";
import { ALL_ADMIN_MODULES } from "@/lib/adminTypes";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  MOCK_ADMIN_PROFILES,
  MOCK_USERS,
  getPromotedUserIds,
  type MockUser,
} from "@/lib/mock/adminData";

// ─── MODULE LABELS ───────────────────────────────────────────
const MODULE_LABELS: Record<AdminModule, string> = {
  users: "Users",
  scholarships: "Scholarships",
  blogs: "Blogs",
  countries: "Countries",
  settings: "Settings",
};

// ─── TOAST ───────────────────────────────────────────────────
function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  setTimeout(onHide, 3000);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-400" />
      {message}
    </div>
  );
}

// ─── ROLE BADGE ──────────────────────────────────────────────
function RoleBadge({ role }: { role: AdminRole }) {
  const isSuperAdmin = role === "SUPER_ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isSuperAdmin
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-teal-50 text-teal-700 border border-teal-200"
      }`}
    >
      {isSuperAdmin && <Crown size={10} />}
      {role.replace("_", " ")}
    </span>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isActive ? "text-emerald-600" : "text-gray-400"
      }`}
    >
      {isActive ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── PERMISSIONS SUMMARY ─────────────────────────────────────
function PermissionsSummary({ permissions }: { permissions: AdminPermission[] }) {
  if (permissions.length === 0) {
    return <span className="text-xs text-gray-400">No permissions</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {permissions.map((p) => {
        const actions = [
          p.canCreate && "C",
          p.canRead && "R",
          p.canUpdate && "U",
          p.canDelete && "D",
        ].filter(Boolean);

        return (
          <span
            key={p.id}
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 text-gray-600"
            title={`${MODULE_LABELS[p.module]}: ${actions.join(", ")}`}
          >
            {MODULE_LABELS[p.module].slice(0, 4)}
            <span className="ml-1 text-teal-600 font-bold">{actions.join("")}</span>
          </span>
        );
      })}
    </div>
  );
}

// ─── PERMISSION TOGGLE GRID ─────────────────────────────────
function PermissionGrid({
  permissions,
  onChange,
}: {
  permissions: Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;
  onChange: (module: AdminModule, action: string, value: boolean) => void;
}) {
  const actions = [
    { key: "canCreate", label: "Create", short: "C" },
    { key: "canRead",   label: "Read",   short: "R" },
    { key: "canUpdate", label: "Update", short: "U" },
    { key: "canDelete", label: "Delete", short: "D" },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Module
        </div>
        {actions.map((a) => (
          <div
            key={a.key}
            className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
          >
            {a.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {ALL_ADMIN_MODULES.map((mod, idx) => (
        <div
          key={mod}
          className={`grid grid-cols-5 ${idx < ALL_ADMIN_MODULES.length - 1 ? "border-b border-gray-100" : ""}`}
        >
          <div className="px-4 py-3 text-sm font-medium text-gray-700 flex items-center">
            {MODULE_LABELS[mod]}
          </div>
          {actions.map((a) => (
            <div key={a.key} className="px-4 py-3 flex items-center justify-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions[mod]?.[a.key as keyof typeof permissions[typeof mod]] ?? false}
                  onChange={(e) => onChange(mod, a.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── PROMOTE USER MODAL ──────────────────────────────────────
function PromoteModal({
  users,
  promotedIds,
  onClose,
  onPromote,
}: {
  users: MockUser[];
  promotedIds: Set<string>;
  onClose: () => void;
  onPromote: (userId: string, role: AdminRole, permissions: Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<AdminRole>("ADMIN");
  const [step, setStep] = useState<"search" | "permissions">("search");

  // Initialize permission grid — all read-only by default
  const [permissions, setPermissions] = useState<
    Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>
  >(() => {
    const initial: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
    ALL_ADMIN_MODULES.forEach((mod) => {
      initial[mod] = { canCreate: false, canRead: true, canUpdate: false, canDelete: false };
    });
    return initial as Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;
  });

  const handlePermissionChange = (module: AdminModule, action: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: value },
    }));
  };

  // Set full access for SUPER_ADMIN
  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    if (newRole === "SUPER_ADMIN") {
      const full: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
      ALL_ADMIN_MODULES.forEach((mod) => {
        full[mod] = { canCreate: true, canRead: true, canUpdate: true, canDelete: true };
      });
      setPermissions(full as Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (promotedIds.has(u.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {step === "search" ? "Promote User to Admin" : "Set Permissions"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === "search"
                ? "Search for an existing user to grant admin access"
                : `Configure access for ${selectedUser?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === "search" ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* User list */}
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">
                    {search ? "No matching users found" : "All users are already admins"}
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setStep("permissions");
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-teal-50 ${
                        selectedUser?.id === user.id ? "bg-teal-50 ring-1 ring-teal-200" : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Selected user */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
                  {selectedUser?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser?.name}</p>
                  <p className="text-xs text-gray-400">{selectedUser?.email}</p>
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Role</label>
                <div className="flex gap-3">
                  {(["ADMIN", "SUPER_ADMIN"] as AdminRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        role === r
                          ? r === "SUPER_ADMIN"
                            ? "bg-amber-50 border-amber-300 text-amber-700"
                            : "bg-teal-50 border-teal-300 text-teal-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {r === "SUPER_ADMIN" && <Crown size={12} className="inline mr-1" />}
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
                {role === "SUPER_ADMIN" && (
                  <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Super Admin has full access to all modules. Permissions are set automatically.
                  </p>
                )}
              </div>

              {/* Permission grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Permissions
                </label>
                <PermissionGrid
                  permissions={permissions}
                  onChange={handlePermissionChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          {step === "permissions" && (
            <button
              onClick={() => setStep("search")}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors ml-auto"
          >
            Cancel
          </button>
          {step === "permissions" && selectedUser && (
            <button
              onClick={() => onPromote(selectedUser.id, role, permissions)}
              className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors"
            >
              Promote to Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT PERMISSIONS MODAL ──────────────────────────────────
function EditModal({
  profile,
  onClose,
  onSave,
}: {
  profile: AdminProfile;
  onClose: () => void;
  onSave: (adminId: string, role: AdminRole, permissions: Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>) => void;
}) {
  const [role, setRole] = useState<AdminRole>(profile.adminRole);

  // Build permission state from existing permissions
  const [permissions, setPermissions] = useState<
    Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>
  >(() => {
    const initial: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
    ALL_ADMIN_MODULES.forEach((mod) => {
      const existing = profile.permissions.find((p) => p.module === mod);
      initial[mod] = existing
        ? { canCreate: existing.canCreate, canRead: existing.canRead, canUpdate: existing.canUpdate, canDelete: existing.canDelete }
        : { canCreate: false, canRead: false, canUpdate: false, canDelete: false };
    });
    return initial as Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;
  });

  const handlePermissionChange = (module: AdminModule, action: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: value },
    }));
  };

  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    if (newRole === "SUPER_ADMIN") {
      const full: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
      ALL_ADMIN_MODULES.forEach((mod) => {
        full[mod] = { canCreate: true, canRead: true, canUpdate: true, canDelete: true };
      });
      setPermissions(full as Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>);
    }
  };

  // Prevent editing yourself (the logged-in super admin)
  const { admin } = useAdminAuth();
  const isSelf = admin?.id === profile.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Admin</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Update role and permissions for {profile.user.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Admin info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
              {profile.user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{profile.user.name}</p>
              <p className="text-xs text-gray-400">{profile.user.email}</p>
            </div>
          </div>

          {isSelf && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
              <ShieldAlert size={14} />
              You cannot modify your own role or permissions.
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Role</label>
            <div className="flex gap-3">
              {(["ADMIN", "SUPER_ADMIN"] as AdminRole[]).map((r) => (
                <button
                  key={r}
                  disabled={isSelf}
                  onClick={() => handleRoleChange(r)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    role === r
                      ? r === "SUPER_ADMIN"
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {r === "SUPER_ADMIN" && <Crown size={12} className="inline mr-1" />}
                  {r.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Permission grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module Permissions
            </label>
            <PermissionGrid permissions={permissions} onChange={handlePermissionChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isSelf}
            onClick={() => onSave(profile.id, role, permissions)}
            className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function ManageAdminsPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminProfile[]>(MOCK_ADMIN_PROFILES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Derived
  const promotedIds = useMemo(() => getPromotedUserIds(admins), [admins]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && a.isActive) ||
        (statusFilter === "inactive" && !a.isActive);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.user.name.toLowerCase().includes(q) ||
        a.user.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [admins, statusFilter, search]);

  const counts = useMemo(
    () => ({
      all: admins.length,
      active: admins.filter((a) => a.isActive).length,
      inactive: admins.filter((a) => !a.isActive).length,
    }),
    [admins]
  );

  // ── Handlers ───────────────────────────────────────────────
  const handlePromote = (
    userId: string,
    role: AdminRole,
    permissions: Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>
  ) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) return;

    const newId = `admin-${Date.now()}`;
    const newPermissions: AdminPermission[] = Object.entries(permissions)
      .filter(([, p]) => p.canRead || p.canCreate || p.canUpdate || p.canDelete)
      .map(([mod, p], i) => ({
        id: `perm-${newId}-${i}`,
        adminId: newId,
        module: mod as AdminModule,
        canCreate: p.canCreate,
        canRead: p.canRead,
        canUpdate: p.canUpdate,
        canDelete: p.canDelete,
      }));

    const newAdmin: AdminProfile = {
      id: newId,
      userId: user.id,
      adminRole: role,
      isActive: true,
      createdBy: currentAdmin?.id ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: user.id, name: user.name, email: user.email },
      permissions: newPermissions,
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    setPromoteOpen(false);
    setToast(`${user.name} has been promoted to ${role.replace("_", " ")}`);
  };

  const handleEditSave = (
    adminId: string,
    role: AdminRole,
    permissions: Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>
  ) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id !== adminId) return a;

        const updatedPermissions: AdminPermission[] = Object.entries(permissions)
          .filter(([, p]) => p.canRead || p.canCreate || p.canUpdate || p.canDelete)
          .map(([mod, p], i) => ({
            id: `perm-${adminId}-${i}`,
            adminId,
            module: mod as AdminModule,
            canCreate: p.canCreate,
            canRead: p.canRead,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete,
          }));

        return {
          ...a,
          adminRole: role,
          permissions: updatedPermissions,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setEditTarget(null);
    setToast("Admin permissions updated successfully");
  };

  const handleToggleActive = (profile: AdminProfile) => {
    // Prevent deactivating yourself
    if (currentAdmin?.id === profile.id) return;

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === profile.id
          ? { ...a, isActive: !a.isActive, updatedAt: new Date().toISOString() }
          : a
      )
    );
    setToast(
      profile.isActive
        ? `${profile.user.name} has been deactivated`
        : `${profile.user.name} has been reactivated`
    );
  };

  // ── Filter tabs ────────────────────────────────────────────
  const TABS: { key: typeof statusFilter; label: string }[] = [
    { key: "all", label: "All Admins" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Promote users, assign roles, and manage per-module permissions
          </p>
        </div>
        <button
          onClick={() => setPromoteOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Promote User
        </button>
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === tab.key
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === tab.key
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                  <UserCog size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No admins found</p>
                </td>
              </tr>
            ) : (
              filteredAdmins.map((profile) => {
                const isSelf = currentAdmin?.id === profile.id;
                return (
                  <tr
                    key={profile.id}
                    className={`hover:bg-gray-50/60 transition-colors group ${!profile.isActive ? "opacity-60" : ""}`}
                  >
                    {/* Admin info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {profile.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-1.5">
                            {profile.user.name}
                            {isSelf && (
                              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-gray-400 text-xs">{profile.user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <RoleBadge role={profile.adminRole} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge isActive={profile.isActive} />
                    </td>

                    {/* Permissions */}
                    <td className="px-5 py-4">
                      {profile.adminRole === "SUPER_ADMIN" ? (
                        <span className="text-xs text-amber-600 font-medium">Full Access</span>
                      ) : (
                        <PermissionsSummary permissions={profile.permissions} />
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(profile.createdAt).toLocaleDateString()}
                      {profile.createdBy && (
                        <p className="text-gray-400 text-[10px] mt-0.5">
                          by {admins.find((a) => a.userId === profile.createdBy)?.user.name || "System"}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditTarget(profile)}
                          className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-700 transition-colors"
                          title="Edit permissions"
                        >
                          <Pencil size={15} />
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => handleToggleActive(profile)}
                            className={`p-2 rounded-lg transition-colors ${
                              profile.isActive
                                ? "hover:bg-red-50 text-gray-400 hover:text-red-600"
                                : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
                            }`}
                            title={profile.isActive ? "Deactivate" : "Reactivate"}
                          >
                            {profile.isActive ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        {filteredAdmins.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {filteredAdmins.length} of {admins.length} admins
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {promoteOpen && (
        <PromoteModal
          users={MOCK_USERS}
          promotedIds={promotedIds}
          onClose={() => setPromoteOpen(false)}
          onPromote={handlePromote}
        />
      )}

      {editTarget && (
        <EditModal
          profile={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
