"use client";

import { Check, Loader2, Plus } from "lucide-react";
import CategoryIcon from "@/components/categories/CategoryIcon";
import type { Category } from "@/lib/categories";

interface CategoryMembershipProps {
    categories: Category[];
    joinedIds: Set<string>;
    /** The category currently being joined/left, if any. */
    busyId: string | null;
    onToggle: (category: Category) => void;
}

/** Pick the categories you mentor in. Click to join; click again to leave. */
export default function CategoryMembership({ categories, joinedIds, busyId, onToggle }: CategoryMembershipProps) {
    return (
        <div id="categories" className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm scroll-mt-24">
            <h2 className="text-lg font-bold text-gray-900">Your categories</h2>
            <p className="text-sm text-gray-500 mt-1 mb-5">
                Choose what you can help with. You can only add services in categories you&apos;ve joined.
            </p>

            <div className="flex flex-wrap gap-2.5">
                {categories.map((category) => {
                    const joined = joinedIds.has(category.id);
                    const busy = busyId === category.id;
                    const comingSoon = !category.isActive;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => onToggle(category)}
                            disabled={comingSoon || busyId !== null}
                            aria-pressed={joined}
                            title={comingSoon ? "Coming soon" : joined ? `Leave ${category.name}` : `Join ${category.name}`}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${joined
                                ? "border-teal-600 bg-teal-600 text-white hover:bg-teal-700"
                                : comingSoon
                                    ? "border-gray-200 bg-gray-50 text-gray-400"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-teal-500 hover:text-teal-700"
                                } ${busyId !== null && !busy ? "opacity-60" : ""}`}
                        >
                            {busy ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : joined ? (
                                <Check size={16} />
                            ) : comingSoon ? (
                                <CategoryIcon name={category.icon} size={16} />
                            ) : (
                                <Plus size={16} />
                            )}
                            {category.name}
                            {comingSoon && <span className="text-[10px] font-bold uppercase tracking-wider">Soon</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
