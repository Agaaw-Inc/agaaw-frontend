"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { Category } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";

interface CategoryPickerProps {
  /** Open categories only — "coming soon" ones can't be picked. */
  categories: Category[];
  selected: Set<string>;
  onToggle: (categoryId: string) => void;
  disabled?: boolean;
}

/**
 * Multi-select of categories as photographs. Used in onboarding (students
 * and mentors) and in profile settings, so the choice looks the same
 * everywhere it's made.
 */
export default function CategoryPicker({ categories, selected, onToggle, disabled }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {categories.map((category) => {
        const visual = visualFor(category.slug);
        const isOn = selected.has(category.id);
        return (
          <button
            key={category.id}
            type="button"
            role="checkbox"
            aria-checked={isOn}
            disabled={disabled}
            onClick={() => onToggle(category.id)}
            className={`group flex items-stretch overflow-hidden rounded-2xl bg-white text-left ring-2 transition-all disabled:opacity-60 ${
              isOn ? "ring-elm" : "ring-ink/10 hover:ring-ink/30"
            }`}
          >
            <div className="relative w-28 shrink-0 bg-paper-deep sm:w-32">
              <Image src={visual.image} alt={visual.alt} fill sizes="128px" className="object-cover" />
            </div>
            <div className="flex flex-1 items-start justify-between gap-3 p-4">
              <div>
                <p className="text-lg font-bold leading-tight text-ink">{category.name}</p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{visual.tagline}</p>
              </div>
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  isOn ? "border-elm bg-elm text-white" : "border-ink/20 text-transparent"
                }`}
              >
                <Check size={15} strokeWidth={3} />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
