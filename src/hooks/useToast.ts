"use client";

import { useCallback, useState } from "react";
import type { ToastState } from "@/components/ui/Toast";

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastState["type"] = "success") => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => setToast(null), []);

    return { toast, showToast, hideToast };
}
