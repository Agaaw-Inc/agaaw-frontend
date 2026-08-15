"use client";

/**
 * Admin Announcements Page (Step B6)
 *
 * Composer (title 120, message 500, audience radio, optional link) with a
 * confirm dialog showing the audience size, plus a history table below.
 */

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Link2,
  Loader2,
  Megaphone,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { AdminAnnouncement } from "@/lib/adminApi";

const PAGE_SIZE = 10;

type Audience = "all" | "students" | "mentors";

const AUDIENCE_LABELS: Record<Audience, string> = {
  all: "All users",
  students: "Students only",
  mentors: "Mentors only",
};

function Toast({
  message,
  type,
  onHide,
}: {
  message: string;
  type: "success" | "error";
  onHide: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onHide, 4000);
    return () => clearTimeout(t);
  }, [onHide]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 ${
        type === "success" ? "bg-gray-900" : "bg-red-600"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} className="text-teal-400" />
      ) : (
        <XCircle size={16} />
      )}
      {message}
    </div>
  );
}

export default function AnnouncementsPage() {
  // Composer state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [link, setLink] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // History state
  const [history, setHistory] = useState<AdminAnnouncement[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const result = await adminApi.listAnnouncements({ page, limit: PAGE_SIZE });
      setHistory(result.data);
      setTotal(result.meta.total);
    } catch {
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [page]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const linkValid = !link || link.startsWith("/") || /^https:\/\//i.test(link);
  const canSend =
    title.trim().length > 0 &&
    title.length <= 120 &&
    message.trim().length > 0 &&
    message.length <= 500 &&
    linkValid;

  const openConfirm = async () => {
    if (!canSend) return;
    setConfirmOpen(true);
    setAudienceCount(null);
    try {
      setAudienceCount(await adminApi.getAudienceSize(audience));
    } catch {
      setAudienceCount(-1);
    }
  };

  const send = async () => {
    setIsSending(true);
    try {
      const result = await adminApi.createAnnouncement({
        title: title.trim(),
        message: message.trim(),
        audience,
        link: link.trim() || undefined,
      });
      setToast({
        message: `Announcement sent to ${result.sentCount} user(s)`,
        type: "success",
      });
      setTitle("");
      setMessage("");
      setLink("");
      setAudience("all");
      setConfirmOpen(false);
      setPage(1);
      void loadHistory();
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to send announcement",
        type: "error",
      });
      setConfirmOpen(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
          <Megaphone size={18} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500">
            Send platform news to students and mentors — delivered to their notification bell
          </p>
        </div>
      </div>

      {/* Composer */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
            <span>Title</span>
            <span className={title.length > 120 ? "text-red-500" : "text-gray-400"}>
              {title.length}/120
            </span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder="e.g. New feature: session recordings"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
            <span>Message</span>
            <span className={message.length > 500 ? "text-red-500" : "text-gray-400"}>
              {message.length}/500
            </span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="What do you want to tell your users?"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Audience
            </label>
            <div className="flex gap-2">
              {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    audience === a
                      ? "bg-teal-600 text-white border-teal-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {AUDIENCE_LABELS[a]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Link (optional)
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/scholarships/... or https://..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${
                  linkValid ? "border-gray-200 focus:border-teal-500" : "border-red-300"
                }`}
              />
            </div>
            {!linkValid && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle size={12} /> Must start with &quot;/&quot; or &quot;https://&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => void openConfirm()}
            disabled={!canSend}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={15} /> Send announcement
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900">History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-gray-400 border-b border-gray-50">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Audience</th>
                <th className="px-6 py-3">Sent</th>
                <th className="px-6 py-3">Sender</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoadingHistory ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-600 inline" />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No announcements sent yet
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 capitalize">
                        {item.audience}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{item.sentCount}</td>
                    <td className="px-6 py-4 text-gray-600">{item.sentBy}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Send this announcement?</h3>
                <p className="text-xs text-gray-500">
                  {audienceCount === null
                    ? "Counting recipients…"
                    : audienceCount === -1
                      ? `Audience: ${AUDIENCE_LABELS[audience]}`
                      : `It will reach about ${audienceCount} ${AUDIENCE_LABELS[audience].toLowerCase()}.`}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{message}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={isSending}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void send()}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {isSending ? "Sending…" : "Confirm & send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}
