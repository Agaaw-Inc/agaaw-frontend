"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Wallet as WalletIcon, Clock, TrendingUp, Loader2, ShieldCheck, ShieldAlert, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useOrderConfig } from "@/hooks/useOrderConfig";
import {
    formatTaka,
    getPayouts,
    getWallet,
    getWalletTransactions,
    PAYOUT_METHOD_LABEL,
    requestPayout,
    updatePayoutDetails,
    type Payout,
    type PayoutMethod,
    type Wallet,
    type WalletTransaction,
} from "@/lib/orders";

const TXN_LABEL: Record<WalletTransaction["type"], string> = {
    credit_released: "Order payment",
    debit_payout: "Withdrawal",
    credit_payout_reversal: "Withdrawal returned",
};

const PAYOUT_BADGE: Record<Payout["status"], string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
};

export default function MentorWalletPage() {
    const config = useOrderConfig();
    const { toast, showToast, hideToast } = useToast();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [txns, setTxns] = useState<WalletTransaction[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [withdrawing, setWithdrawing] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const load = useCallback(async () => {
        try {
            const [w, t, p] = await Promise.all([getWallet(), getWalletTransactions(), getPayouts()]);
            setWallet(w);
            setTxns(t.data);
            setPayouts(p.data);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Couldn't load your wallet", "error");
        }
    }, [showToast]);

    useEffect(() => {
        void load();
    }, [load]);

    const withdraw = async () => {
        setWithdrawing(true);
        try {
            await requestPayout();
            showToast("Withdrawal requested — you'll be notified when it's sent");
            setConfirming(false);
            await load();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Couldn't request a withdrawal", "error");
        } finally {
            setWithdrawing(false);
        }
    };

    if (!wallet) {
        return (
            <div className="min-h-screen bg-paper flex justify-center pt-32 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const pct = Math.round(config.commissionRate * 100);

    return (
        <div className="min-h-screen bg-paper">
            <Toast toast={toast} onHide={hideToast} />
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Wallet</h1>
                    <p className="text-gray-600 mt-1">
                        Amounts shown are what you take home — after Agaaw&apos;s {pct}% platform fee.
                    </p>
                </div>

                {/* Balances */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Stat icon={WalletIcon} label="Available to withdraw" value={formatTaka(wallet.availableBalance)} accent />
                    <Stat
                        icon={Clock}
                        label="On the way"
                        value={formatTaka(wallet.pendingEarnings)}
                        sub={`${wallet.pendingEarningsOrders} paid order${wallet.pendingEarningsOrders === 1 ? "" : "s"} not yet confirmed`}
                    />
                    <Stat icon={TrendingUp} label="Total earned" value={formatTaka(wallet.totalEarned)} />
                </div>

                {/* Withdraw */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        <p className="font-bold text-gray-900">Withdraw your balance</p>
                        {wallet.canRequestPayout ? (
                            <p>
                                {formatTaka(wallet.availableBalance)} will be sent to your {PAYOUT_METHOD_LABEL[wallet.payoutMethod!]} account ending{" "}
                                {wallet.payoutDetails?.accountNumber.slice(-4)}.
                            </p>
                        ) : (
                            <p>{wallet.blockedReason}</p>
                        )}
                        {Number(wallet.pendingPayoutAmount) > 0 && <p className="text-amber-700">{formatTaka(wallet.pendingPayoutAmount)} withdrawal in progress.</p>}
                    </div>
                    {confirming ? (
                        <div className="flex gap-2">
                            <button onClick={() => setConfirming(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">
                                Cancel
                            </button>
                            <button
                                onClick={withdraw}
                                disabled={withdrawing}
                                className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                            >
                                {withdrawing && <Loader2 size={15} className="animate-spin" />} Confirm {formatTaka(wallet.availableBalance)}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            disabled={!wallet.canRequestPayout}
                            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Request withdrawal
                        </button>
                    )}
                </div>

                <PayoutDetailsForm wallet={wallet} onSaved={(w) => { setWallet(w); showToast("Payout details saved — Agaaw will verify them shortly"); }} onError={(m) => showToast(m, "error")} />

                {/* History */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                        <h2 className="font-bold text-gray-900">Activity</h2>
                        {txns.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No activity yet. Payments appear here when students confirm your{" "}
                                <Link href="/dashboard/mentor/orders" className="text-teal-700 font-semibold underline">orders</Link>.
                            </p>
                        ) : (
                            txns.map((t) => {
                                const credit = t.type !== "debit_payout";
                                return (
                                    <div key={t.id} className="flex items-center justify-between gap-3 text-sm border-b border-gray-50 pb-2 last:border-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {credit ? <ArrowDownLeft size={16} className="text-emerald-600 shrink-0" /> : <ArrowUpRight size={16} className="text-gray-400 shrink-0" />}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">{t.order ? t.order.title : TXN_LABEL[t.type]}</p>
                                                <p className="text-xs text-gray-400">
                                                    {TXN_LABEL[t.type]} · {new Date(t.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold shrink-0 ${credit ? "text-emerald-700" : "text-gray-700"}`}>
                                            {credit ? "+" : "−"}
                                            {formatTaka(t.amount)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                        <h2 className="font-bold text-gray-900">Withdrawals</h2>
                        {payouts.length === 0 ? (
                            <p className="text-sm text-gray-500">No withdrawals yet.</p>
                        ) : (
                            payouts.map((p) => (
                                <div key={p.id} className="flex items-center justify-between gap-3 text-sm border-b border-gray-50 pb-2 last:border-0">
                                    <div>
                                        <p className="font-semibold text-gray-800">{formatTaka(p.amount)} via {PAYOUT_METHOD_LABEL[p.method]}</p>
                                        <p className="text-xs text-gray-400">
                                            Requested {new Date(p.requestedAt).toLocaleDateString()}
                                            {p.transferReference ? ` · ref ${p.transferReference}` : ""}
                                        </p>
                                        {p.status === "failed" && p.adminNote && <p className="text-xs text-red-600">{p.adminNote}</p>}
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${PAYOUT_BADGE[p.status]}`}>{p.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function Stat({ icon: Icon, label, value, sub, accent }: { icon: typeof WalletIcon; label: string; value: string; sub?: string; accent?: boolean }) {
    return (
        <div className={`rounded-2xl border p-5 ${accent ? "bg-teal-600 border-teal-700 text-white" : "bg-white border-gray-100"}`}>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${accent ? "text-teal-100" : "text-gray-500"}`}>
                <Icon size={15} /> {label}
            </div>
            <p className={`text-3xl font-extrabold mt-2 ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
    );
}

function PayoutDetailsForm({ wallet, onSaved, onError }: { wallet: Wallet; onSaved: (w: Wallet) => void; onError: (m: string) => void }) {
    const [editing, setEditing] = useState(!wallet.payoutMethod);
    const [method, setMethod] = useState<PayoutMethod>(wallet.payoutMethod ?? "bkash");
    const [accountNumber, setAccountNumber] = useState(wallet.payoutDetails?.accountNumber ?? "");
    const [accountName, setAccountName] = useState(wallet.payoutDetails?.accountName ?? "");
    const [bankName, setBankName] = useState(wallet.payoutDetails?.bankName ?? "");
    const [branchName, setBranchName] = useState(wallet.payoutDetails?.branchName ?? "");
    const [saving, setSaving] = useState(false);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            onSaved(
                await updatePayoutDetails({
                    method,
                    accountNumber: accountNumber.trim(),
                    accountName: accountName.trim(),
                    bankName: method === "bank" ? bankName.trim() : undefined,
                    branchName: method === "bank" ? branchName.trim() || undefined : undefined,
                }),
            );
            setEditing(false);
        } catch (err) {
            onError(err instanceof Error ? err.message : "Couldn't save payout details");
        } finally {
            setSaving(false);
        }
    };

    const input = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-bold text-gray-900">Where we send your money</h2>
                    {wallet.payoutMethod &&
                        (wallet.kycVerified ? (
                            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                                <ShieldCheck size={14} /> Verified by Agaaw
                            </p>
                        ) : (
                            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mt-0.5">
                                <ShieldAlert size={14} /> Waiting for verification — you can withdraw once it&apos;s checked
                            </p>
                        ))}
                </div>
                {!editing && (
                    <button onClick={() => setEditing(true)} className="text-sm font-semibold text-teal-700 hover:underline">
                        Change
                    </button>
                )}
            </div>

            {!editing && wallet.payoutDetails ? (
                <div className="text-sm text-gray-600">
                    <p>
                        <b className="text-gray-900">{PAYOUT_METHOD_LABEL[wallet.payoutMethod!]}</b> · {wallet.payoutDetails.accountNumber} · {wallet.payoutDetails.accountName}
                    </p>
                    {wallet.payoutDetails.bankName && (
                        <p>
                            {wallet.payoutDetails.bankName}
                            {wallet.payoutDetails.branchName ? `, ${wallet.payoutDetails.branchName}` : ""}
                        </p>
                    )}
                </div>
            ) : (
                <form onSubmit={save} className="space-y-3">
                    <div className="flex gap-2">
                        {(["bkash", "nagad", "bank"] as PayoutMethod[]).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMethod(m)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${method === m ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}
                            >
                                {PAYOUT_METHOD_LABEL[m]}
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={method === "bank" ? "Account number" : "01XXXXXXXXX (personal account)"} className={input} />
                        <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account holder name" className={input} />
                        {method === "bank" && (
                            <>
                                <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" className={input} />
                                <input value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="Branch (optional)" className={input} />
                            </>
                        )}
                    </div>
                    {wallet.kycVerified && <p className="text-xs text-amber-700">Changing these needs re-verification before your next withdrawal.</p>}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={saving || accountNumber.trim().length < 5 || accountName.trim().length < 2 || (method === "bank" && !bankName.trim())}
                            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <Loader2 size={15} className="animate-spin" />} Save
                        </button>
                        {wallet.payoutMethod && (
                            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
