"use client";

/**
 * Countries Management Page
 *
 * Lists all countries supported by the platform.
 * Allows adding new countries and managing their sections.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Plus, Globe, ExternalLink,
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  MoreVertical, Edit2, Trash2, CheckCircle2, XCircle
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { Country, PaginatedResponse } from "@/lib/adminTypes";

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
      <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-6 bg-gray-200 rounded" /><div className="h-3 w-32 bg-gray-200 rounded" /></div></td>
      <td className="px-5 py-4"><div className="h-3 w-16 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-12 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-100 rounded-full" /></td>
      <td className="px-5 py-4 text-right"><div className="h-8 w-8 bg-gray-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function CountriesPage() {
  // Data state
  const [countries, setCountries] = useState<Country[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // UI state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminApi.listCountries({ page, limit: 10, search: searchDebounced });
      setCountries(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load countries");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced]);

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  /* ─── Handlers ─── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteCountry(deleteId);
      setToast({ message: "Country deleted successfully", type: "success" });
      setDeleteId(null);
      fetchCountries();
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
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage global destination data and guide content
          </p>
        </div>
        <Link
          href="/internal-hq/countries/create"
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm shadow-teal-100"
        >
          <Plus size={16} />
          Add Country
        </Link>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentors</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : countries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                  <Globe size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No countries found</p>
                </td>
              </tr>
            ) : (
              countries.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {country.flagImage ? (
                        <img src={country.flagImage} alt="" className="w-7 h-5 rounded object-cover border border-gray-100" />
                      ) : (
                        <div className="w-7 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">🏳️</div>
                      )}
                      <span className="font-medium text-gray-900">{country.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                    {country.slug}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {country._count?.mentorProfiles || 0}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${country.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {country.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/internal-hq/countries/edit/${country.id}`}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                        title="Edit Country"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(country.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Country"
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Country?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All country guide content will be permanently removed.
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

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}