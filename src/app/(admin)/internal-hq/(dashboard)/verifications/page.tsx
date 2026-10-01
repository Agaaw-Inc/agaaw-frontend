"use client";

/**
 * Mentor Verification Queue
 *
 * Mentors submit an ID card, optional supporting documents, a professional
 * email, LinkedIn and a phone number. Admins with the `mentor_approvals`
 * permission review and approve or reject them here. This is the only page
 * that ever shows a mentor's phone number or ID documents.
 */

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, FileText,
  Loader2, Mail, Phone, ShieldCheck, ShieldX, UserCircle2, XCircle,
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import { resolveFileUrl } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import type { AdminVerification, VerificationStatus } from "@/lib/adminApi";
import type { PaginatedResponse } from "@/lib/adminTypes";

const TABS: { key: VerificationStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const CREDENTIAL_LABEL: Record<AdminVerification["credentialType"], string> = {
  university: "University",
  company: "Company",
  organization: "Organization",
};

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, type, onHide }: { message: string; type: "success" | "error"; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 3500); return () => clearTimeout(t); }, [onHide]);
  return (
    <div className={`fixed bottom-6 right-6 z-[999] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 ${type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={16} className="text-teal-400" /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

export default function VerificationsPage() {
  const [status, setStatus] = useState<VerificationStatus>("pending");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<AdminVerification> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminVerification | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  // Shown in-page: window.open after an await is blocked as a popup.
  const [preview, setPreview] = useState<{ url: string; contentType: string; fileName: string } | null>(null);
  const notify = useCallback((message: string, type: "success" | "error" = "success") => setToast({ message, type }), []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResult(await adminApi.listVerifications(status, page));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load verifications");
    } finally {
      setIsLoading(false);
    }
  }, [status, page]);

  useEffect(() => { void load(); }, [load]);

  const switchTab = (key: VerificationStatus) => {
    setStatus(key);
    setPage(1);
  };

  const openDocument = async (v: AdminVerification, doc: AdminVerification["documents"][number]) => {
    try {
      const url = await adminApi.fetchVerificationDocumentUrl(v.id, doc.id);
      setPreview({ url, contentType: doc.contentType, fileName: doc.fileName });
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't open the document", "error");
    }
  };

  const approve = async (v: AdminVerification) => {
    setActionLoading(v.id);
    try {
      await adminApi.approveVerification(v.id, v.submittedAt);
      notify(`${v.mentor.firstName} is now verified.`);
      await load();
    } catch (err) {
      // e.g. 409 "The mentor updated this submission while you were reviewing it…"
      notify(err instanceof Error ? err.message : "Approval failed", "error");
      await load();
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async () => {
    if (!rejectTarget || rejectReason.trim().length < 5) return;
    setActionLoading(rejectTarget.id);
    try {
      await adminApi.rejectVerification(rejectTarget.id, rejectTarget.submittedAt, rejectReason.trim());
      notify(`${rejectTarget.mentor.firstName}'s submission was rejected. They've been notified.`);
      setRejectTarget(null);
      setRejectReason("");
      await load();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Rejection failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const meta = result?.meta;
  const rows = result?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentor Verification</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Check ID documents, email and LinkedIn before approving · {meta?.total ?? 0} {status}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${status === tab.key ? "bg-white text-teal-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-teal-600" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
          <UserCircle2 size={40} className="mx-auto mb-3 opacity-30" />
          <p>No {status} submissions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
                    <Avatar src={resolveFileUrl(v.mentor.profileImage)} name={v.mentor.firstName || "?"} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{v.mentor.firstName} {v.mentor.lastName}</p>
                    <p className="text-xs text-gray-400">
                      {v.mentor.email}
                      {v.mentor.mentorProfile?.currentUniversity ? ` · ${v.mentor.mentorProfile.currentUniversity}` : ""}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Submitted {new Date(v.submittedAt).toLocaleString()}
                  {v.reviewedAt && <> · Reviewed {new Date(v.reviewedAt).toLocaleString()}</>}
                </p>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <Field label="Credential">{CREDENTIAL_LABEL[v.credentialType]}</Field>
                <Field label="Professional email">
                  <span className="flex items-center gap-1.5 min-w-0"><Mail size={13} className="text-gray-400 shrink-0" /><span className="truncate">{v.professionalEmail}</span></span>
                </Field>
                <Field label="Phone (admin only)">
                  <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{v.phoneNumber}</span>
                </Field>
                <Field label="LinkedIn">
                  <a href={v.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-teal-700 hover:underline min-w-0">
                    <span className="truncate">{v.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </Field>
              </dl>

              <div className="flex flex-wrap gap-2">
                {v.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => void openDocument(v, doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-teal-50 hover:border-teal-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    <FileText size={13} className={doc.kind === "id_card" ? "text-teal-600" : "text-gray-400"} />
                    {doc.kind === "id_card" ? "ID card" : doc.fileName}
                  </button>
                ))}
              </div>

              {v.status === "rejected" && v.rejectionReason && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <span className="font-semibold">Rejected:</span> {v.rejectionReason}
                </p>
              )}

              {v.status === "pending" && (
                <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-4">
                  <button
                    disabled={actionLoading === v.id}
                    onClick={() => setRejectTarget(v)}
                    className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <ShieldX size={14} /> Reject
                  </button>
                  <button
                    disabled={actionLoading === v.id}
                    onClick={() => void approve(v)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {actionLoading === v.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Page {meta.page} of {meta.totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.page <= 1} aria-label="Previous page" className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={meta.page >= meta.totalPages} aria-label="Next page" className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject submission</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tell <strong>{rejectTarget.mentor.firstName}</strong> what to fix. They&apos;ll see this and can resubmit.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={500}
              placeholder="e.g. The ID card photo is too blurry to read."
              className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-1 resize-none"
            />
            <p className="text-[11px] text-gray-400 mb-4">At least 5 characters.</p>
            <div className="flex gap-3">
              <button onClick={() => setRejectTarget(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button
                disabled={rejectReason.trim().length < 5 || actionLoading === rejectTarget.id}
                onClick={() => void reject()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectTarget.id ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Document preview ── */}
      {preview && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex flex-col items-center justify-center gap-3 p-6" role="dialog" aria-modal="true" aria-label={preview.fileName}>
          <div className="flex items-center gap-2">
            <a
              href={preview.url}
              download={preview.fileName}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100"
            >
              Download
            </a>
            <button
              onClick={() => {
                URL.revokeObjectURL(preview.url);
                setPreview(null);
              }}
              className="px-3 py-1.5 bg-white/15 text-white rounded-lg text-xs font-medium hover:bg-white/25"
            >
              Close
            </button>
          </div>
          {preview.contentType === "application/pdf" ? (
            <iframe src={preview.url} title={preview.fileName} className="w-full max-w-4xl flex-1 rounded-xl bg-white" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- blob URL, not optimisable
            <img src={preview.url} alt={preview.fileName} className="max-h-[85vh] max-w-full rounded-xl bg-white" />
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-gray-800">{children}</dd>
    </div>
  );
}
