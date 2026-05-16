"use client";

/**
 * Mentor Management Page
 *
 * Lists mentors with filtering for approval status.
 * Admins can approve or reject mentor applications.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Search, ShieldCheck, ShieldX, UserCircle2,
  CheckCircle2, XCircle, Loader2, AlertCircle,
  ChevronLeft, ChevronRight, Clock, MapPin, GraduationCap, Download
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { MentorListItem, PaginatedResponse } from "@/lib/adminTypes";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

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

/* ─── Status Badge ───────────────────────────────────────────── */
function StatusBadge({ isApproved }: { isApproved: boolean | null }) {
  if (isApproved === true) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        Approved
      </span>
    );
  }
  if (isApproved === false) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      Pending
    </span>
  );
}

/* ─── Skeleton Row ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-200" /><div><div className="h-3 w-28 bg-gray-200 rounded mb-1.5" /><div className="h-2.5 w-36 bg-gray-100 rounded" /></div></div></td>
      <td className="px-5 py-4"><div className="h-3 w-32 bg-gray-100 rounded mb-1" /><div className="h-2.5 w-24 bg-gray-50 rounded" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4 text-right"><div className="h-8 w-24 bg-gray-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function MentorsPage() {
  // Data state
  const [mentors, setMentors] = useState<MentorListItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // UI state
  const [rejectTarget, setRejectTarget] = useState<MentorListItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Export handler
  const handleExport = async () => {
    try {
      const params: any = {};
      if (searchDebounced) params.search = searchDebounced;
      if (statusFilter === "pending") params.isApproved = false;
      if (statusFilter === "approved") params.isApproved = true;
      
      await adminApi.exportMentorsCsv(params);
      setToast({ message: "Mentors exported successfully", type: "success" });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Export failed", type: "error" });
    }
  };

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [statusFilter]);

  // Fetch mentors
  const fetchMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: any = { page, limit: 10 };
      if (searchDebounced) params.search = searchDebounced;
      if (statusFilter === "pending") params.isApproved = false;
      if (statusFilter === "approved") params.isApproved = true;
      // Note: Backend might not support a specific "rejected" filter directly via boolean if it's null/true/false.
      // But we can filter by pending/approved.

      const result = await adminApi.listMentors(params);
      setMentors(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mentors");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced, statusFilter]);

  useEffect(() => { fetchMentors(); }, [fetchMentors]);

  /* ─── Handlers ─── */
  const handleApprove = async (mentor: MentorListItem) => {
    setActionLoading(mentor.id);
    try {
      await adminApi.approveMentor(mentor.id);
      setToast({ message: `${mentor.user.firstName} has been approved as a mentor.`, type: "success" });
      await fetchMentors();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Approval failed", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setActionLoading(rejectTarget.id);
    try {
      await adminApi.rejectMentor(rejectTarget.id, rejectReason);
      setToast({ message: `${rejectTarget.user.firstName} application has been rejected.`, type: "success" });
      setRejectTarget(null);
      setRejectReason("");
      await fetchMentors();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Rejection failed", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const TABS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentor Approvals</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Review and manage mentor applications · {meta.total} total
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
            </button>
          ))}
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, uni, or email…"
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
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentor</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : mentors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                  <UserCircle2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No mentors found</p>
                </td>
              </tr>
            ) : (
              mentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {mentor.user.profileImage ? (
                          <img src={mentor.user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          mentor.user.firstName[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{mentor.user.firstName} {mentor.user.lastName}</p>
                        <p className="text-gray-400 text-xs">{mentor.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <GraduationCap size={14} className="text-gray-400" />
                        <span>{mentor.currentUniversity || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <MapPin size={12} className="text-gray-300" />
                        <span>{mentor.country?.name || "N/A"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isApproved={mentor.isApproved} />
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(mentor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!mentor.isApproved ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionLoading === mentor.id}
                          onClick={() => handleApprove(mentor)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          {actionLoading === mentor.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                          Approve
                        </button>
                        <button
                          disabled={actionLoading === mentor.id}
                          onClick={() => setRejectTarget(mentor)}
                          className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-1"
                        >
                          <ShieldX size={14} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {meta.totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page <= 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
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
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={meta.page >= meta.totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Reject Modal ── */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
            <p className="text-sm text-gray-500 mb-4">
              Provide a reason for rejecting <strong>{rejectTarget.user.firstName}</strong>. They will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete profile, insufficient experience..."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectTarget(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button
                disabled={!rejectReason.trim() || actionLoading === rejectTarget.id}
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectTarget.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Reject"}
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
