"use client";

import React, { useState } from "react";
import { X, Ban, Loader2, AlertCircle } from "lucide-react";
import { cancelSession, type SessionListItem } from "@/lib/api";

interface CancelSessionModalProps {
    session: SessionListItem;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CancelSessionModal({ session, onClose, onSuccess }: CancelSessionModalProps) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await cancelSession(session.id, reason.trim() || undefined);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to cancel session. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Cancel Session</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{session.title}</p>
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

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    <p className="text-sm text-gray-600">
                        This will notify {session.counterpart.firstName} that the session is cancelled. This can&apos;t be undone.
                    </p>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Reason (optional)
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isSubmitting}
                            maxLength={500}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none disabled:opacity-50"
                            placeholder="Let them know why..."
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Keep Session
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Cancelling...
                            </>
                        ) : (
                            <>
                                <Ban size={16} /> Cancel Session
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
