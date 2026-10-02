"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import CategoryPicker from "@/components/categories/CategoryPicker";
import { getCategories, type Category } from "@/lib/categories";

const COPY = {
  student: {
    title: "What do you need help with?",
    body: "Pick everything that applies. We'll suggest mentors, scholarships and articles to match — you can change this any time in your profile.",
  },
  mentor: {
    title: "What can you help with?",
    body: "Pick the areas you've got real experience in. Students find mentors by category, and you'll add services under each one.",
  },
};

interface OnboardingCategoryStepProps {
  role: "student" | "mentor";
  /** Category ids already saved (e.g. the student refreshed mid-onboarding). */
  initialIds?: string[];
  /** Save the choice. Throw to show the error and stay on this step. */
  onContinue: (categoryIds: string[], categories: Category[]) => Promise<void>;
}

export default function OnboardingCategoryStep({ role, initialIds = [], onContinue }: OnboardingCategoryStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(initialIds));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((all) => setCategories(all.filter((c) => c.isActive)))
      .catch(() => setError("Couldn't load categories. Please refresh."))
      .finally(() => setIsLoading(false));
  }, []);

  // Pre-tick saved choices once they arrive (they may load after mount).
  const initialKey = initialIds.join(",");
  useEffect(() => {
    if (initialKey) setSelected(new Set(initialKey.split(",")));
  }, [initialKey]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleContinue = async () => {
    if (selected.size === 0) {
      setError("Choose at least one category.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onContinue([...selected], categories.filter((c) => selected.has(c.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please try again.");
      setIsSaving(false);
    }
  };

  const copy = COPY[role];

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center gap-3 border-b border-ink/10 bg-white px-6 py-4">
        <Image src="/Agaaw_logo_noBG.png" alt="" width={36} height={36} />
        <span className="text-lg font-bold text-ink">Agaaw</span>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-elm">Getting started</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-5xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{copy.body}</p>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-elm" />
            </div>
          ) : (
            <CategoryPicker categories={categories} selected={selected} onToggle={toggle} disabled={isSaving} />
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-maroon/20 bg-maroon-soft px-4 py-3 text-sm font-medium text-maroon">
            {error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-sm text-ink-soft">{selected.size > 0 ? `${selected.size} selected` : "Nothing selected yet"}</p>
          <button
            type="button"
            onClick={() => void handleContinue()}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 font-semibold text-white transition-colors hover:bg-forest disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
