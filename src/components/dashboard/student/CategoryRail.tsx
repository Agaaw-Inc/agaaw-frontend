"use client";

import Image from "next/image";
import Link from "next/link";
import type { CategoryWithCount } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";

/**
 * Every open category, as photographs — the student's way into mentors
 * beyond study abroad. Scrolls sideways on phones instead of stacking.
 */
export default function CategoryRail({
  categories,
  mySlugs,
  isLoading,
}: {
  categories: CategoryWithCount[];
  /** The student's own categories — shown first and marked. */
  mySlugs: Set<string>;
  isLoading: boolean;
}) {
  const open = categories
    .filter((c) => c.isActive)
    .sort((a, b) => Number(mySlugs.has(b.slug)) - Number(mySlugs.has(a.slug)));

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">Get help with…</h2>
        <Link href="/dashboard/student/profile" className="text-sm font-semibold text-ink-soft hover:text-ink hover:underline">
          Change my categories
        </Link>
      </div>

      <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 w-60 shrink-0 animate-pulse rounded-[22px] bg-paper-deep md:w-auto" />
            ))
          : open.map((category) => {
              const visual = visualFor(category.slug);
              return (
                <Link
                  key={category.id}
                  href={`/mentors?category=${category.slug}`}
                  className="group relative h-44 w-60 shrink-0 snap-start overflow-hidden rounded-[22px] bg-paper-deep md:w-auto"
                >
                  <Image
                    src={visual.image}
                    alt={visual.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  {mySlugs.has(category.slug) && (
                    <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Yours
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border-l-[5px] bg-card px-3 py-2 text-ink" style={{ borderLeftColor: visual.accent }}>
                    <p className="font-display text-base font-extrabold leading-tight">{category.name}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink/70">
                      {category.mentorCount > 0
                        ? `${category.mentorCount} mentor${category.mentorCount === 1 ? "" : "s"}`
                        : "New category"}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
