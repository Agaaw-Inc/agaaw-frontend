"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Loader2,
    RotateCcw,
    ShieldAlert,
    Trash2,
    Upload,
    Wallet,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useOrderConfig } from "@/hooks/useOrderConfig";
import { resolveFileUrl } from "@/lib/api";
import {
    acceptOrder,
    cancelOrder,
    confirmReceived,
    declineOrder,
    declineQuote,
    deliverOrder,
    disputeOrder,
    downloadDeliverable,
    formatTaka,
    previewSplit,
    quoteOrder,
    removeDeliverable,
    uploadDeliverable,
    type Order,
    type OrderDeliverable,
    type OrderDispute,
} from "@/lib/orders";
import OrderStatusBadge from "./OrderStatusBadge";
import FeeBreakdown from "./FeeBreakdown";
import PaymentPanel from "./PaymentPanel";

type Role = "student" | "mentor";

interface Props {
    order: Order;
    role: Role;
    onChange: (order: Order) => void;
}

function timeLeft(iso: string | null): string {
    if (!iso) return "";
    const ms = new Date(iso).getTime() - Date.now();
    if (ms <= 0) return "any moment now";
    const hours = Math.floor(ms / 3_600_000);
    const days = Math.floor(hours / 24);
    if (days >= 1) return `in ${days} day${days === 1 ? "" : "s"}${hours % 24 ? ` ${hours % 24}h` : ""}`;
    return `in ${Math.max(1, hours)} hour${hours === 1 ? "" : "s"}`;
}

function formatSize(bytes: number) {
    return bytes >= 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** A button that expands into "give a reason" before doing something drastic. */
function ReasonAction({
    label,
    placeholder,
    confirmLabel,
    tone = "danger",
    onConfirm,
}: {
    label: string;
    placeholder: string;
    confirmLabel: string;
    tone?: "danger" | "muted";
    onConfirm: (reason: string) => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [busy, setBusy] = useState(false);

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className={tone === "danger" ? "px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50" : "text-sm font-semibold text-gray-500 hover:text-red-600 underline"}
            >
                {label}
            </button>
        );
    }
    return (
        <div className="w-full space-y-2 rounded-xl border border-red-100 bg-red-50/50 p-3">
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={placeholder}
                maxLength={1000}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:border-red-400"
            />
            <div className="flex gap-2 justify-end">
                <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm font-semibold text-gray-600">
                    Back
                </button>
                <button
                    disabled={reason.trim().length < 3 || busy}
                    onClick={async () => {
                        setBusy(true);
                        try {
                            await onConfirm(reason.trim());
                            setOpen(false);
                        } finally {
                            setBusy(false);
                        }
                    }}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                    {busy && <Loader2 size={14} className="animate-spin" />} {confirmLabel}
                </button>
            </div>
        </div>
    );
}

