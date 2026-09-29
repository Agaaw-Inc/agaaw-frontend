"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Package, PenLine, Clock } from "lucide-react";
import { getMentorServices, type MentorServiceItem } from "@/lib/api";
import { createOrder, formatTaka } from "@/lib/orders";

interface OrderServiceModalProps {
    connectionId: string;
    mentorId: string;
    mentorName: string;
    onClose: () => void;
}

type Tab = "services" | "custom";

export default function OrderServiceModal({ connectionId, mentorId, mentorName, onClose }: OrderServiceModalProps) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("services");
    const [services, setServices] = useState<MentorServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [customTitle, setCustomTitle] = useState("");
    const [customDescription, setCustomDescription] = useState("");

    useEffect(() => {
        let alive = true;
        getMentorServices(mentorId)
            .then((s) => {
                if (!alive) return;
                setServices(s);
                if (s.length === 0) setTab("custom");
            })
            .catch(() => alive && setError("Couldn't load this mentor's services."))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, [mentorId]);

    const orderService = async (serviceId: string) => {
        setSubmitting(serviceId);
        setError(null);
        try {
            const order = await createOrder({ connectionId, mentorServiceId: serviceId });
            router.push(`/dashboard/student/orders/${order.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't create the order");
            setSubmitting(null);
        }
    };

    const sendCustom = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting("custom");
        setError(null);
        try {
            const order = await createOrder({
                connectionId,
                customTitle: customTitle.trim(),
                customDescription: customDescription.trim(),
            });
            router.push(`/dashboard/student/orders/${order.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't send the request");
            setSubmitting(null);
        }
    };

    const customValid = customTitle.trim().length >= 3 && customDescription.trim().length >= 10;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order a service</h2>
                        <p className="text-sm text-gray-500">from {mentorName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex gap-1 px-6 pt-4">
                    {([
                        ["services", "Choose a service", Package],
                        ["custom", "Custom request", PenLine],
                    ] as const).map(([key, label, Icon]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === key ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Icon size={15} /> {label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

                    {tab === "services" &&
                        (loading ? (
                            <div className="flex justify-center py-10 text-gray-400">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : services.length === 0 ? (
                            <p className="text-sm text-gray-500 italic py-6 text-center">
                                This mentor hasn&apos;t listed any services yet — send a custom request instead.
                            </p>
                        ) : (
                            services.map((s) => (
                                <div key={s.id} className="flex items-start justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:border-teal-200 transition">
                                    <div className="space-y-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900">{s.title}</h3>
                                        {s.description && <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>}
                                        <div className="flex items-center gap-3 pt-1">
                                            <span className="text-sm font-extrabold text-teal-700">{formatTaka(s.price)}</span>
                                            {s.duration && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} /> {s.duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => orderService(s.id)}
                                        disabled={submitting !== null}
                                        className="shrink-0 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        {submitting === s.id && <Loader2 size={14} className="animate-spin" />} Order this
                                    </button>
                                </div>
                            ))
                        ))}

                    {tab === "custom" && (
                        <form onSubmit={sendCustom} className="space-y-3">
                            <p className="text-sm text-gray-600">
                                Describe what you need. {mentorName} will reply with a price, and you pay only if you accept it.
                            </p>
                            <input
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                maxLength={120}
                                placeholder="Service type (e.g. LOR review, visa interview prep)"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                            />
                            <textarea
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                maxLength={2000}
                                placeholder="Details: what you want done, deadlines, links to your drafts…"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm h-36 resize-none focus:outline-none focus:border-teal-500"
                            />
                            <button
                                type="submit"
                                disabled={!customValid || submitting !== null}
                                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting === "custom" && <Loader2 size={15} className="animate-spin" />} Request a quote
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
