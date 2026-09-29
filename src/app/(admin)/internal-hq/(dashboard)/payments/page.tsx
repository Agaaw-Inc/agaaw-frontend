"use client";

/**
 * Admin Payments
 *
 * Every step of the manual payment flow that needs a human:
 *   - Verify: match a student's submitted TrxID against the bKash/bank statement
 *   - Disputes: release to the mentor or refund the student
 *   - Refunds: confirm money was sent back by hand
 *   - Payouts: send mentors their withdrawals by hand, then mark them done
 *   - Mentor accounts: check a mentor's payout number/account before first payout
 *   - Settings: the bKash/bank details students are told to pay into
 */

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Eye,
  Landmark,
  Loader2,
  RefreshCw,
  Save,
  ShieldAlert,
  Smartphone,
  Undo2,
  UserCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type {
  AdminDispute,
  AdminKycEntry,
  AdminPayout,
  AdminPaymentSubmission,
  PaymentsSummary,
  PlatformPaymentConfig,
} from "@/lib/adminApi";
import { formatTaka, PAYOUT_METHOD_LABEL, type Order } from "@/lib/orders";

type TabKey = "verify" | "disputes" | "refunds" | "payouts" | "kyc" | "settings";

const TABS: { key: TabKey; label: string; icon: typeof CreditCard; badge?: keyof PaymentsSummary }[] = [
  { key: "verify", label: "Verify payments", icon: CreditCard, badge: "pendingPayments" },
  { key: "disputes", label: "Disputes", icon: ShieldAlert, badge: "openDisputes" },
  { key: "refunds", label: "Refunds", icon: Undo2, badge: "pendingRefunds" },
  { key: "payouts", label: "Payouts", icon: Wallet, badge: "pendingPayouts" },
  { key: "kyc", label: "Mentor accounts", icon: UserCheck, badge: "pendingKyc" },
  { key: "settings", label: "Receiving accounts", icon: Landmark },
];

type Notify = (message: string, type?: "success" | "error") => void;

// ─── Shared bits ─────────────────────────────────────────────

