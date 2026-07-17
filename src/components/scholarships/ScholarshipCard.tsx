"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import { getUserInfo } from "@/lib/auth";
import { saveScholarship, unsaveScholarship } from "@/lib/api";

interface ScholarshipCardProps {
    id: string;
    title: string;
    university: string;
    deadline: string;
    image: string;
    slug: string;
    funding?: string;
    amount?: string;
    isSavedInitially?: boolean;
    onSavedChange?: (id: string, saved: boolean) => void;
}

export default function ScholarshipCard({
    id,
    title,
    university,
    deadline,
    image,
    slug,
    funding,
    amount,
    isSavedInitially = false,
    onSavedChange,
}: ScholarshipCardProps) {
    const [isSaved, setIsSaved] = useState(isSavedInitially);
    const [isSaving, setIsSaving] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    // Determined post-mount (not during render) so the server-rendered HTML
    // and the client's first hydration pass agree — localStorage isn't
    // available on the server, so checking role during render would mismatch.
    useEffect(() => {
        setIsStudent(getUserInfo()?.role === "student");
    }, []);

    // Keep in sync when the parent resolves the real saved state asynchronously
    // (e.g. after fetching the saved-scholarships list post-mount).
    useEffect(() => {
        setIsSaved(isSavedInitially);
    }, [isSavedInitially]);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSaving) return;

        setIsSaving(true);
        try {
            if (isSaved) {
                await unsaveScholarship(id);
                setIsSaved(false);
                onSavedChange?.(id, false);
            } else {
                await saveScholarship(id);
                setIsSaved(true);
                onSavedChange?.(id, true);
            }
        } catch (err) {
            console.error("Failed to toggle saved scholarship:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col h-full relative">
            {isStudent && (
                <button
                    type="button"
                    onClick={handleToggleSave}
                    disabled={isSaving}
                    title={isSaved ? "Remove from saved" : "Save for later"}
                    className={`absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-sm transition-colors disabled:opacity-60 ${isSaved ? "bg-elm text-white" : "bg-white/90 text-gray-500 hover:text-elm"
                        }`}
                >
                    {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    )}
                </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image || "/images/scholarship-agaaw.png"} alt={title} className="w-full h-48 object-cover" />
            <div className="p-5 flex flex-col flex-1">
                {funding && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-elm/10 px-3 py-1 text-xs font-semibold text-elm">
                        {funding}
                    </span>
                )}
                <h3 className="text-xl font-bold text-codgray leading-tight">{title}</h3>
                <p className="text-bombay mt-1">{university}</p>

                <div className="mt-auto border-t border-bombay/10 pt-4 mt-4">
                    <p className="text-sm text-red-600 font-medium">Deadline: {deadline}</p>
                    {amount && <p className="text-sm text-bombay mt-1">{amount}</p>}
                    <Link
                        href={`/scholarships/${slug}`}
                        className="inline-block mt-2 text-elm font-semibold hover:underline transition-colors"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
