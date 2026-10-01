"use client";

import React, { useState } from "react";
import { Loader2, Package, Save, Video, X } from "lucide-react";
import { useOrderConfig } from "@/hooks/useOrderConfig";
import { formatTaka, previewSplit } from "@/lib/orders";
import {
    createService,
    updateService,
    type JoinedCategory,
    type MyMentorService,
    type ServiceDeliveryType,
} from "@/lib/categories";

// Mirrors the API's rules so mistakes show up before the request is sent.
const MAX_PRICE = 500_000;
const DURATION_OPTIONS = [30, 45, 60, 90, 120];

interface ServiceFormModalProps {
    /** Only categories the mentor has joined and that are open. */
    categories: JoinedCategory[];
    /** Present when editing; absent when adding. */
    service?: MyMentorService;
    onClose: () => void;
    onSaved: (service: MyMentorService) => void;
}

export default function ServiceFormModal({ categories, service, onClose, onSaved }: ServiceFormModalProps) {
    const { commissionRate } = useOrderConfig();
    const feePct = Math.round(commissionRate * 100);
    const isEdit = !!service;

    const [title, setTitle] = useState(service?.title ?? "");
    const [description, setDescription] = useState(service?.description ?? "");
    const [categoryId, setCategoryId] = useState(
        // A legacy service with no category (or a category since closed) must pick one.
        service?.category && categories.some((c) => c.id === service.category!.id)
            ? service.category.id
            : categories.length === 1
                ? categories[0].id
                : ""
    );
    const [price, setPrice] = useState(service ? String(Number(service.price)) : "");
    const [deliveryType, setDeliveryType] = useState<ServiceDeliveryType>(service?.deliveryType ?? "session");
    const [durationMinutes, setDurationMinutes] = useState(
        service?.durationMinutes ? String(service.durationMinutes) : "60"
    );
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const durationChoices = DURATION_OPTIONS.includes(Number(durationMinutes)) || !durationMinutes
        ? DURATION_OPTIONS
        : [...DURATION_OPTIONS, Number(durationMinutes)].sort((a, b) => a - b);

    const priceNumber = Number(price);
    const split = previewSplit(priceNumber, commissionRate);

    function validate(): string | null {
        if (title.trim().length < 3) return "Give the service a title of at least 3 characters.";
        if (title.trim().length > 120) return "Keep the title under 120 characters.";
        if (!categoryId) return "Choose a category.";
        if (!price || !Number.isFinite(priceNumber) || priceNumber < 1) return "Enter a price of at least ৳1.";
        if (priceNumber > MAX_PRICE) return `The highest price you can set is ${formatTaka(MAX_PRICE)}.`;
        // Checked on the text, not the number: 19.99 * 100 is 1998.9999999999998 in floating point.
        if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) return "Price can have at most 2 decimal places.";
        if (description.length > 2000) return "Keep the description under 2000 characters.";
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }

        setIsSaving(true);
        setError(null);
        const input = {
            title: title.trim(),
            description: description.trim(),
            categoryId,
            price: priceNumber,
            deliveryType,
            ...(deliveryType === "session" && durationMinutes ? { durationMinutes: Number(durationMinutes) } : {}),
        };
        try {
            const saved = isEdit ? await updateService(service.id, input) : await createService(input);
            onSaved(saved);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't save the service. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 id="service-form-title" className="text-xl font-bold text-gray-900">
                        {isEdit ? "Edit service" : "Add a service"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="svc-title" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Title</label>
                        <input
                            id="svc-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. CV review, 60-min career call"
                            maxLength={120}
                            disabled={isSaving}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="svc-desc" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Description <span className="normal-case font-medium text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="svc-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What the student gets, and what you need from them."
                            maxLength={2000}
                            disabled={isSaving}
                            className={`${inputClass} resize-none h-24`}
                        />
                    </div>

                    <div>
                        <label htmlFor="svc-category" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
                        <select
                            id="svc-category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={isSaving}
                            className={inputClass}
                            required
                        >
                            <option value="" disabled>Choose a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <fieldset>
                        <legend className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">How it&apos;s delivered</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                { value: "session", label: "Live session", hint: "A call or meeting", icon: Video },
                                { value: "deliverable", label: "Deliverable", hint: "You hand over work", icon: Package },
                            ] as const).map(({ value, label, hint, icon: Icon }) => (
                                <label
                                    key={value}
                                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${deliveryType === value ? "border-teal-500 bg-teal-50/60" : "border-gray-200 hover:border-gray-300"}`}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryType"
                                        value={value}
                                        checked={deliveryType === value}
                                        onChange={() => setDeliveryType(value)}
                                        disabled={isSaving}
                                        className="sr-only"
                                    />
                                    <Icon size={18} className={deliveryType === value ? "text-teal-600 mt-0.5" : "text-gray-400 mt-0.5"} />
                                    <span>
                                        <span className="block text-sm font-semibold text-gray-900">{label}</span>
                                        <span className="block text-xs text-gray-500">{hint}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="svc-price" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Price (taka)</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">৳</span>
                                <input
                                    id="svc-price"
                                    type="number"
                                    inputMode="decimal"
                                    min={1}
                                    max={MAX_PRICE}
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="1500"
                                    disabled={isSaving}
                                    className={`${inputClass} pl-8`}
                                    required
                                />
                            </div>
                        </div>
                        {deliveryType === "session" && (
                            <div>
                                <label htmlFor="svc-duration" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Length</label>
                                <select
                                    id="svc-duration"
                                    value={durationMinutes}
                                    onChange={(e) => setDurationMinutes(e.target.value)}
                                    disabled={isSaving}
                                    className={inputClass}
                                >
                                    {durationChoices.map((m) => (
                                        <option key={m} value={m}>{m} min</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {priceNumber > 0 && (
                        <p className="text-xs text-gray-600 bg-teal-50/60 border border-teal-100 rounded-lg px-3 py-2">
                            Student pays {formatTaka(priceNumber)} · Agaaw fee ({feePct}%) {formatTaka(split.platformFee)} ·{" "}
                            <span className="font-bold text-teal-700">You receive {formatTaka(split.mentorPayout)}</span>
                        </p>
                    )}

                    {error && (
                        <p role="alert" className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add service"}
                    </button>
                </div>
            </form>
        </div>
    );
}
