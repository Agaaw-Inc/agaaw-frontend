"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Loader2, Smartphone, Landmark, AlertTriangle, Upload } from "lucide-react";
import {
    formatTaka,
    getPaymentInstructions,
    submitPayment,
    type Order,
    type PaymentInstructions,
    type PaymentMethod,
} from "@/lib/orders";

function CopyValue({ value, large }: { value: string; large?: boolean }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            onClick={() => {
                navigator.clipboard?.writeText(value).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                });
            }}
            className={`inline-flex items-center gap-2 font-mono font-bold text-gray-900 hover:text-teal-700 ${large ? "text-2xl tracking-wider" : "text-sm"}`}
            title="Copy"
        >
            {value}
            {copied ? <Check size={large ? 18 : 14} className="text-teal-600" /> : <Copy size={large ? 18 : 14} className="text-gray-400" />}
        </button>
    );
}

export default function PaymentPanel({ order, onSubmitted }: { order: Order; onSubmitted: (o: Order) => void }) {
    const [info, setInfo] = useState<PaymentInstructions | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [method, setMethod] = useState<PaymentMethod>("bkash");
    const [senderInfo, setSenderInfo] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        getPaymentInstructions(order.id)
            .then((i) => {
                if (!alive) return;
                setInfo(i);
                if (!i.bkash && i.bank) setMethod("bank");
            })
            .catch((e) => alive && setLoadError(e instanceof Error ? e.message : "Couldn't load payment details"));
        return () => {
            alive = false;
        };
    }, [order.id]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            onSubmitted(await submitPayment(order.id, { method, senderInfo: senderInfo.trim(), transactionId: transactionId.trim(), screenshot }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't submit your payment");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadError) {
        return <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">{loadError}</p>;
    }
    if (!info) {
        return (
            <div className="flex justify-center py-10 text-gray-400">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    const isPersonal = info.bkash?.type !== "merchant";
    const formValid = senderInfo.trim().length >= 3 && /^[A-Za-z0-9\s-]{4,40}$/.test(transactionId.trim());

    return (
        <div className="space-y-6">
            {order.status === "payment_rejected" && order.latestPayment?.rejectionReason && (
                <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">We couldn&apos;t verify your last payment</p>
                        <p>{order.latestPayment.rejectionReason}</p>
                        <p className="mt-1 text-red-600">Please check the details and submit again.</p>
                    </div>
                </div>
            )}

            {/* Step 1 — how much and where */}
            <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5 space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Amount to send</p>
                        <p className="text-3xl font-extrabold text-gray-900">{formatTaka(info.amount)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Your order reference</p>
                        <CopyValue value={info.reference} large />
                    </div>
                </div>
                <p className="text-sm text-teal-800 font-medium">
                    Write <span className="font-mono font-bold">{info.reference}</span> in the payment&apos;s reference / note field so we can match your payment to this order.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {info.bkash && (
                    <div className="rounded-xl border border-gray-100 p-4 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <Smartphone size={18} className="text-pink-600" /> bKash ({isPersonal ? "Send Money" : "Payment"})
                        </div>
                        <CopyValue value={info.bkash.number} />
                        <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-0.5">
                            <li>Open bKash and choose <b>{isPersonal ? "Send Money" : "Payment"}</b></li>
                            <li>Enter {info.bkash.number} and {formatTaka(info.amount)}</li>
                            <li>Put <b>{info.reference}</b> in the reference</li>
                            <li>Copy the TrxID from the confirmation SMS</li>
                        </ol>
                    </div>
                )}
                {info.bank && (
                    <div className="rounded-xl border border-gray-100 p-4 space-y-1 text-sm">
                        <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                            <Landmark size={18} className="text-blue-600" /> Bank transfer
                        </div>
                        <p className="text-gray-600">{info.bank.bankName}{info.bank.branch ? `, ${info.bank.branch}` : ""}</p>
                        {info.bank.accountName && <p className="text-gray-600">A/C name: <b className="text-gray-900">{info.bank.accountName}</b></p>}
                        <p className="text-gray-600 flex items-center gap-1">A/C no: <CopyValue value={info.bank.accountNo} /></p>
                    </div>
                )}
            </div>
            {info.instructions && <p className="text-sm text-gray-600 whitespace-pre-line">{info.instructions}</p>}

            {/* Step 2 — proof */}
            <form onSubmit={submit} className="rounded-2xl border border-gray-100 p-5 space-y-4">
                <h3 className="font-bold text-gray-900">After you&apos;ve paid, tell us about it</h3>
                {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

                <div className="flex gap-2">
                    {info.bkash && (
                        <button type="button" onClick={() => setMethod("bkash")} className={`px-4 py-2 rounded-lg text-sm font-semibold border ${method === "bkash" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}>
                            bKash
                        </button>
                    )}
                    {info.bank && (
                        <button type="button" onClick={() => setMethod("bank")} className={`px-4 py-2 rounded-lg text-sm font-semibold border ${method === "bank" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}>
                            Bank transfer
                        </button>
                    )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1">
                        <span className="text-xs font-bold text-gray-700">{method === "bkash" ? "Your bKash number" : "Sender name / account"}</span>
                        <input
                            value={senderInfo}
                            onChange={(e) => setSenderInfo(e.target.value)}
                            maxLength={100}
                            placeholder={method === "bkash" ? "01XXXXXXXXX" : "Name on the account"}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-bold text-gray-700">Transaction ID</span>
                        <input
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            maxLength={40}
                            placeholder={method === "bkash" ? "e.g. 9J7K2L8M4N" : "Bank reference number"}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-teal-500"
                        />
                    </label>
                </div>

                <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-300 hover:border-teal-400">
                        <Upload size={15} /> {screenshot ? screenshot.name : "Attach a screenshot (optional)"}
                    </span>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            if (f && f.size > 5 * 1024 * 1024) {
                                setError("Screenshot must be 5 MB or smaller");
                                return;
                            }
                            setScreenshot(f);
                        }}
                    />
                </label>

                <button
                    type="submit"
                    disabled={!formValid || submitting}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting && <Loader2 size={16} className="animate-spin" />} I&apos;ve paid — submit for verification
                </button>
                <p className="text-xs text-gray-500 text-center">
                    Our team checks the payment by hand. Your mentor is notified as soon as it&apos;s verified.
                </p>
            </form>
        </div>
    );
}
