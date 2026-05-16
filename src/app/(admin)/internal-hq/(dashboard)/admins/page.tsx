"use client";

/**
 * Manage Admins Page
 *
 * SUPER_ADMIN-only page for managing admin accounts.
 * Fetches from GET /api/admin/admins with server-side pagination.
 * All actions call real API endpoints.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Search, Plus, Pencil, ShieldCheck, ShieldOff, ShieldAlert,
  UserCog, CheckCircle2, XCircle, Crown, X, Loader2,
  ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import type {
  AdminProfile, AdminPermission, AdminModule, AdminRole,
} from "@/lib/adminTypes";
import { ALL_ADMIN_MODULES, MODULE_LABELS } from "@/lib/adminTypes";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import * as adminApi from "@/lib/adminApi";

// ─── TOAST ───────────────────────────────────────────────────
function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); }, [onHide]);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-400" />
      {message}
    </div>
  );
}

// ─── ROLE BADGE ──────────────────────────────────────────────
function RoleBadge({ role }: { role: AdminRole }) {
  const isSuperAdmin = role === "super_admin";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isSuperAdmin ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-teal-50 text-teal-700 border border-teal-200"
    }`}>
      {isSuperAdmin && <Crown size={10} />}
      {role.replace("_", " ")}
    </span>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isActive ? "text-emerald-600" : "text-gray-400"}`}>
      {isActive ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── PERMISSIONS SUMMARY ─────────────────────────────────────
function PermissionsSummary({ permissions }: { permissions: AdminPermission[] }) {
  if (permissions.length === 0) return <span className="text-xs text-gray-400">No permissions</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {permissions.map((p) => {
        const actions = [p.canCreate && "C", p.canRead && "R", p.canUpdate && "U", p.canDelete && "D"].filter(Boolean);
        const label = MODULE_LABELS[p.module] || p.module;
        return (
          <span key={p.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 text-gray-600" title={`${label}: ${actions.join(", ")}`}>
            {label.slice(0, 4)}
            <span className="ml-1 text-teal-600 font-bold">{actions.join("")}</span>
          </span>
        );
      })}
    </div>
  );
}

// ─── PERMISSION TOGGLE GRID ─────────────────────────────────
type PermMap = Record<AdminModule, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>;

function PermissionGrid({ permissions, onChange }: { permissions: PermMap; onChange: (module: AdminModule, action: string, value: boolean) => void }) {
  const actions = [
    { key: "canCreate", label: "Create" },
    { key: "canRead", label: "Read" },
    { key: "canUpdate", label: "Update" },
    { key: "canDelete", label: "Delete" },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
        <div className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</div>
        {actions.map((a) => (
          <div key={a.key} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">{a.label}</div>
        ))}
      </div>
      {ALL_ADMIN_MODULES.map((mod, idx) => (
        <div key={mod} className={`grid grid-cols-5 ${idx < ALL_ADMIN_MODULES.length - 1 ? "border-b border-gray-100" : ""}`}>
          <div className="px-4 py-3 text-sm font-medium text-gray-700 flex items-center">{MODULE_LABELS[mod]}</div>
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

// ─── EDIT PERMISSIONS MODAL ──────────────────────────────────
function EditModal({ profile, onClose, onSave, saving }: {
  profile: AdminProfile;
  onClose: () => void;
  onSave: (adminId: string, permissions: PermMap) => void;
  saving: boolean;
}) {
  const [permissions, setPermissions] = useState<PermMap>(() => {
    const initial: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
    ALL_ADMIN_MODULES.forEach((mod) => {
      const existing = profile.permissions.find((p) => p.module === mod);
      initial[mod] = existing
        ? { canCreate: existing.canCreate, canRead: existing.canRead, canUpdate: existing.canUpdate, canDelete: existing.canDelete }
        : { canCreate: false, canRead: false, canUpdate: false, canDelete: false };
    });
    return initial as PermMap;
  });

  const handlePermissionChange = (module: AdminModule, action: string, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [module]: { ...prev[module], [action]: value } }));
  };

  const { admin } = useAdminAuth();
  const isSelf = admin?.adminProfile?.id === profile.id;
  const displayName = `${profile.user.firstName} ${profile.user.lastName}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden z-10 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Permissions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update module access for {displayName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
              {(profile.user.firstName?.[0] || "A").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-400">{profile.user.email}</p>
            </div>
            <div className="ml-auto"><RoleBadge role={profile.adminRole} /></div>
          </div>

          {isSelf && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
              <ShieldAlert size={14} /> You cannot modify your own permissions.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Permissions</label>
            <PermissionGrid permissions={permissions} onChange={handlePermissionChange} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            disabled={isSelf || saving}
            onClick={() => onSave(profile.id, permissions)}
            className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CREATE ADMIN MODAL ──────────────────────────────────────
function CreateAdminModal({ onClose, onCreated, saving }: {
  onClose: () => void;
  onCreated: (data: { email: string; firstName: string; lastName: string; password: string; adminRole: AdminRole; permissions: PermMap }) => void;
  saving: boolean;
}) {
  const [step, setStep] = useState<"details" | "permissions">("details");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [adminRole, setAdminRole] = useState<AdminRole>("admin");
  const [formError, setFormError] = useState<string | null>(null);

  const [permissions, setPermissions] = useState<PermMap>(() => {
    const initial: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
    ALL_ADMIN_MODULES.forEach((mod) => {
      initial[mod] = { canCreate: false, canRead: true, canUpdate: false, canDelete: false };
    });
    return initial as PermMap;
  });

  const handlePermissionChange = (module: AdminModule, action: string, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [module]: { ...prev[module], [action]: value } }));
  };

  const handleRoleChange = (newRole: AdminRole) => {
    setAdminRole(newRole);
    if (newRole === "super_admin") {
      const full: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};
      ALL_ADMIN_MODULES.forEach((mod) => {
        full[mod] = { canCreate: true, canRead: true, canUpdate: true, canDelete: true };
      });
      setPermissions(full as PermMap);
    }
  };

  const goToPermissions = () => {
    setFormError(null);
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setStep("permissions");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden z-10 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {step === "details" ? "Create Admin" : "Set Permissions"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === "details"
                ? "Enter details for the new admin account"
                : `Configure module access for ${firstName} ${lastName}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "details" ? (
            <div className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@agaaw.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                <p className="text-[11px] text-gray-400 mt-1">If this email belongs to an existing user, they will be promoted to admin.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 chars, uppercase + lowercase + number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Role</label>
                <div className="flex gap-3">
                  {(["admin", "super_admin"] as AdminRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        adminRole === r
                          ? r === "super_admin" ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-teal-50 border-teal-300 text-teal-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {r === "super_admin" && <Crown size={12} className="inline mr-1" />}
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
                {adminRole === "super_admin" && (
                  <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={12} /> Super Admin gets full access to all modules.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm">
                  {firstName[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{firstName} {lastName}</p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
                <div className="ml-auto"><RoleBadge role={adminRole} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Module Permissions</label>
                <PermissionGrid permissions={permissions} onChange={handlePermissionChange} />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          {step === "permissions" && (
            <button onClick={() => setStep("details")} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Back
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors ml-auto">
            Cancel
          </button>
          {step === "details" ? (
            <button onClick={goToPermissions} className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors">
              Next: Permissions
            </button>
          ) : (
            <button
              disabled={saving}
              onClick={() => onCreated({ email, firstName, lastName, password, adminRole, permissions })}
              className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : "Create Admin"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SKELETON ROW ────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200" /><div><div className="h-3 w-28 bg-gray-200 rounded mb-1.5" /><div className="h-2.5 w-36 bg-gray-100 rounded" /></div></div></td>
      <td className="px-5 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-14 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-32 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-100 rounded" /></td>
    </tr>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function ManageAdminsPage() {
  const { admin: currentAdmin } = useAdminAuth();

  // Data
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // UI
  const [editTarget, setEditTarget] = useState<AdminProfile | null>(null);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, unknown> = { page, limit: 10 };
      if (searchDebounced) params.search = searchDebounced;

      const result = await adminApi.listAdmins(params as Parameters<typeof adminApi.listAdmins>[0]);
      setAdmins(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // Helper
  const displayName = (p: AdminProfile) => `${p.user.firstName} ${p.user.lastName}`.trim() || p.user.email;

  // ── Handlers ───────────────────────────────────────────────
  const handleCreateAdmin = async (data: { email: string; firstName: string; lastName: string; password: string; adminRole: AdminRole; permissions: PermMap }) => {
    setActionLoading("creating");
    try {
      const permArray = Object.entries(data.permissions)
        .filter(([, p]) => p.canRead || p.canCreate || p.canUpdate || p.canDelete)
        .map(([mod, p]) => ({
          module: mod as AdminModule,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        }));

      await adminApi.createAdmin({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        adminRole: data.adminRole,
        permissions: permArray,
      });
      setPromoteOpen(false);
      setToast(`${data.firstName} ${data.lastName} has been made an admin`);
      await fetchAdmins();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSave = async (adminId: string, permissions: PermMap) => {
    setActionLoading(adminId);
    try {
      const permArray = Object.entries(permissions)
        .filter(([, p]) => p.canRead || p.canCreate || p.canUpdate || p.canDelete)
        .map(([mod, p]) => ({
          module: mod as AdminModule,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        }));

      await adminApi.updateAdminPermissions(adminId, { permissions: permArray });
      setEditTarget(null);
      setToast("Permissions updated successfully");
      await fetchAdmins();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to update permissions");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (profile: AdminProfile) => {
    if (currentAdmin?.adminProfile?.id === profile.id) return;
    setActionLoading(profile.id);
    try {
      if (profile.isActive) {
        await adminApi.deactivateAdmin(profile.id);
        setToast(`${displayName(profile)} has been deactivated`);
      } else {
        await adminApi.reactivateAdmin(profile.id);
        setToast(`${displayName(profile)} has been reactivated`);
      }
      await fetchAdmins();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage admin accounts and per-module permissions · {meta.total} total
          </p>
        </div>
        <button
          onClick={() => setPromoteOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Create Admin
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {meta.total} admin{meta.total !== 1 ? "s" : ""}
        </p>
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
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                  <UserCog size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No admins found</p>
                </td>
              </tr>
            ) : (
              admins.map((profile) => {
                const isSelf = currentAdmin?.adminProfile?.id === profile.id;
                return (
                  <tr key={profile.id} className={`hover:bg-gray-50/60 transition-colors group ${!profile.isActive ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {(profile.user.firstName?.[0] || "A").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-1.5">
                            {displayName(profile)}
                            {isSelf && <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">YOU</span>}
                          </p>
                          <p className="text-gray-400 text-xs">{profile.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><RoleBadge role={profile.adminRole} /></td>
                    <td className="px-5 py-4"><StatusBadge isActive={profile.isActive} /></td>
                    <td className="px-5 py-4">
                      {profile.adminRole === "super_admin" ? (
                        <span className="text-xs text-amber-600 font-medium">Full Access</span>
                      ) : (
                        <PermissionsSummary permissions={profile.permissions} />
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(profile.createdAt).toLocaleDateString()}
                      {profile.createdBy && (
                        <p className="text-gray-400 text-[10px] mt-0.5">
                          by {profile.createdBy.firstName} {profile.createdBy.lastName}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actionLoading === profile.id ? (
                          <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta.totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page <= 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
                const pageNum = start + i;
                if (pageNum > meta.totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${pageNum === meta.page ? "bg-teal-700 text-white" : "hover:bg-gray-100 text-gray-500"}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={meta.page >= meta.totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Create Admin Modal ── */}
      {promoteOpen && (
        <CreateAdminModal
          onClose={() => setPromoteOpen(false)}
          onCreated={handleCreateAdmin}
          saving={actionLoading === "creating"}
        />
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <EditModal
          profile={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
          saving={actionLoading === editTarget.id}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