export default function OrderDetailView({ order, role, onChange }: Props) {
    const config = useOrderConfig();
    const { toast, showToast, hideToast } = useToast();
    const [busy, setBusy] = useState<string | null>(null);
    const counterpart = role === "student" ? order.mentor : order.student;
    const counterpartName = `${counterpart.firstName} ${counterpart.lastName}`;
    const base = `/dashboard/${role}/orders`;

    /** Runs an action, swaps in the updated order, and reports errors as a toast. */
    const run = async (key: string, fn: () => Promise<Order>, success?: string) => {
        setBusy(key);
        try {
            onChange(await fn());
            if (success) showToast(success);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Something went wrong", "error");
        } finally {
            setBusy(null);
        }
    };

    const download = async (fileId: string) => {
        const file = order.deliverables.find((d) => d.id === fileId);
        if (!file) return;
        try {
            await downloadDeliverable(order.id, file);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Download failed", "error");
        }
    };

    // The server already hides a student's not-yet-delivered files. While the
    // mentor works on a round, that round's files live in the upload panel
    // instead, so this section shows only what has been delivered.
    const currentRound = order.revisionCount + 1;
    const deliveredFiles =
        role === "mentor" && order.status === "in_progress"
            ? order.deliverables.filter((f) => f.round < currentRound)
            : order.deliverables;
    const rounds = [...new Set(deliveredFiles.map((f) => f.round))].sort((a, b) => b - a); // newest first

    return (
        <div className="space-y-6">
            <Toast toast={toast} onHide={hideToast} />

            <Link href={base} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-teal-700">
                <ArrowLeft size={16} /> All orders
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <OrderStatusBadge status={order.status} />
                            <span className="font-mono text-xs text-gray-400">{order.reference}</span>
                            {order.isCustom && <span className="text-[11px] font-bold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Custom request</span>}
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900">{order.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-teal-50 text-[10px] flex items-center justify-center font-bold text-teal-700">
                                <Avatar src={resolveFileUrl(counterpart.profileImage)} name={counterpartName} />
                            </div>
                            {role === "student" ? "Mentor" : "Student"}: <span className="font-semibold text-gray-700">{counterpartName}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{role === "mentor" ? "Student pays" : "Price"}</p>
                        <p className="text-2xl font-extrabold text-gray-900">{order.amount ? formatTaka(order.amount) : "Not priced yet"}</p>
                    </div>
                </div>

                {order.description && <p className="text-sm text-gray-600 whitespace-pre-line border-t border-gray-100 pt-4">{order.description}</p>}
                {order.quoteNote && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <b className="text-gray-800">Mentor&apos;s note on the price:</b> {order.quoteNote}
                    </p>
                )}
                {role === "mentor" && order.amount && order.platformFee && order.mentorPayout && order.commissionRate !== null && (
                    <FeeBreakdown amount={order.amount} platformFee={order.platformFee} mentorPayout={order.mentorPayout} commissionRate={order.commissionRate} />
                )}
            </div>

            {/* What to do now */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                {role === "student" ? (
                    <StudentActions order={order} busy={busy} run={run} config={config} />
                ) : (
                    <MentorActions order={order} busy={busy} run={run} commissionRate={config.commissionRate} showToast={showToast} onChange={onChange} />
                )}
            </div>

            {/* Files — grouped by delivery round, newest first */}
            {deliveredFiles.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h2 className="font-bold text-gray-900">Delivered files</h2>
                    {order.deliveryNote && order.status !== "in_progress" && (
                        <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">{order.deliveryNote}</p>
                    )}
                    {rounds.map((round) => (
                        <div key={round} className="space-y-2">
                            {rounds.length > 1 && (
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    {roundLabel(round)}
                                    {round === rounds[0] && order.status !== "in_progress" ? " · latest" : ""}
                                </p>
                            )}
                            {deliveredFiles
                                .filter((f) => f.round === round)
                                .map((f) => (
                                    <FileRow key={f.id} file={f} onDownload={() => download(f.id)} />
                                ))}
                        </div>
                    ))}
                </div>
            )}

            {order.disputes.length > 0 && <DisputeHistory disputes={order.disputes} studentId={order.student.id} />}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// Student
// ─────────────────────────────────────────────────────────────────────────

type RunFn = (key: string, fn: () => Promise<Order>, success?: string) => Promise<void>;

function StudentActions({ order, busy, run, config }: { order: Order; busy: string | null; run: RunFn; config: { disputeWindowHours: number } }) {
    const cancel = (
        <button
            onClick={() => run("cancel", () => cancelOrder(order.id), "Order cancelled")}
            disabled={busy !== null}
            className="text-sm font-semibold text-gray-500 hover:text-red-600 underline disabled:opacity-50"
        >
            Cancel order
        </button>
    );

    switch (order.status) {
        case "awaiting_quote":
            return (
                <Info icon={Clock} title="Waiting for your mentor's price">
                    <p>{order.mentor.firstName} will review your request and send a price. You&apos;ll get a notification — you only pay if you accept it.</p>
                    {cancel}
                </Info>
            );
        case "pending_payment":
        case "payment_rejected":
            return (
                <>
                    <PaymentPanel order={order} onSubmitted={(o) => run("pay", async () => o, "Payment submitted — we'll verify it shortly")} />
                    <div className="text-center">{cancel}</div>
                </>
            );
        case "payment_submitted":
            return (
                <Info icon={Clock} title="We're verifying your payment">
                    {order.latestPayment && (
                        <p>
                            {order.latestPayment.method === "bkash" ? "bKash" : "Bank"} payment · TrxID <span className="font-mono font-bold">{order.latestPayment.transactionId}</span>
                        </p>
                    )}
                    <p>Our team checks each payment by hand. Your mentor is notified as soon as it&apos;s confirmed.</p>
                </Info>
            );
        case "funded":
            return (
                <Info icon={CheckCircle2} title="Payment verified">
                    <p>Waiting for {order.mentor.firstName} to accept and start. If they can&apos;t take it, you&apos;ll be refunded in full.</p>
                </Info>
            );
        case "in_progress":
            if (order.revisionCount > 0) {
                return (
                    <RevisionBanner order={order} title={`${order.mentor.firstName} is redoing the work`}>
                        Agaaw reviewed your dispute and asked your mentor to redeliver. Your payment stays on hold until
                        you confirm the new version (or dispute it again).
                    </RevisionBanner>
                );
            }
            return (
                <Info icon={Clock} title={`${order.mentor.firstName} is working on it`}>
                    <p>You&apos;ll be notified when the work is delivered.</p>
                </Info>
            );
        case "delivered": {
            const days = Math.round(config.disputeWindowHours / 24);
            return (
                <div className="space-y-4">
                    <Info icon={CheckCircle2} title={order.revisionCount ? "The revised work has been delivered" : "Your order has been delivered"}>
                        <p>Download the files below and check them. If everything is as agreed, confirm so your mentor gets paid.</p>
                    </Info>
                    <button
                        onClick={() => run("confirm", () => confirmReceived(order.id), "Thanks! Payment released to your mentor.")}
                        disabled={busy !== null}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {busy === "confirm" && <Loader2 size={16} className="animate-spin" />} Confirm you received the service
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                        If you don&apos;t respond, payment releases automatically {timeLeft(order.disputeDeadline)} (the {days}-day review window).
                    </p>
                    <div className="text-center">
                        <ReasonAction
                            tone="muted"
                            label="Something's wrong? Raise a dispute"
                            placeholder="What's wrong with the delivery? Our team will review both sides."
                            confirmLabel="Raise dispute"
                            onConfirm={(reason) => run("dispute", () => disputeOrder(order.id, reason), "Dispute raised — payment is on hold")}
                        />
                    </div>
                </div>
            );
        }
        case "disputed":
            return <Info icon={ShieldAlert} title="Under review">Agaaw is reviewing the dispute and will contact you both.</Info>;
        case "released":
            return <Info icon={CheckCircle2} title="Completed">Thanks — this order is complete.</Info>;
        case "refund_pending":
            return (
                <Info icon={Clock} title="Refund on the way">
                    {order.declineReason && <p>Mentor&apos;s reason: {order.declineReason}</p>}
                    <p>We&apos;ll send {formatTaka(order.amount)} back to the account you paid from.</p>
                </Info>
            );
        case "refunded":
            return <Info icon={CheckCircle2} title="Refunded">{formatTaka(order.amount)} was sent back to you.{order.refundNote ? ` ${order.refundNote}` : ""}</Info>;
        case "cancelled":
            return <Info icon={Clock} title="Cancelled">{order.declineReason ? `Mentor's reason: ${order.declineReason}` : describeCancel(order.cancelReason)}</Info>;
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Mentor
// ─────────────────────────────────────────────────────────────────────────

function MentorActions({
    order,
    busy,
    run,
    commissionRate,
    showToast,
    onChange,
}: {
    order: Order;
    busy: string | null;
    run: RunFn;
    commissionRate: number;
    showToast: (m: string, t?: "success" | "error") => void;
    onChange: (o: Order) => void;
}) {
    switch (order.status) {
        case "awaiting_quote":
            return <QuoteForm order={order} busy={busy} run={run} commissionRate={commissionRate} />;
        case "pending_payment":
        case "payment_rejected":
            return <Info icon={Clock} title="Waiting for the student to pay">You&apos;ll be notified once Agaaw verifies the payment. Don&apos;t start work before then.</Info>;
        case "payment_submitted":
            return <Info icon={Clock} title="Payment being verified">The student has paid; Agaaw is confirming it arrived. You&apos;ll be notified.</Info>;
        case "funded":
            return (
                <div className="space-y-4">
                    <Info icon={CheckCircle2} title="Paid — ready to start">
                        <p>Agaaw has received the student&apos;s payment. Accept to start work; you&apos;ll receive <b>{formatTaka(order.mentorPayout)}</b> after the student confirms delivery.</p>
                    </Info>
                    <div className="flex flex-wrap gap-3 items-start">
                        <button
                            onClick={() => run("accept", () => acceptOrder(order.id), "Order accepted — good luck!")}
                            disabled={busy !== null}
                            className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                            {busy === "accept" && <Loader2 size={15} className="animate-spin" />} Accept &amp; start
                        </button>
                        <ReasonAction
                            label="Decline"
                            placeholder="Why can't you take this? The student will be refunded in full."
                            confirmLabel="Decline & refund student"
                            onConfirm={(reason) => run("decline", () => declineOrder(order.id, reason), "Declined — the student will be refunded")}
                        />
                    </div>
                </div>
            );
        case "in_progress":
            return <DeliverPanel order={order} busy={busy} run={run} showToast={showToast} onChange={onChange} />;
        case "delivered":
            return (
                <div className="space-y-3">
                    <Info icon={Clock} title="Delivered — waiting for the student">
                        <p>
                            When the student confirms, {formatTaka(order.mentorPayout)} goes to your wallet. If they don&apos;t respond, it releases automatically{" "}
                            {timeLeft(order.disputeDeadline)}.
                        </p>
                    </Info>
                    <ReasonAction
                        tone="muted"
                        label="Problem with this order? Raise a dispute"
                        placeholder="Describe the problem for the Agaaw team"
                        confirmLabel="Raise dispute"
                        onConfirm={(reason) => run("dispute", () => disputeOrder(order.id, reason), "Dispute raised")}
                    />
                </div>
            );
        case "disputed":
            return <Info icon={ShieldAlert} title="Under review">Agaaw is reviewing the dispute. Your payout is on hold until it&apos;s resolved.</Info>;
        case "released":
            return (
                <Info icon={Wallet} title="Paid">
                    <p>
                        {formatTaka(order.mentorPayout)} was added to your wallet.{" "}
                        <Link href="/dashboard/mentor/wallet" className="font-semibold text-teal-700 underline">
                            Go to wallet
                        </Link>
                    </p>
                </Info>
            );
        case "refund_pending":
        case "refunded":
            return <Info icon={Clock} title={order.status === "refunded" ? "Refunded" : "Refund pending"}>The student&apos;s payment is being returned. No payout for this order.</Info>;
        case "cancelled":
            return <Info icon={Clock} title="Cancelled">{describeCancel(order.cancelReason)}</Info>;
    }
}

function QuoteForm({ order, busy, run, commissionRate }: { order: Order; busy: string | null; run: RunFn; commissionRate: number }) {
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const value = Number(amount);
    const valid = value >= 1 && value <= 1_000_000 && /^\d+(\.\d{1,2})?$/.test(amount);
    const split = previewSplit(value, commissionRate);

    return (
        <div className="space-y-4">
            <Info icon={Clock} title="Set your price">
                <p>{order.student.firstName} asked for a custom service. Quote a price in taka — they pay only if they accept it.</p>
            </Info>
            <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                    <span className="text-xs font-bold text-gray-700">Price the student pays</span>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">৳</span>
                        <input
                            type="number"
                            min={1}
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 2000"
                            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </label>
                <label className="space-y-1">
                    <span className="text-xs font-bold text-gray-700">Note (optional)</span>
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={1000}
                        placeholder="What the price includes, turnaround…"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    />
                </label>
            </div>
            {valid && <FeeBreakdown amount={value} platformFee={split.platformFee} mentorPayout={split.mentorPayout} commissionRate={commissionRate} />}
            <div className="flex flex-wrap gap-3 items-start">
                <button
                    onClick={() => run("quote", () => quoteOrder(order.id, value, note.trim()), "Price sent to the student")}
                    disabled={!valid || busy !== null}
                    className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                    {busy === "quote" && <Loader2 size={15} className="animate-spin" />} Send price
                </button>
                <ReasonAction
                    label="Decline request"
                    placeholder="Let the student know why"
                    confirmLabel="Decline"
                    onConfirm={(reason) => run("decline-quote", () => declineQuote(order.id, reason), "Request declined")}
                />
            </div>
        </div>
    );
}

function DeliverPanel({
    order,
    busy,
    run,
    showToast,
    onChange,
}: {
    order: Order;
    busy: string | null;
    run: RunFn;
    showToast: (m: string, t?: "success" | "error") => void;
    onChange: (o: Order) => void;
}) {
    const [note, setNote] = useState("");
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const round = order.revisionCount + 1;
    const currentFiles = order.deliverables.filter((f) => f.round === round);

    const upload = async (files: FileList | null) => {
        if (!files?.length) return;
        setUploading(true);
        const added = [];
        try {
            for (const file of Array.from(files)) {
                if (file.size > 10 * 1024 * 1024) {
                    showToast(`${file.name} is over 10 MB`, "error");
                    continue;
                }
                added.push(await uploadDeliverable(order.id, file));
            }
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Upload failed", "error");
        } finally {
            if (added.length) onChange({ ...order, deliverables: [...order.deliverables, ...added] });
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const remove = async (fileId: string) => {
        try {
            await removeDeliverable(order.id, fileId);
            onChange({ ...order, deliverables: order.deliverables.filter((d) => d.id !== fileId) });
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Couldn't remove the file", "error");
        }
    };

    return (
        <div className="space-y-4">
            {order.revisionCount > 0 ? (
                <RevisionBanner order={order} title={`Revision requested by Agaaw (${order.revisionCount} of ${order.maxRevisions})`}>
                    Upload the corrected files below and mark it delivered before the deadline. Your earlier files stay on
                    record. If you miss the deadline, the order goes back to Agaaw, who may refund the student.
                </RevisionBanner>
            ) : (
                <Info icon={Clock} title="Deliver the work">
                    <p>Upload the finished files (PDF, Word, images or zip, up to 10 MB each), add a note, then mark it delivered. The student can only see the files after you deliver.</p>
                </Info>
            )}

            <div className="space-y-2">
                {round > 1 && <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{roundLabel(round)} — new files</p>}
                {currentFiles.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-teal-600 shrink-0" />
                            <span className="text-sm font-semibold text-gray-800 truncate">{f.fileName}</span>
                            <span className="text-xs text-gray-400 shrink-0">{formatSize(f.sizeBytes)}</span>
                        </div>
                        <button onClick={() => remove(f.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50" aria-label="Remove file">
                            <Trash2 size={15} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-teal-400 text-sm font-semibold text-gray-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {uploading ? "Uploading…" : "Upload files"}
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp,.zip"
                    onChange={(e) => upload(e.target.files)}
                />
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={4000}
                placeholder="Note to the student: what you changed, what to look at, next steps…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm h-28 resize-none focus:outline-none focus:border-teal-500"
            />
            <button
                onClick={() => run("deliver", () => deliverOrder(order.id, note.trim()), "Delivered! The student has been notified.")}
                disabled={currentFiles.length === 0 || busy !== null || uploading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {busy === "deliver" && <Loader2 size={16} className="animate-spin" />} {round > 1 ? "Deliver the revision" : "Mark as delivered"}
            </button>
            {currentFiles.length === 0 && (
                <p className="text-xs text-gray-500 text-center">{round > 1 ? "Upload the revised files first." : "Upload at least one file first."}</p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────

function Info({ icon: Icon, title, children }: { icon: typeof Clock; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Icon size={18} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
                <p className="font-bold text-gray-900">{title}</p>
                {children}
            </div>
        </div>
    );
}

function describeCancel(reason: string | null): string {
    switch (reason) {
        case "quote_expired":
            return "The mentor didn't respond within 7 days.";
        case "payment_not_submitted":
            return "No payment was submitted within 7 days.";
        case "cancelled_by_student":
        case null:
            return "This order was cancelled before payment.";
        default:
            return reason;
    }
}

// ─────────────────────────────────────────────────────────────────────────
// Revisions & disputes
// ─────────────────────────────────────────────────────────────────────────

function roundLabel(round: number): string {
    return round === 1 ? "Original delivery" : `Revision ${round - 1}`;
}

function formatDue(iso: string | null): string {
    if (!iso) return "";
    return new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

/** Agaaw's instructions and the deadline — shown to both sides, word for word. */
function RevisionBanner({ order, title, children }: { order: Order; title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 font-bold text-amber-900">
                <RotateCcw size={16} /> {title}
            </p>
            {order.revisionDueAt && (
                <p className="text-amber-900">
                    Due <b>{formatDue(order.revisionDueAt)}</b> ({timeLeft(order.revisionDueAt)})
                </p>
            )}
            {order.revisionNote && (
                <blockquote className="border-l-2 border-amber-400 pl-3 text-gray-700 whitespace-pre-line">
                    <span className="block text-xs font-semibold text-amber-800 mb-0.5">Agaaw&apos;s instructions</span>
                    {order.revisionNote}
                </blockquote>
            )}
            <p className="text-gray-600">{children}</p>
        </div>
    );
}

const OUTCOME: Record<OrderDispute["status"], string> = {
    open: "Under review by Agaaw — payment is on hold",
    resolved_release: "Resolved: payment released to the mentor",
    resolved_refund: "Resolved: refunded to the student",
    resolved_revision: "Resolved: the mentor was asked to redo the work",
};

/** Every dispute on the order and how it was ruled, oldest first — nothing is overwritten. */
function DisputeHistory({ disputes, studentId }: { disputes: OrderDispute[]; studentId: string }) {
    return (
        <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4 text-sm">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-500" /> {disputes.length > 1 ? "Dispute history" : "Dispute"}
            </h2>
            <ol className="space-y-4">
                {disputes.map((d) => (
                    <li key={d.id} className="space-y-1 border-l-2 border-gray-200 pl-3">
                        <p className="text-xs font-semibold text-gray-500">
                            {roundLabel(d.round)} ·{" "}
                            {d.raisedById === null ? "raised automatically (deadline missed)" : d.raisedById === studentId ? "raised by the student" : "raised by the mentor"} ·{" "}
                            {new Date(d.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">{d.reason}</p>
                        <p className={d.status === "open" ? "text-amber-700" : "text-gray-600"}>
                            <b>{OUTCOME[d.status]}</b>
                            {d.adminNotes && d.status !== "resolved_revision" ? ` — ${d.adminNotes}` : ""}
                        </p>
                        {d.adminNotes && d.status === "resolved_revision" && (
                            <p className="text-gray-600">
                                <span className="text-xs font-semibold text-gray-500">Instructions: </span>
                                {d.adminNotes}
                            </p>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function FileRow({ file, onDownload }: { file: OrderDeliverable; onDownload: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
                <FileText size={18} className="text-teal-600 shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.fileName}</p>
                    <p className="text-xs text-gray-400">{formatSize(file.sizeBytes)}</p>
                </div>
            </div>
            <button onClick={onDownload} className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800">
                <Download size={15} /> Download
            </button>
        </div>
    );
}
