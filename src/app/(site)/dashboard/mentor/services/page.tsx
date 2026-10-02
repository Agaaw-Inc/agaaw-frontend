"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock, Loader2, Package, Pencil, Plus, Trash2, Video } from "lucide-react";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import CategoryMembership from "@/components/dashboard/mentor/services/CategoryMembership";
import ServiceFormModal from "@/components/dashboard/mentor/services/ServiceFormModal";
import { formatTaka } from "@/lib/orders";
import {
    DELIVERY_TYPE_LABELS,
    deleteService,
    getCategories,
    getMyCategories,
    getMyServices,
    joinCategory,
    leaveCategory,
    type Category,
    type JoinedCategory,
    type MyMentorService,
} from "@/lib/categories";

/**
 * Static placeholders shown only while the mentor has no services. Never
 * saved, never fetched, not clickable — just a hint of what a listing looks like.
 */
const EXAMPLE_SERVICES = [
    { title: "CV review", desc: "Line-by-line feedback on your CV with a rewritten summary.", type: "deliverable" as const },
    { title: "60-min consultancy call", desc: "A focused call to answer your questions and plan next steps.", type: "session" as const },
    { title: "Full mentorship package", desc: "Ongoing guidance across several sessions, from plan to result.", type: "session" as const },
];

const UNCATEGORISED = "__none__";

export default function MentorServicesPage() {
    const { toast, showToast, hideToast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [joined, setJoined] = useState<JoinedCategory[]>([]);
    const [services, setServices] = useState<MyMentorService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
    const [formTarget, setFormTarget] = useState<MyMentorService | "new" | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<MyMentorService | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const load = useCallback(async () => {
        setIsLoading(true);
        setLoadError(null);
        try {
            const [all, mine, own] = await Promise.all([getCategories(), getMyCategories(), getMyServices()]);
            setCategories(all);
            setJoined(mine);
            setServices(own);
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : "Couldn't load your services");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const joinedIds = useMemo(() => new Set(joined.map((c) => c.id)), [joined]);
    const openJoined = useMemo(() => joined.filter((c) => c.isActive), [joined]);

    // Services grouped under the mentor's categories, in category order.
    const groups = useMemo(() => {
        const byCategory = new Map<string, MyMentorService[]>();
        for (const service of services) {
            const key = service.category?.id ?? UNCATEGORISED;
            byCategory.set(key, [...(byCategory.get(key) ?? []), service]);
        }
        const ordered = categories
            .filter((c) => byCategory.has(c.id))
            .map((c) => ({ key: c.id, name: c.name, items: byCategory.get(c.id)! }));
        if (byCategory.has(UNCATEGORISED)) {
            ordered.push({ key: UNCATEGORISED, name: "Needs a category", items: byCategory.get(UNCATEGORISED)! });
        }
        return ordered;
    }, [services, categories]);

    const toggleCategory = async (category: Category) => {
        setBusyCategoryId(category.id);
        try {
            const isJoined = joinedIds.has(category.id);
            setJoined(isJoined ? await leaveCategory(category.id) : await joinCategory(category.id));
            showToast(isJoined ? `Left ${category.name}` : `Joined ${category.name}`);
        } catch (err) {
            // e.g. "You still have 2 active services in this category. Delete them first."
            showToast(err instanceof Error ? err.message : "Something went wrong", "error");
        } finally {
            setBusyCategoryId(null);
        }
    };

    const handleSaved = (saved: MyMentorService) => {
        setServices((prev) =>
            prev.some((s) => s.id === saved.id) ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved]
        );
        showToast(formTarget === "new" ? "Service added" : "Service updated");
        setFormTarget(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteService(deleteTarget.id);
            setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
            showToast("Service deleted");
            setDeleteTarget(null);
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Couldn't delete the service", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper">
            <Toast toast={toast} onHide={hideToast} />
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Services</h1>
                        <p className="text-gray-600 mt-1">What you offer, in your own words, at your own price.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormTarget("new")}
                        disabled={openJoined.length === 0}
                        title={openJoined.length === 0 ? "Join a category first" : undefined}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} /> Add service
                    </button>
                </div>

                {loadError && (
                    <div className="flex items-center justify-between gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                        <span className="flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{loadError}</span>
                        <button onClick={() => void load()} className="font-semibold underline">Try again</button>
                    </div>
                )}

                <CategoryMembership
                    categories={categories}
                    joinedIds={joinedIds}
                    busyId={busyCategoryId}
                    onToggle={toggleCategory}
                />

                {openJoined.length === 0 && !loadError && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>
                            <span className="font-bold">Join a category to start adding services.</span> Pick one or more above
                            — students browse services by category.
                        </p>
                    </div>
                )}

                {/* Services */}
                {services.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900">Your services</h2>
                        <p className="text-sm text-gray-500 mt-1 mb-5">
                            You haven&apos;t added any services yet. Here&apos;s what a listing can look like:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-hidden="true">
                            {EXAMPLE_SERVICES.map((example) => (
                                <div
                                    key={example.title}
                                    className="relative border border-dashed border-gray-200 rounded-xl p-5 bg-gray-50 opacity-60 select-none pointer-events-none"
                                >
                                    <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200/70 rounded px-1.5 py-0.5">
                                        Example — add your own
                                    </span>
                                    <h3 className="text-sm font-bold text-gray-700">{example.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-1 mb-3">{example.desc}</p>
                                    <span className="text-base font-bold text-gray-500">৳[price]</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group.key} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <h2 className="text-lg font-bold text-gray-900">{group.name}</h2>
                                {group.key === UNCATEGORISED && (
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                                        Not listed yet
                                    </span>
                                )}
                            </div>
                            {group.key === UNCATEGORISED && (
                                <p className="text-sm text-gray-500 -mt-3 mb-5">
                                    Students can still order these from your profile, but they won&apos;t appear on a category page until you edit them and pick a category.
                                </p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {group.items.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        onEdit={() => setFormTarget(service)}
                                        onDelete={() => setDeleteTarget(service)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {formTarget && (
                <ServiceFormModal
                    categories={openJoined}
                    service={formTarget === "new" ? undefined : formTarget}
                    onClose={() => setFormTarget(null)}
                    onSaved={handleSaved}
                />
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-service-title">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteTarget(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 id="delete-service-title" className="text-lg font-bold text-gray-900 mb-2">Delete this service?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            <strong className="text-gray-700">{deleteTarget.title}</strong> will no longer be offered. Orders already placed for it are not affected.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

function ServiceCard({ service, onEdit, onDelete }: { service: MyMentorService; onEdit: () => void; onDelete: () => void }) {
    const DeliveryIcon = service.deliveryType === "session" ? Video : Package;
    return (
        <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all relative bg-white flex flex-col">
            <div className="absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-b-full" />
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-gray-900">{service.title}</h3>
                <div className="flex items-center gap-1 -mr-2 -mt-1 shrink-0">
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label={`Edit ${service.title}`}
                        className="p-2 text-gray-400 hover:text-teal-700 rounded-full hover:bg-teal-50 transition-colors"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        aria-label={`Delete ${service.title}`}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
            {service.description && (
                <p className="text-xs text-gray-500 leading-relaxed mt-1 mb-4 line-clamp-2">{service.description}</p>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                <span className="text-lg font-bold text-teal-700">{formatTaka(service.price)}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <DeliveryIcon size={12} /> {DELIVERY_TYPE_LABELS[service.deliveryType]}
                </span>
                {service.duration && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {service.duration}
                    </span>
                )}
            </div>
        </div>
    );
}
