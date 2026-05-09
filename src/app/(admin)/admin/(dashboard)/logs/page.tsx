"use client";

/**
 * Activity Logs Page
 *
 * Displays a searchable, filterable list of all administrative actions.
 * Restricted to super_admin.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Search, ScrollText, UserCog, Clock,
  ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Hash, Tag, Info
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { ActivityLog, PaginatedResponse } from "@/lib/adminTypes";
import { MODULE_LABELS } from "@/lib/adminTypes";

/* ─── Skeleton Row ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-3 w-32 bg-gray-200 rounded mb-1.5" /><div className="h-2.5 w-24 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-48 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4 text-right"><div className="h-3 w-24 bg-gray-100 rounded ml-auto" /></td>
    </tr>
  );
}

/** Format an action string into a human-readable label */
function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActivityLogsPage() {
  // Data state
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params: any = { page, limit: 15 };
      if (searchDebounced) params.search = searchDebounced;

      const result = await adminApi.getActivityLogs(params);
      setLogs(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activity logs");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit trail of all administrative actions · {meta.total} total
          </p>
        </div>
        <ScrollText className="text-gray-200 w-12 h-12" />
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
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Info size={16} className="text-teal-500" />
          Only Super Admins can view this audit trail
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs (admin, action, ID)..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-72"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                  <ScrollText size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No activity logs found</p>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const adminName = log.admin?.user 
                  ? `${log.admin.user.firstName} ${log.admin.user.lastName}` 
                  : "Unknown Admin";
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <UserCog size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{adminName}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">{log.admin?.adminRole || "SYSTEM"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-bold uppercase tracking-tight border border-teal-100">
                        <Tag size={10} />
                        {MODULE_LABELS[log.module] || log.module}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">
                      {formatAction(log.action)}
                    </td>
                    <td className="px-5 py-4">
                      {log.targetId ? (
                        <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                          <Hash size={12} className="text-gray-300" />
                          <span>{log.targetId.slice(0, 12)}...</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="text-gray-900 font-medium">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                        <Clock size={10} />
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        {meta.totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages} · {meta.total} records</p>
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
    </div>
  );
}
