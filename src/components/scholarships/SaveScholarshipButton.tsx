"use client";

import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { getUserInfo } from "@/lib/auth";
import { checkScholarshipSaved, saveScholarship, unsaveScholarship } from "@/lib/api";

export default function SaveScholarshipButton({ scholarshipId }: { scholarshipId: string }) {
    const [isStudent, setIsStudent] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (getUserInfo()?.role !== "student") {
            setIsLoading(false);
            return;
        }

        setIsStudent(true);
        checkScholarshipSaved(scholarshipId)
            .then(setIsSaved)
            .finally(() => setIsLoading(false));
    }, [scholarshipId]);

    const handleToggle = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            if (isSaved) {
                await unsaveScholarship(scholarshipId);
                setIsSaved(false);
            } else {
                await saveScholarship(scholarshipId);
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Failed to toggle saved scholarship:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isStudent || isLoading) return null;

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isSaving}
            className={`mt-4 flex items-center justify-center gap-2 w-full text-base font-semibold py-3.5 px-6 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 ${isSaved
                    ? "bg-elm/10 text-elm border border-elm/30 hover:bg-elm/15"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
        >
            {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
            )}
            {isSaved ? "Saved — remove" : "Save for later"}
        </button>
    );
}
