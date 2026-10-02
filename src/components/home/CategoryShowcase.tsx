import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryWithCount } from "@/lib/categories";
import { visualFor } from "@/lib/categoryVisuals";

function mentorLabel(count: number) {
  if (count === 0) return "New category";
  return `${count} mentor${count === 1 ? "" : "s"}`;
}

/**
 * "What do you need help with?" — one photograph per category. The
 * highlighted category (study abroad) gets the big tile; the rest share the
 * other column; "coming soon" ones sit in a quiet strip underneath.
 */
export default function CategoryShowcase({ categories }: { categories: CategoryWithCount[] }) {
  const open = categories.filter((c) => c.isActive);
  const featured = open.find((c) => c.isHighlight) ?? open[0];
  const others = open.filter((c) => c.id !== featured?.id);
  const comingSoon = categories.filter((c) => !c.isActive);

  if (!featured) return null;

  return (
    <section id="categories" className="scroll-mt-24 bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-5xl">
            What do you need help with?
          </h2>
          <p className="max-w-sm text-ink-soft">
            Pick an area. Every mentor in it has done the thing you&apos;re trying to do, and was approved by the Agaaw team before they could join.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <CategoryTile category={featured} size="large" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {others.map((category, i) => (
              <CategoryTile
                key={category.id}
                category={category}
                // The last odd tile spans the row so the grid never has a hole.
                size={others.length % 2 === 1 && i === others.length - 1 ? "wide" : "small"}
              />
            ))}
          </div>
        </div>

        {comingSoon.length > 0 && (
          <div className="mt-5 flex flex-col gap-4 rounded-[28px] border-2 border-dashed border-ink/15 p-5 sm:flex-row sm:items-center">
            {comingSoon.map((category) => {
              const visual = visualFor(category.slug);
              return (
                <div key={category.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl grayscale">
                    <Image src={visual.image} alt={visual.alt} fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-ink">
                      {category.name}{" "}
                      <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        Coming soon
                      </span>
                    </p>
                    <p className="text-sm text-ink-soft">{visual.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryTile({ category, size }: { category: CategoryWithCount; size: "large" | "small" | "wide" }) {
  const visual = visualFor(category.slug);
  const height = size === "large" ? "h-[440px] lg:h-full lg:min-h-[560px]" : "h-[270px]";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative block overflow-hidden rounded-[28px] bg-paper-deep ${height} ${size === "wide" ? "sm:col-span-2" : ""}`}
    >
      <Image
        src={visual.image}
        alt={visual.alt}
        fill
        sizes={size === "large" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* Solid label tab — no gradient wash over the photo */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div className="rounded-2xl border-l-[6px] bg-card px-4 py-3 text-ink shadow-sm" style={{ borderLeftColor: visual.accent }}>
          <p className={`font-display font-extrabold leading-tight tracking-[-0.02em] ${size === "large" ? "text-3xl" : "text-xl"}`}>
            {category.name}
          </p>
          {size === "large" && <p className="mt-1 max-w-xs text-sm font-medium text-ink/80">{visual.tagline}</p>}
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink/70">{mentorLabel(category.mentorCount)}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-ink transition-transform group-hover:translate-x-1">
          <ArrowRight size={20} />
        </span>
      </div>
    </Link>
  );
}
