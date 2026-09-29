"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package, ChevronRight } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { listOrders, formatTaka, ORDER_TABS, type Order, type OrderList, type OrderStatus } from "@/lib/orders";
import OrderStatusBadge from "./OrderStatusBadge";

/** Statuses where this side has to do something next. */
const NEEDS_ACTION: Record<"student" | "mentor", OrderStatus[]> = {
    student: ["pending_payment", "payment_rejected", "delivered"],
    mentor: ["awaiting_quote", "funded", "in_progress"],
};

export default function OrdersListPage({ role }: { role: "student" | "mentor" }) {
    const [tab, setTab] = useState(ORDER_TABS[0].key);
    const [result, setResult] = useState<OrderList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const statuses = ORDER_TABS.find((t) => t.key === tab)!.statuses;
            setResult(await listOrders({ status: statuses, limit: 50 }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't load orders");
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => {
        void load();
    }, [load]);

    const counts = result?.counts ?? {};
    const tabCount = (statuses: OrderStatus[]) => statuses.reduce((n, s) => n + (counts[s] ?? 0), 0);
    const actionCount = tabCount(NEEDS_ACTION[role]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{role === "student" ? "My Orders" : "Incoming Orders"}</h1>
                        <p className="text-gray-600 mt-1">
                            {role === "student"
                                ? "Services you've ordered from your mentors."
                                : "Paid work from your students. Payouts land in your wallet after the student confirms."}
                        </p>
                    </div>
                    {actionCount > 0 && (
                        <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                            {actionCount} need{actionCount === 1 ? "s" : ""} your action
                        </span>
                    )}
                </div>

                <div className="flex gap-1 border-b border-gray-200">
                    {ORDER_TABS.map((t) => {
                        const n = tabCount(t.statuses);
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${tab === t.key ? "border-teal-600 text-teal-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                            >
                                {t.label}
                                {n > 0 && <span className="ml-1.5 text-xs text-gray-400">{n}</span>}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">{error}</p>
                ) : !result?.data.length ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-semibold">No orders here yet.</p>
                        {role === "student" && (
                            <Link href="/dashboard/student/mentors" className="inline-block mt-4 text-teal-600 font-semibold hover:underline">
                                Order a service from your mentors &rarr;
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {result.data.map((order) => (
                            <OrderRow key={order.id} order={order} role={role} needsAction={NEEDS_ACTION[role].includes(order.status)} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

function OrderRow({ order, role, needsAction }: { order: Order; role: "student" | "mentor"; needsAction: boolean }) {
    const other = role === "student" ? order.mentor : order.student;
    return (
        <Link
            href={`/dashboard/${role}/orders/${order.id}`}
            className={`flex items-center gap-4 bg-white border rounded-xl p-4 hover:shadow-sm transition ${needsAction ? "border-amber-200" : "border-gray-100 hover:border-teal-200"}`}
        >
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-mono text-[11px] text-gray-400">{order.reference}</span>
                </div>
                <p className="font-bold text-gray-900 truncate">{order.title}</p>
                <p className="text-xs text-gray-500">
                    {role === "student" ? "Mentor" : "Student"}: {other.firstName} {other.lastName} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className="text-right shrink-0">
                <p className="font-extrabold text-gray-900">{order.amount ? formatTaka(order.amount) : "—"}</p>
                {role === "mentor" && order.mentorPayout && <p className="text-xs font-semibold text-teal-700">You get {formatTaka(order.mentorPayout)}</p>}
            </div>
            <ChevronRight size={18} className="text-gray-300 shrink-0" />
        </Link>
    );
}
