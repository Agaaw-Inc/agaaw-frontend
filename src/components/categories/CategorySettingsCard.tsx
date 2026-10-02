"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Loader2, Pencil, X } from "lucide-react";
import CategoryPicker from "@/components/categories/CategoryPicker";
import {
  getCategories,
  getMyCategories,
  getMyStudentCategories,
  joinCategory,
  leaveCategory,
  setMyStudentCategories,
  type Category,
} from "@/lib/categories";

const COPY = {
  student: {
    title: "What I need help with",
    hint: "Shapes your dashboard: suggested mentors, scholarships and articles.",
    empty: "No categories chosen yet.",
  },
  mentor: {
    title: "Service categories",
    hint: "Students find you under these. You add services within each one.",
    empty: "You haven't joined a category yet.",
  },
};

/**
 * The categories on a profile, with an editor. Students replace their whole
 * selection in one call; mentors join/leave one at a time (leaving is
 * refused while they still have active services in that category).
 */
export default function CategorySettingsCard({ role }: { role: "student" | "mentor" }) {
  const [mine, setMine] = useState<Category[]>([]);
  const [all, setAll] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMine = role === "student" ? getMyStudentCategories() : getMyCategories();
    Promise.all([loadMine, getCategories()])
      .then(([own, every]) => {
        setMine(own);
        setAll(every.filter((c) => c.isActive));
      })
      .catch(() => setError("Couldn't load categories."))
      .finally(() => setIsLoading(false));
  }, [role]);

  const openEditor = () => {
    setDraft(new Set(mine.map((c) => c.id)));
    setError(null);
    setEditing(true);
  };

  const toggle = (id: string) =>
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const save = async () => {
    if (draft.size === 0) {
      setError("Choose at least one category.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (role === "student") {
        setMine(await setMyStudentCategories([...draft]));
      } else {
        const current = new Set(mine.map((c) => c.id));
        let latest = mine;
        for (const id of draft) if (!current.has(id)) latest = await joinCategory(id);
        // e.g. "You still have 2 active services in this category. Delete them first."
        for (const id of current) if (!draft.has(id)) latest = await leaveCategory(id);
        setMine(latest);
      }
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      // Mentors: some joins may have succeeded before the error — reload the truth.
      if (role === "mentor") getMyCategories().then(setMine).catch(() => {});
    } finally {
      setIsSaving(false);
    }
  };

  const copy = COPY[role];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} className="text-elm" />
          <h2 className="text-lg font-bold text-gray-900">{copy.title}</h2>
        </div>
        <button
          type="button"
          onClick={openEditor}
          disabled={isLoading}
          aria-label={`Edit ${copy.title.toLowerCase()}`}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 disabled:opacity-40"
        >
          <Pencil size={18} />
        </button>
      </div>
      <p className="mb-4 text-sm text-gray-500">{copy.hint}</p>

      {isLoading ? (
        <div className="h-9 animate-pulse rounded-lg bg-gray-100" />
      ) : mine.length === 0 ? (
        <p className="text-sm italic text-gray-400">{copy.empty}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {mine.map((c) => (
            <span key={c.id} className="rounded-full border border-elm/20 bg-elm/5 px-3 py-1.5 text-sm font-semibold text-elm">
              {c.name}
            </span>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="category-editor-title">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 id="category-editor-title" className="text-xl font-bold text-gray-900">{copy.title}</h3>
              <button type="button" onClick={() => setEditing(false)} disabled={isSaving} aria-label="Close" className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <CategoryPicker categories={all} selected={draft} onToggle={toggle} disabled={isSaving} />
              {error && (
                <p role="alert" className="mt-4 rounded-lg border border-maroon/20 bg-maroon-soft px-3 py-2 text-sm font-medium text-maroon">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50 p-5">
              <button type="button" onClick={() => setEditing(false)} disabled={isSaving} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={() => void save()} disabled={isSaving} className="flex items-center gap-2 rounded-lg bg-elm px-5 py-2.5 text-sm font-bold text-white hover:bg-elm-dark disabled:opacity-50">
                {isSaving && <Loader2 size={16} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
