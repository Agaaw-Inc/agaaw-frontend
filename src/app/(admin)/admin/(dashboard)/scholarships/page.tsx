"use client";

/**
 * Scholarships Management Page
 *
 * Lists all scholarships with filtering by country, level, and coverage.
 * Allows adding new scholarships and managing their FAQ sections.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Plus, GraduationCap, Calendar,
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Edit2, Trash2, CheckCircle2, XCircle, Filter, MapPin, Layers, Check, X
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { Scholarship, Country, PaginatedResponse, ScholarshipLevel, Coverage, ScholarshipCategory } from "@/lib/adminTypes";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, type, onHide }: { message: string; type: "success" | "error"; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); }, [onHide]);
  return (
    <div className={`fixed bottom-6 right-6 z-[999] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 ${type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={16} className="text-teal-400" /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

/* ─── Skeleton Row ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-3 w-48 bg-gray-200 rounded mb-1.5" /><div className="h-2.5 w-32 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-24 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-gray-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

/* ─── Manage Categories Modal ──────────────────────────────────── */
function ManageCategoriesModal({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<ScholarshipCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.listScholarshipCategories();
      setCategories(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Auto-generate slug from name if user hasn't typed in slug manually (or we just force it for simplicity)
  const handleNameChange = (val: string, setter: (v: string) => void, slugSetter: (v: string) => void) => {
    setter(val);
    slugSetter(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;
    try {
      setIsSubmitting(true);
      await adminApi.createScholarshipCategory({ name: newName, slug: newSlug });
      setNewName("");
      setNewSlug("");
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim() || !editSlug.trim()) return;
    try {
      await adminApi.updateScholarshipCategory(id, { name: editName, slug: editSlug });
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApi.deleteScholarshipCategory(id);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden z-10">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Categories</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add or modify scholarship categories</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Add Form */}
          <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Add New Category</h3>
            <div className="space-y-3">
              <input
                value={newName}
                onChange={(e) => handleNameChange(e.target.value, setNewName, setNewSlug)}
                placeholder="Category Name (e.g. Engineering)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="slug-name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100 text-gray-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newName.trim()}
                className="w-full py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
            </div>
          </form>

          {/* List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Existing Categories</h3>
            {isLoading ? (
              <div className="flex justify-center py-6"><Loader2 size={24} className="animate-spin text-teal-600" /></div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No categories found.</p>
            ) : (
              <div className="space-y-2">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-teal-200 transition-colors group">
                    {editingId === c.id ? (
                      <div className="flex-1 space-y-2 mr-3">
                        <input
                          value={editName}
                          onChange={(e) => handleNameChange(e.target.value, setEditName, setEditSlug)}
                          className="w-full px-2 py-1 text-sm border border-teal-500 rounded focus:outline-none"
                          autoFocus
                        />
                        <input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none bg-gray-50"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-sm text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 shrink-0">
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => handleEditSave(c.id)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(c.id); setEditName(c.name); setEditSlug(c.slug); }} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  // Data state
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [countryId, setCountryId] = useState("");
  const [level, setLevel] = useState<ScholarshipLevel | "">("");
  const [coverage, setCoverage] = useState<Coverage | "">("");
  const [page, setPage] = useState(1);

  // UI state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch initial dependencies
  useEffect(() => {
    async function loadDependencies() {
      try {
        const res = await adminApi.listCountries({ limit: 100 });
        setCountries(res.data);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    }
    loadDependencies();
  }, []);

  // Fetch scholarships
  const fetchScholarships = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminApi.listScholarships({
        page,
        limit: 10,
        search: searchDebounced,
        countryId: countryId || undefined,
        level: level || undefined,
        coverage: coverage || undefined,
      });
      setScholarships(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load scholarships");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced, countryId, level, coverage]);

  useEffect(() => { fetchScholarships(); }, [fetchScholarships]);

  /* ─── Handlers ─── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteScholarship(deleteId);
      setToast({ message: "Scholarship deleted successfully", type: "success" });
      setDeleteId(null);
      fetchScholarships();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to delete", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage funding opportunities and eligibility criteria
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCategoriesModalOpen(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <Layers size={16} className="text-teal-600" />
            Manage Categories
          </button>
          <Link
            href="/admin/scholarships/create"
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm shadow-teal-100"
          >
            <Plus size={16} />
            Add Scholarship
          </Link>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or provider..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
            />
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gray-400" />
            <select
              value={countryId}
              onChange={(e) => { setCountryId(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Countries</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <GraduationCap size={15} className="text-gray-400" />
            <select
              value={level}
              onChange={(e) => { setLevel(e.target.value as any); setPage(1); }}
              className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Levels</option>
              <option value="bachelors">Bachelors</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Coverage Filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={coverage}
              onChange={(e) => { setCoverage(e.target.value as any); setPage(1); }}
              className="border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Coverage</option>
              <option value="full">Full</option>
              <option value="partial">Partial</option>
              <option value="varies">Varies</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scholarship</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : scholarships.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                  <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No scholarships found</p>
                </td>
              </tr>
            ) : (
              scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-gray-400 text-xs">{s.provider}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {s.country?.flagImage ? (
                        <img src={s.country.flagImage} alt="" className="w-5 h-3.5 rounded-sm object-cover border border-gray-100" />
                      ) : (
                        <MapPin size={12} className="text-gray-300" />
                      )}
                      <span className="text-gray-600">{s.country?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wider border border-teal-100">
                      {s.level}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar size={13} className="text-gray-400" />
                      {s.deadline ? new Date(s.deadline).toLocaleDateString() : "Ongoing"}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/scholarships/edit/${s.id}`}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        title="Edit Scholarship"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Scholarship"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {meta.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page <= 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={meta.page >= meta.totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Scholarship?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action will remove the scholarship from the platform. Existing applications will not be deleted but the listing will be gone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Categories Modal ── */}
      {categoriesModalOpen && (
        <ManageCategoriesModal onClose={() => setCategoriesModalOpen(false)} />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}