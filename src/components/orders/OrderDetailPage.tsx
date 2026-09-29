"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Footer from "@/components/landing/Footer";
import { getOrder, type Order } from "@/lib/orders";
import OrderDetailView from "./OrderDetailView";

export default function OrderDetailPage({ role }: { role: "student" | "mentor" }) {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        getOrder(id)
            .then((o) => alive && setOrder(o))
            .catch((e) => alive && setError(e instanceof Error ? e.message : "Couldn't load this order"));
        return () => {
            alive = false;
        };
    }, [id]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-4xl mx-auto px-6 py-10">
                {error ? (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">{error}</p>
                ) : !order ? (
                    <div className="flex justify-center py-20 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <OrderDetailView order={order} role={role} onChange={setOrder} />
                )}
            </div>
            <Footer />
        </div>
    );
}
