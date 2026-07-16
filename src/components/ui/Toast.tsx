"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ToastState {
    message: string;
    type: "success" | "error";
}

interface ToastProps {
    toast: ToastState | null;
    onHide: () => void;
}

export default function Toast({ toast, onHide }: ToastProps) {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(onHide, 4000);
        return () => clearTimeout(timer);
    }, [toast, onHide]);

    if (!toast) return null;

    return (
        <div className="fixed top-6 right-6 z-[200]">
            <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold max-w-sm ${toast.type === "success"
                        ? "bg-teal-600 text-white border-teal-700"
                        : "bg-red-600 text-white border-red-700"
                    }`}
            >
                {toast.type === "success" ? (
                    <CheckCircle2 size={18} className="shrink-0" />
                ) : (
                    <XCircle size={18} className="shrink-0" />
                )}
                <span>{toast.message}</span>
            </div>
        </div>
    );
}