function Toast({ message, type, onHide }: { message: string; type: "success" | "error"; onHide: () => void }) {
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
      {type === "success" ? <CheckCircle2 size={16} className="text-teal-400" /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

function name(p: { firstName: string; lastName: string }) {
  return `${p.firstName} ${p.lastName}`;
}

function when(iso: string | null) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
}

function useQueue<T>(load: () => Promise<{ data: T[] }>, notify: Notify) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows((await load()).data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      setError(msg);
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [load, notify]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { rows, loading, error, refresh };
}

function QueueState({ loading, error, empty, emptyText }: { loading: boolean; error: string | null; empty: boolean; emptyText: string }) {
  if (loading)
    return (
      <div className="flex justify-center py-16 text-gray-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error)
    return (
      <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
        <AlertCircle size={16} /> {error}
      </p>
    );
  if (empty)
    return (
      <p className="text-center py-16 text-sm text-gray-500 bg-white rounded-2xl border border-gray-100">
        <CheckCircle2 className="mx-auto mb-2 text-teal-500" /> {emptyText}
      </p>
    );
  return null;
}

/** Button that opens an inline text box before running a drastic action. */
function NoteAction({
  label,
  placeholder,
  confirmLabel,
  required = true,
  variant,
  onConfirm,
}: {
  label: string;
  placeholder: string;
  confirmLabel: string;
  required?: boolean;
  variant: "primary" | "danger";
  onConfirm: (text: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const btn =
    variant === "primary"
      ? "bg-teal-600 hover:bg-teal-700 text-white"
      : "bg-white border border-red-200 text-red-600 hover:bg-red-50";

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${btn}`}>
        {label}
      </button>
    );
  }
  return (
    <div className="w-full space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:border-teal-500"
      />
      <div className="flex gap-2 justify-end">
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm font-semibold text-gray-600">
          Back
        </button>
        <button
          disabled={(required && text.trim().length < 3) || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm(text.trim());
            } finally {
              setBusy(false);
            }
          }}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 ${
            variant === "primary" ? "bg-teal-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {busy && <Loader2 size={14} className="animate-spin" />} {confirmLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<TabKey>("verify");
  const [summary, setSummary] = useState<PaymentsSummary | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const notify: Notify = useCallback((message, type = "success") => setToast({ message, type }), []);

  // Bumped after every action so the badge counts refetch.
  const [summaryVersion, setSummaryVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    adminApi
      .getPaymentsSummary()
      .then((next) => alive && setSummary(next))
      .catch(() => alive && setSummary(null));
    return () => {
      alive = false;
    };
  }, [summaryVersion]);

  const done: Notify = useCallback(
    (message, type = "success") => {
      notify(message, type);
      setSummaryVersion((v) => v + 1);
    },
    [notify],
  );

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onHide={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Money in and out is handled by hand. Check the bKash/bank statement before approving anything here.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ key, label, icon: Icon, badge }) => {
          const n = badge && summary ? summary[badge] : 0;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                tab === key ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} /> {label}
              {n > 0 && (
                <span className={`text-[11px] font-bold rounded-full px-1.5 ${tab === key ? "bg-white text-teal-700" : "bg-amber-100 text-amber-700"}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "verify" && <VerifyTab notify={done} />}
      {tab === "disputes" && <DisputesTab notify={done} />}
      {tab === "refunds" && <RefundsTab notify={done} />}
      {tab === "payouts" && <PayoutsTab notify={done} />}
      {tab === "kyc" && <KycTab notify={done} />}
      {tab === "settings" && <SettingsTab notify={done} />}
    </div>
  );
}

// ─── Verify payments ─────────────────────────────────────────

function VerifyTab({ notify }: { notify: Notify }) {
  const load = useCallback(() => adminApi.listPaymentSubmissions("pending"), []);
  const { rows, loading, error, refresh } = useQueue<AdminPaymentSubmission>(load, notify);
  const [preview, setPreview] = useState<string | null>(null);

  const review = async (s: AdminPaymentSubmission, approved: boolean, note?: string) => {
    try {
      await adminApi.verifyPaymentSubmission(s.id, approved, note);
      notify(approved ? `${s.order.reference} funded — mentor notified` : `${s.order.reference} rejected — student notified`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed", "error");
    }
    await refresh();
  };

  const showScreenshot = async (id: string) => {
    try {
      setPreview(await adminApi.fetchPrivateFileUrl(`/submissions/${id}/screenshot`));
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't load screenshot", "error");
    }
  };

  return (
    <div className="space-y-3">
      <QueueState loading={loading} error={error} empty={!rows.length} emptyText="No payments waiting for verification." />
      {!loading &&
        rows.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-mono text-lg font-bold text-gray-900">{s.order.reference}</p>
                <p className="text-sm text-gray-600">
                  {s.order.title} · {name(s.order.student)} → {name(s.order.mentor)}
                </p>
                <p className="text-xs text-gray-400">Submitted {when(s.submittedAt)}</p>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{formatTaka(s.order.amount)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-sm bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Method</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                  {s.method === "bkash" ? <Smartphone size={14} /> : <Landmark size={14} />} {s.method === "bkash" ? "bKash" : "Bank"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Sender</p>
                <p className="font-semibold text-gray-900">{s.senderInfo}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Transaction ID</p>
                <p className="font-mono font-bold text-gray-900">{s.transactionId}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Check your statement for <b>{formatTaka(s.order.amount)}</b> from <b>{s.senderInfo}</b> with TrxID <b>{s.transactionId}</b>, ideally with reference <b>{s.order.reference}</b>.
            </p>
            <div className="flex flex-wrap gap-2 items-start">
              <button onClick={() => review(s, true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white">
                Money received — fund order
              </button>
              {s.hasScreenshot && (
                <button onClick={() => showScreenshot(s.id)} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
                  <Eye size={15} /> Screenshot
                </button>
              )}
              <NoteAction
                label="Reject"
                variant="danger"
                placeholder="Reason shown to the student, e.g. 'No payment with this TrxID found — please check and resubmit.'"
                confirmLabel="Reject payment"
                onConfirm={(note) => review(s, false, note)}
              />
            </div>
          </div>
        ))}

      {preview && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-6"
          onClick={() => {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- blob URL, not optimisable */}
          <img src={preview} alt="Payment screenshot" className="max-h-full max-w-full rounded-xl bg-white" />
        </div>
      )}
    </div>
  );
}

// ─── Disputes ────────────────────────────────────────────────

function DisputesTab({ notify }: { notify: Notify }) {
  const load = useCallback(() => adminApi.listDisputes("open"), []);
  const { rows, loading, error, refresh } = useQueue<AdminDispute>(load, notify);

  const resolve = async (
    d: AdminDispute,
    resolution: "release" | "refund" | "revision",
    notes: string,
    revisionDays?: number,
  ) => {
    try {
      await adminApi.resolveDispute(d.id, resolution, notes, revisionDays);
      notify(
        resolution === "release"
          ? "Released to mentor"
          : resolution === "refund"
            ? "Moved to refunds"
            : "Sent back to the mentor for a revision — both sides notified",
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed", "error");
    }
    await refresh();
  };

  const openFile = async (orderId: string, file: { id: string; fileName: string }) => {
    try {
      const url = await adminApi.fetchPrivateFileUrl(`/orders/${orderId}/deliverables/${file.id}/download`);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't open file", "error");
    }
  };

  return (
    <div className="space-y-3">
      <QueueState loading={loading} error={error} empty={!rows.length} emptyText="No open disputes." />
      {!loading &&
        rows.map((d) => {
          const o = d.order;
          const raiser = d.raisedBy
            ? `${name(d.raisedBy)} (${d.raisedBy.id === o.student.id ? "student" : "mentor"})`
            : "Agaaw automatically";
          const earlier = o.disputes.filter((x) => x.id !== d.id);
          const rounds = [...new Set(o.deliverables.map((f) => f.round))].sort((a, b) => a - b);
          const revisionsLeft = o.maxRevisions - o.revisionCount;

          return (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <OrderSummary order={o} />

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm">
                <p className="font-bold text-red-700">
                  {d.round > 1 ? `Dispute on revision ${d.round - 1}` : "Dispute"} · raised by {raiser} · {when(d.createdAt)}
                </p>
                <p className="text-gray-700 mt-1">{d.reason}</p>
              </div>

              {earlier.length > 0 && (
                <details className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-gray-700">
                    Earlier rulings on this order ({earlier.length})
                  </summary>
                  <ol className="mt-2 space-y-2">
                    {earlier.map((x) => (
                      <li key={x.id} className="text-gray-600">
                        <span className="font-semibold text-gray-800">Round {x.round}:</span> {x.reason}
                        <br />
                        <span className="text-xs">
                          → {DISPUTE_OUTCOME[x.status]}
                          {x.adminNotes ? ` — “${x.adminNotes}”` : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              {o.deliveryNote && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <b>Mentor&apos;s latest delivery note:</b> {o.deliveryNote}
                </p>
              )}
              {rounds.map((r) => (
                <div key={r} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-full sm:w-auto">
                    {r === 1 ? "Original delivery" : `Revision ${r - 1}`}:
                  </span>
                  {o.deliverables
                    .filter((f) => f.round === r)
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => openFile(o.id, f)}
                        className="text-xs font-semibold text-teal-700 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50"
                      >
                        {f.fileName}
                      </button>
                    ))}
                </div>
              ))}

              <div className="flex flex-wrap gap-2 items-start">
                <NoteAction
                  label={`Release ${formatTaka(o.mentorPayout)} to mentor`}
                  variant="primary"
                  required={false}
                  placeholder="Notes (shared with both sides)"
                  confirmLabel="Release"
                  onConfirm={(n) => resolve(d, "release", n)}
                />
                <NoteAction
                  label={`Refund ${formatTaka(o.amount)} to student`}
                  variant="danger"
                  required={false}
                  placeholder="Notes (shared with both sides)"
                  confirmLabel="Refund"
                  onConfirm={(n) => resolve(d, "refund", n)}
                />
                <RevisionAction
                  revisionsLeft={revisionsLeft}
                  maxRevisions={o.maxRevisions}
                  onConfirm={(notes, days) => resolve(d, "revision", notes, days)}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

const DISPUTE_OUTCOME: Record<AdminDispute["status"], string> = {
  open: "Open",
  resolved_release: "Released to mentor",
  resolved_refund: "Refunded to student",
  resolved_revision: "Mentor given another chance",
};

/**
 * "Give the mentor another chance": instructions both sides will read, and a
 * deadline. Disabled once the order has used all its revisions.
 */
function RevisionAction({
  revisionsLeft,
  maxRevisions,
  onConfirm,
}: {
  revisionsLeft: number;
  maxRevisions: number;
  onConfirm: (notes: string, days: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [days, setDays] = useState(3);
  const [busy, setBusy] = useState(false);

  if (revisionsLeft <= 0) {
    return (
      <span className="px-4 py-2 text-xs text-gray-500 self-center">
        All {maxRevisions} revisions used — release or refund.
      </span>
    );
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-amber-300 text-amber-800 hover:bg-amber-50"
      >
        Give mentor another chance
      </button>
    );
  }
  return (
    <div className="w-full space-y-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
      <p className="text-xs text-amber-900">
        The order goes back to the mentor; the payment stays held. {revisionsLeft} of {maxRevisions} revision
        {maxRevisions === 1 ? "" : "s"} left for this order.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What exactly must the mentor fix? Both the mentor and the student will see this."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:border-amber-500"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Redeliver within
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
          >
            {[1, 2, 3, 5, 7, 10, 14].map((d) => (
              <option key={d} value={d}>
                {d} day{d === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm font-semibold text-gray-600">
            Back
          </button>
          <button
            disabled={notes.trim().length < 10 || busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm(notes.trim(), days);
              } finally {
                setBusy(false);
              }
            }}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 flex items-center gap-1.5"
          >
            {busy && <Loader2 size={14} className="animate-spin" />} Send back to mentor
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="font-mono font-bold text-gray-900">{order.reference}</p>
        <p className="text-sm text-gray-600">
          {order.title} · {name(order.student)} → {name(order.mentor)}
        </p>
      </div>
      <div className="text-right text-sm">
        <p className="text-xl font-extrabold text-gray-900">{formatTaka(order.amount)}</p>
        {order.mentorPayout && (
          <p className="text-xs text-gray-500">
            Mentor {formatTaka(order.mentorPayout)} · Agaaw {formatTaka(order.platformFee)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Refunds ─────────────────────────────────────────────────

function RefundsTab({ notify }: { notify: Notify }) {
  const load = useCallback(() => adminApi.listAdminOrders("refund_pending"), []);
  const { rows, loading, error, refresh } = useQueue<Order>(load, notify);

  return (
    <div className="space-y-3">
      <QueueState loading={loading} error={error} empty={!rows.length} emptyText="No refunds to send." />
      {!loading &&
        rows.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <OrderSummary order={o} />
            <p className="text-sm text-gray-600">
              {o.declineReason ? <>Mentor declined: {o.declineReason}. </> : o.dispute ? <>Dispute resolved for the student. </> : null}
              Send <b>{formatTaka(o.amount)}</b> back to the student
              {o.latestPayment && (
                <>
                  {" "}
                  — they paid by {o.latestPayment.method === "bkash" ? "bKash" : "bank"} from <b>{o.latestPayment.senderInfo}</b>
                </>
              )}
              , then mark it refunded.
            </p>
            <NoteAction
              label="Mark refunded"
              variant="primary"
              required={false}
              placeholder="Refund transaction id / note (shown to the student)"
              confirmLabel="Mark refunded"
              onConfirm={async (note) => {
                try {
                  await adminApi.markOrderRefunded(o.id, note);
                  notify(`${o.reference} refunded — student notified`);
                } catch (err) {
                  notify(err instanceof Error ? err.message : "Failed", "error");
                }
                await refresh();
              }}
            />
          </div>
        ))}
    </div>
  );
}

// ─── Payouts ─────────────────────────────────────────────────

function PayoutsTab({ notify }: { notify: Notify }) {
  const load = useCallback(() => adminApi.listAdminPayouts("pending"), []);
  const { rows, loading, error, refresh } = useQueue<AdminPayout>(load, notify);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      notify(ok);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed", "error");
    }
    await refresh();
  };

  return (
    <div className="space-y-3">
      <QueueState loading={loading} error={error} empty={!rows.length} emptyText="No withdrawals waiting." />
      {!loading &&
        rows.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">{name(p.mentor)}</p>
                <p className="text-xs text-gray-500">
                  {p.mentor.email} · requested {when(p.requestedAt)}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{formatTaka(p.amount)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Send to ({PAYOUT_METHOD_LABEL[p.method]})</p>
              <p className="font-mono font-bold text-gray-900">{p.payoutDetails.accountNumber}</p>
              <p className="text-gray-700">{p.payoutDetails.accountName}</p>
              {p.payoutDetails.bankName && (
                <p className="text-gray-700">
                  {p.payoutDetails.bankName}
                  {p.payoutDetails.branchName ? `, ${p.payoutDetails.branchName}` : ""}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              <NoteAction
                label="Mark sent"
                variant="primary"
                placeholder="Your bKash/bank transaction ID for this transfer"
                confirmLabel="Mark sent"
                onConfirm={(ref) => act(() => adminApi.completePayout(p.id, ref), "Payout marked sent — mentor notified")}
              />
              <NoteAction
                label="Couldn't send"
                variant="danger"
                placeholder="Why? (shown to the mentor — the money returns to their balance)"
                confirmLabel="Mark failed"
                onConfirm={(reason) => act(() => adminApi.failPayout(p.id, reason), "Payout failed — balance returned")}
              />
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── Mentor payout accounts ──────────────────────────────────

function KycTab({ notify }: { notify: Notify }) {
  const load = useCallback(() => adminApi.listKyc(false), []);
  const { rows, loading, error, refresh } = useQueue<AdminKycEntry>(load, notify);

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Mentors can only withdraw after you confirm their payout account belongs to them (e.g. the account name matches their profile). Any change they make needs checking again.
      </p>
      <QueueState loading={loading} error={error} empty={!rows.length} emptyText="No payout accounts waiting for verification." />
      {!loading &&
        rows.map((k) => (
          <div key={k.mentorId} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <p className="font-bold text-gray-900">
                {name(k.mentor)} <span className="font-normal text-gray-500">· {k.mentor.email}</span>
              </p>
              <p className="text-gray-700">
                {PAYOUT_METHOD_LABEL[k.payoutMethod]} · <span className="font-mono font-bold">{k.payoutDetails.accountNumber}</span> · {k.payoutDetails.accountName}
                {k.payoutDetails.bankName ? ` · ${k.payoutDetails.bankName}` : ""}
                {k.payoutDetails.branchName ? `, ${k.payoutDetails.branchName}` : ""}
              </p>
              <p className="text-xs text-gray-400">Balance {formatTaka(k.availableBalance)} · updated {when(k.detailsUpdatedAt)}</p>
            </div>
            <button
              onClick={async () => {
                try {
                  await adminApi.verifyKyc(k.mentorId, k.detailsUpdatedAt);
                  notify(`${name(k.mentor)}'s payout account verified`);
                } catch (err) {
                  notify(err instanceof Error ? err.message : "Failed", "error");
                }
                await refresh();
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white"
            >
              Verify
            </button>
          </div>
        ))}
    </div>
  );
}

// ─── Receiving accounts ──────────────────────────────────────

function SettingsTab({ notify }: { notify: Notify }) {
  const [form, setForm] = useState<Omit<PlatformPaymentConfig, "updatedAt"> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const c = await adminApi.getPaymentConfig();
      setForm({
        bkashNumber: c.bkashNumber ?? "",
        bkashType: c.bkashType,
        bankName: c.bankName ?? "",
        bankAccountNo: c.bankAccountNo ?? "",
        bankAccountName: c.bankAccountName ?? "",
        bankBranch: c.bankBranch ?? "",
        instructions: c.instructions ?? "",
      });
      setUpdatedAt(c.updatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <QueueState loading={false} error={error} empty={false} emptyText="" />;
  if (!form) return <QueueState loading error={null} empty={false} emptyText="" />;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });
  const input = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500";
  const nothingSet = !form.bkashNumber && !(form.bankName && form.bankAccountNo);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const blankToUndefined = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : v]));
      const saved = await adminApi.updatePaymentConfig(blankToUndefined as typeof form);
      setUpdatedAt(saved.updatedAt);
      notify("Receiving accounts updated — students see the new details immediately");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 max-w-2xl">
      {nothingSet && (
        <p className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertCircle size={16} /> Students can&apos;t pay until at least one account is set.
        </p>
      )}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Smartphone size={16} className="text-pink-600" /> bKash
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.bkashNumber ?? ""} onChange={set("bkashNumber")} placeholder="01XXXXXXXXX" className={input} />
          <select value={form.bkashType} onChange={set("bkashType")} className={input}>
            <option value="personal">Personal (students use Send Money)</option>
            <option value="merchant">Merchant (students use Payment)</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Landmark size={16} className="text-blue-600" /> Bank account
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.bankName ?? ""} onChange={set("bankName")} placeholder="Bank name" className={input} />
          <input value={form.bankBranch ?? ""} onChange={set("bankBranch")} placeholder="Branch" className={input} />
          <input value={form.bankAccountName ?? ""} onChange={set("bankAccountName")} placeholder="Account name" className={input} />
          <input value={form.bankAccountNo ?? ""} onChange={set("bankAccountNo")} placeholder="Account number" className={input} />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900">Extra instructions (optional)</h3>
        <textarea value={form.instructions ?? ""} onChange={set("instructions")} className={`${input} h-24 resize-none`} placeholder="Shown to students under the payment details" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
        </button>
        <button type="button" onClick={() => void load()} className="p-2 text-gray-400 hover:text-gray-600" aria-label="Reload">
          <RefreshCw size={16} />
        </button>
        {updatedAt && <span className="text-xs text-gray-400">Last updated {when(updatedAt)}</span>}
      </div>
    </form>
  );
}
