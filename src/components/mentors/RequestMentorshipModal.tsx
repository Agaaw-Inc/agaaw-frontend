"use client";

import React, { useEffect, useState } from "react";
import { X, Send, Loader2, AlertCircle } from "lucide-react";
import { getMentorServices, sendMentorshipRequest, type MentorServiceItem } from "@/lib/api";

const MIN_MESSAGE_LENGTH = 20;

interface RequestMentorshipModalProps {
    mentorId: string;
    mentorName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RequestMentorshipModal({
    mentorId,
    mentorName,
    onClose,
    onSuccess,
}: RequestMentorshipModalProps) {
    const [services, setServices] = useState<MentorServiceItem[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getMentorServices(mentorId);
                if (!cancelled) setServices(data.filter((s) => s.isActive));
            } catch {
                if (!cancelled) setServices([]);
            } finally {
                if (!cancelled) setIsLoadingServices(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mentorId]);

    const toggleService = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const total = services
        .filter((s) => selectedIds.has(s.id))
        .reduce((sum, s) => sum + Number(s.price || 0), 0);

    const currency = services.find((s) => selectedIds.has(s.id))?.currency || "$";

    const trimmedLength = message.trim().length;
    const isMessageValid = trimmedLength >= MIN_MESSAGE_LENGTH;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMessageValid || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await sendMentorshipRequest({
                mentorId,
                message: message.trim(),
                serviceIds: Array.from(selectedIds),
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send mentorship request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Request Mentorship</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Send a request to {mentorName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
                    <div className="p-6 space-y-6 flex-1">
                        {error && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Message */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-50"
                                placeholder="Introduce yourself and explain what you'd like help with..."
                            />
                            <p className={`text-xs ${isMessageValid ? "text-gray-400" : "text-amber-600 font-semibold"}`}>
                                {trimmedLength}/{MIN_MESSAGE_LENGTH} characters minimum
                            </p>
                        </div>

                        {/* Services */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Select Services (optional)
                            </label>
                            {isLoadingServices ? (
                                <div className="flex items-center justify-center py-6 text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            ) : services.length === 0 ? (
                                <p className="text-sm text-gray-500 italic py-2">
                                    This mentor hasn&apos;t listed any paid services yet.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {services.map((service) => (
                                        <label
                                            key={service.id}
                                            className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${selectedIds.has(service.id)
                                                    ? "border-teal-500 bg-teal-50/50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(service.id)}
                                                    onChange={() => toggleService(service.id)}
                                                    disabled={isSubmitting}
                                                    className="w-4 h-4 accent-teal-600 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {service.title}
                                                    </p>
                                                    {service.durationMinutes && (
                                                        <p className="text-xs text-gray-500">
                                                            {service.durationMinutes} min
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800 shrink-0">
                                                {service.currency || "$"}
                                                {service.price}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedIds.size > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-sm font-semibold text-gray-600">Total</span>
                                <span className="text-lg font-extrabold text-gray-900">
                                    {currency}
                                    {total.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isMessageValid || isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} /> Send Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
