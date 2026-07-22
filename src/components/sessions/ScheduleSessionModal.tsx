"use client";

import React, { useState } from "react";
import { X, CalendarPlus, Loader2, AlertCircle } from "lucide-react";
import { createSession } from "@/lib/api";

const DURATIONS = [30, 45, 60, 90];

interface ScheduleSessionModalProps {
    connectionId: string;
    studentName: string;
    onClose: () => void;
    onSuccess: () => void;
}

function todayLocalDate(): string {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

export default function ScheduleSessionModal({
    connectionId,
    studentName,
    onClose,
    onSuccess,
}: ScheduleSessionModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(todayLocalDate());
    const [time, setTime] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const isValid = title.trim().length > 0 && date.length > 0 && time.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        const scheduledAt = new Date(`${date}T${time}`);
        if (Number.isNaN(scheduledAt.getTime())) {
            setError("Please choose a valid date and time.");
            return;
        }
        if (scheduledAt.getTime() <= Date.now()) {
            setError("Please choose a time in the future.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await createSession({
                connectionId,
                title: title.trim(),
                description: description.trim() || undefined,
                scheduledAt: scheduledAt.toISOString(),
                durationMinutes,
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to schedule session. Please try again.");
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
                        <h2 className="text-xl font-bold text-gray-900">Schedule Session</h2>
                        <p className="text-sm text-gray-500 mt-0.5">With {studentName}</p>
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
                    <div className="p-6 space-y-5 flex-1">
                        {error && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Topic <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="e.g. SOP Review & Feedback"
                                maxLength={150}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    min={todayLocalDate()}
                                    onChange={(e) => setDate(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 -mt-3">
                            Times are shown in your local timezone ({timeZone}).
                        </p>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Duration
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {DURATIONS.map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDurationMinutes(d)}
                                        disabled={isSubmitting}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors disabled:opacity-50 ${durationMinutes === d
                                                ? "bg-teal-600 border-teal-600 text-white"
                                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        {d} min
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Notes (optional)
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                maxLength={1000}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none disabled:opacity-50"
                                placeholder="What should the student bring or prepare?"
                            />
                        </div>
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
                            disabled={!isValid || isSubmitting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarPlus size={16} /> Schedule Session
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
